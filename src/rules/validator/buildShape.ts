import { NEW_SUBCLASSES } from "../../data/newSubclasses";
import type { NewSubclassId } from "../types";
import { isNewClass } from "../../data/newClasses";
import { DRUID_SUBCLASSES, WARLOCK_SUBCLASSES, RANGER_SUBCLASSES } from "../../data/primalSubclasses";
import { FIGHTER_SUBCLASSES, WIZARD_SUBCLASSES } from "../../data/expandedSubclasses";
import { ROGUE_SUBCLASSES } from "../../data/rogue";
import { SPECIES } from "../../data/species";
import { BACKGROUNDS } from "../../data/backgrounds";
import { ABILITIES } from "../../data/core";
import type { CharacterBuild } from "../types";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function strings(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
const finite = (value: unknown) => typeof value === "number" && Number.isFinite(value);

// 存储数据先经过结构边界；不把 JSON 类型断言当作运行时校验。
function magicShape(value: unknown): boolean {
  return isRecord(value) && strings(value.cantrips) && typeof value.spell === "string" && ["intelligence", "wisdom", "charisma"].includes(String(value.ability));
}
function featShape(value: unknown): boolean {
  return isRecord(value) && strings(value.skilled) && strings(value.crafter) && strings(value.musician) && ["cleric", "druid", "wizard"].includes(String(value.magicList)) && magicShape(value.magicInitiate);
}
export function hasBuildShape(value: unknown): value is CharacterBuild {
  if (!isRecord(value)) return false;
  const { abilities: a, choices: c, equipment: e, identity: i, playstyle: p } = value;
  if (!isRecord(a) || !isRecord(c) || !isRecord(e) || !isRecord(i) || !isRecord(p)) return false;
  if (!isRecord(a.baseAssignment) || !isRecord(a.backgroundBoosts)) return false;
  const base = a.baseAssignment;
  if (isNewClass(String(value.classId))) {
    const n = c[String(value.classId)];
    if (isRecord(n) && !["wildHeart", "manifestation"].every(k => n[k] === undefined || typeof n[k] === "string")) return false;
    if (!isRecord(n) || !["skills", "expertise", "tools", "metamagic", "cantrips", "prepared"].every((k) => strings(n[k])) || !["instrument", "order", "style"].every((k) => typeof n[k] === "string")) return false;
  }
  const f = c.fighter;
  if (f !== undefined && (!isRecord(f) || !["maneuvers", "cantrips", "prepared", "bondedWeapons"].every((k) => strings(f[k])) || typeof f.studentSkill !== "string" || typeof f.artisanTool !== "string")) return false;
  const rogue = c.rogue;
  if (value.classId === "rogue" && (!isRecord(rogue) || !["skills", "expertise", "cantrips", "prepared"].every((k) => strings(rogue[k])) || typeof rogue.extraLanguage !== "string")) return false;
  const ranger = c.ranger;
  if (value.classId === "ranger" && (!isRecord(ranger) || !["skills", "prepared", "extraLanguages"].every((k) => strings(ranger[k])) || !["expertise", "style"].every((k) => typeof ranger[k] === "string") || !isRecord(ranger.primal) || !["form", "damage", "appearance"].every((k) => typeof (ranger.primal as Record<string, unknown>)[k] === "string"))) return false;
  const pact = c.warlock;
  if (value.classId === "warlock" && (!isRecord(pact) || !["skills", "cantrips", "prepared"].every((k) => strings(pact[k])) || !Array.isArray(pact.invocations) || !pact.invocations.every((v) => isRecord(v) && typeof v.id === "string" && (v.target === undefined || typeof v.target === "string")))) return false;
  const d = c.druid;
  if (value.classId === "druid" && (!isRecord(d) || !["skills", "cantrips", "prepared", "knownForms"].every((k) => strings(d[k])) || typeof d.order !== "string")) return false;
  if (isRecord(d) && !["land", "starForm", "starMap"].every((k) => d[k] === undefined || typeof d[k] === "string")) return false;
  if (isRecord(pact) && pact.psychicDamage !== undefined && typeof pact.psychicDamage !== "string") return false;
  if (isRecord(ranger) && !["huntersPrey", "feySkill", "feyGift"].every((k) => ranger[k] === undefined || typeof ranger[k] === "string")) return false;
  const w = c.wizard;
  if (value.classId === "wizard" && (!isRecord(w) || !["skills", "cantrips", "earlyBook", "level3Book", "evocationBook", "prepared"].every((k) => strings(w[k])) || typeof w.scholar !== "string" || (w.illusionCantrip !== undefined && typeof w.illusionCantrip !== "string"))) return false;
  const origin = c.origin;
  if (!isRecord(origin) || !["gamingSet", "artisanTool", "instrument"].every((k) => typeof origin[k] === "string") || !featShape(origin)) return false;
  const species = c.species;
  if (!isRecord(species) || !["lineage", "skill", "cantrip", "humanFeat"].every((k) => typeof species[k] === "string") || !["small", "medium"].includes(String(species.size)) || !["intelligence", "wisdom", "charisma"].includes(String(species.ability)) || !featShape(species.feat)) return false;
  return ABILITIES.every((id) => finite(base[id])) && Object.keys(base).length === 6
    && Object.values(a.backgroundBoosts).every(finite)
    && strings(c.languages) && strings(c.fighterSkills) && strings(c.weaponMasteries)
    && typeof i.name === "string"
    && ["gender", "alignment", "appearance", "description"].every((key) => i[key] === undefined || typeof i[key] === "string")
    && (i.age === undefined || finite(i.age))
    && (i.personalityTraits === undefined || strings(i.personalityTraits))
    && strings(p.tags) && ["simple", "balanced", "deep"].includes(String(p.complexity));
}

export function isSupportedBuild(build: CharacterBuild): boolean {
  if (!Object.prototype.hasOwnProperty.call(BACKGROUNDS, build.backgroundId) || build.equipment.backgroundPackage !== `${build.backgroundId}-a`) return false;
  if (build.schemaVersion !== 1 || build.level !== 3 || !Object.prototype.hasOwnProperty.call(SPECIES, build.speciesId)) return false;
  if (isNewClass(build.classId)) return NEW_SUBCLASSES[build.subclassId as NewSubclassId]?.classId === build.classId && build.profileId === build.classId && build.equipment.classPackage === `${build.classId}-a`;
  if (build.classId === "rogue") return Object.prototype.hasOwnProperty.call(ROGUE_SUBCLASSES, build.subclassId) && build.profileId === "rogue" && build.equipment.classPackage === "rogue-a";
  if (build.classId === "ranger") return Object.prototype.hasOwnProperty.call(RANGER_SUBCLASSES, build.subclassId) && build.profileId === "ranger-beast-master" && build.equipment.classPackage === "ranger-a";
  if (build.classId === "warlock") return Object.prototype.hasOwnProperty.call(WARLOCK_SUBCLASSES, build.subclassId) && build.profileId === "warlock-fiend" && build.equipment.classPackage === "warlock-a";
  if (build.classId === "druid") return Object.prototype.hasOwnProperty.call(DRUID_SUBCLASSES, build.subclassId) && build.profileId === "druid-moon" && build.equipment.classPackage === "druid-a";
  if (build.classId === "wizard") return Object.prototype.hasOwnProperty.call(WIZARD_SUBCLASSES, build.subclassId) && build.profileId === "wizard-evoker" && build.equipment.classPackage === "wizard-a";
  return build.classId === "fighter" && Object.prototype.hasOwnProperty.call(FIGHTER_SUBCLASSES, build.subclassId)
    && build.profileId === "fighter-heavy" && build.choices.fightingStyle === "defense"
    && build.equipment.classPackage === "fighter-a";
}
