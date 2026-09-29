import type { CharacterBuild, PrimalSubclassId } from "./types";
import { automaticMagic, primalSubclass, DRUID_SUBCLASSES, WARLOCK_SUBCLASSES, RANGER_SUBCLASSES } from "../data/primalSubclasses";
import { DRUID_CANTRIPS, DRUID_PREPARABLE } from "../data/druidSpells";
import { WARLOCK_CANTRIPS, WARLOCK_PREPARABLE } from "../data/warlock";
import { RANGER_PREPARABLE } from "../data/ranger";
import { legalDruidForm } from "../data/beasts";
import { spell, type Spell } from "../data/spells";

// 只修复因自动授予产生的重叠名额；已有起源、属性、身份与非冲突选项不变。
export function reconcilePrimalChoices(build: CharacterBuild): CharacterBuild {
  const auto = automaticMagic(build);
  const fill = (current: string[], defaults: string[], allowed: string[], count: number, secondLimit = Infinity) => {
    const result: string[] = [];
    for (const id of [...new Set([...current, ...defaults, ...allowed])]) if (allowed.includes(id) && result.length < count && !(spell(id)?.level === 2 && result.filter((v) => spell(v)?.level === 2).length >= secondLimit)) result.push(id);
    return result;
  };
  const choices = { ...build.choices };
  if (build.classId === "druid") {
    const d = choices.druid!;
    choices.druid = { ...d, land: d.land ?? "temperate", starForm: d.starForm ?? "archer", starMap: d.starMap ?? "scroll",
      knownForms: fill(d.knownForms, build.subclassId === "moon" ? ["brown-bear", "dire-wolf", "cat", "badger"] : ["wolf", "panther", "cat", "badger"], ["brown-bear", "dire-wolf", "wolf", "panther", "cat", "badger"].filter((id) => legalDruidForm(id, build.subclassId === "moon")), 4),
      cantrips: fill(d.cantrips, ["guidance", "druidcraft", "thorn-whip"], DRUID_CANTRIPS.filter((id) => !auto.cantrips.includes(id)), d.order === "magician" ? 3 : 2),
      prepared: fill(d.prepared, ["healing-word", "entangle", "faerie-fire", "detect-magic", "lesser-restoration", "spike-growth"], DRUID_PREPARABLE.filter((id) => !auto.prepared.includes(id)), 6) };
  }
  if (build.classId === "warlock") {
    const w = choices.warlock!;
    choices.warlock = { ...w, psychicDamage: w.psychicDamage ?? "original", cantrips: fill(w.cantrips, ["eldritch-blast", "prestidigitation"], WARLOCK_CANTRIPS.filter((id) => !auto.cantrips.includes(id)), 2),
      prepared: fill(w.prepared, ["hex", "armor-of-agathys", "invisibility", "hold-person"], WARLOCK_PREPARABLE.filter((id) => !auto.prepared.includes(id)), 4, 2) };
  }
  if (build.classId === "ranger") {
    const r = choices.ranger!;
    choices.ranger = { ...r, huntersPrey: r.huntersPrey ?? "colossus-slayer", feySkill: r.feySkill ?? "persuasion", feyGift: r.feyGift ?? "butterflies", prepared: fill(r.prepared, ["cure-wounds", "ensnaring-strike", "goodberry", "speak-with-animals"], RANGER_PREPARABLE.filter((id) => !auto.prepared.includes(id)), 4) };
  }
  return { ...build, choices };
}
export function changePrimalSubclass(build: CharacterBuild, id: PrimalSubclassId): CharacterBuild {
  const table = build.classId === "druid" ? DRUID_SUBCLASSES : build.classId === "warlock" ? WARLOCK_SUBCLASSES : build.classId === "ranger" ? RANGER_SUBCLASSES : {};
  return Object.prototype.hasOwnProperty.call(table, id) ? reconcilePrimalChoices({ ...build, subclassId: id }) : build;
}
export function isPrimalBuild(build: CharacterBuild) { return !!primalSubclass(build); }
// 旧日支配者只影响魔契师来源；种族／起源法术的卡片不调用此转换。
export function primalSpell(build: CharacterBuild, id: string): Spell | undefined {
  const raw = spell(id); if (!raw) return undefined;
  const s = { ...raw, text: raw.text.replace(/感知调整值/g, "施法属性调整值").split("若通过邪魔活力祈唤")[0] };
  if (build.subclassId === "great-old-one") {
    if (["惑控", "幻术"].includes(s.school)) s.components = s.components.replace(/^[VS](?:[、，,]\s*[VS])*(?:[、，,]\s*)?/, "") || "无";
    if (build.choices.warlock?.psychicDamage === "psychic" && /伤害/.test(s.text)) s.text += " 本构筑选择将此魔契师法术造成的伤害改为心灵；施法时仍可使用原类型。";
  }
  return s;
}
