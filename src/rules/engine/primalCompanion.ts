import type { DerivedCharacter } from "../types";
import { primalForm, type PrimalChoice } from "../../data/ranger";
import { abilityModifier } from "./math";
import { damageFormula } from "./format";

// 所有属性检定和豁免都加角色 PB；不把伙伴体质或矮人加值计入固定 HP 公式。
export function derivePrimalCompanion(c: DerivedCharacter, choice: PrimalChoice) {
  const form = primalForm(choice.form)!;
  const modifiers = Object.fromEntries(Object.entries(form.abilities).map(([id, score]) => [id, abilityModifier(score)]));
  return { ...form, choice, armorClass: 13 + c.abilities.wisdom.modifier, attack: c.spellcasting!.attack, dc: c.spellcasting!.dc,
    damage: damageFormula(form.dice, form.damageBonus + c.abilities.wisdom.modifier), modifiers,
    rolls: Object.fromEntries(Object.entries(modifiers).map(([id, mod]) => [id, mod + c.proficiencyBonus])), passivePerception: 12 + c.proficiencyBonus };
}
