import { beast } from "../../data/beasts";
import { ABILITIES, SKILLS } from "../../data/core";
import type { DerivedCharacter, DerivedRoll, SkillId } from "../types";
import { abilityModifier } from "./math";

// 原形数据始终作为输入；不会随多次变形累积属性或重新计算 HP。
export function deriveWildShape(base: DerivedCharacter, formId?: string): DerivedCharacter {
  const form = formId && base.wildShape?.knownForms.includes(formId) ? beast(formId) : undefined;
  if (!form) return base;
  const abilities = { ...base.abilities };
  for (const id of ["strength", "dexterity", "constitution"] as const) abilities[id] = { score: form.physical[id], modifier: abilityModifier(form.physical[id]) };
  const roll = (original: DerivedRoll, modifier: number, monster?: number): DerivedRoll => {
    const rank = original.proficiency === "none" && monster !== undefined ? "proficient" : original.proficiency;
    const bonus = rank === "expertise" ? base.proficiencyBonus * 2 : rank === "proficient" ? base.proficiencyBonus : 0;
    return { modifier: Math.max(modifier + bonus, monster ?? -Infinity), proficiency: rank, advantageSources: [], disadvantageSources: [], state: "normal" };
  };
  const saves = Object.fromEntries(ABILITIES.map((id) => [id, roll(base.savingThrows[id], abilities[id].modifier, form.saves?.[id])])) as DerivedCharacter["savingThrows"];
  const skills = Object.fromEntries((Object.keys(SKILLS) as SkillId[]).map((id) => {
    const a = SKILLS[id].defaultAbility;
    // 术师的加值属于职业特性，保留在兽形的智力检定中。
    const magician = base.features.includes("magician") && ["arcana", "nature"].includes(id) ? Math.max(1, abilities.wisdom.modifier) : 0;
    return [id, roll(base.skills[id], abilities[a].modifier + magician, form.skills[id])];
  })) as DerivedCharacter["skills"];
  return { ...base, abilities, savingThrows: saves, skills, passivePerception: 10 + skills.perception.modifier,
    armorClass: base.features.includes("circle-forms") ? Math.max(form.armorClass, 13 + abilities.wisdom.modifier) : form.armorClass, armorNote: base.features.includes("circle-forms") ? "野兽 AC 与 13 + 感知，取高值" : "使用野兽数据中的 AC",
    speed: form.speed, initiative: roll({ ...base.initiative, proficiency: "none" }, abilities.dexterity.modifier + (base.features.includes("alert") ? base.proficiencyBonus : 0)),
    attacks: [], senses: { darkvision: form.darkvision }, resistances: form.resistances ?? [],
    features: base.features.filter((id) => !base.speciesFeatures.includes(id)),
    innateMagic: base.innateMagic.filter((m) => m.source !== "种族法术"),
  };
}
