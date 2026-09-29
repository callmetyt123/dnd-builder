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
export function hasBuildShape(value: unknown): value is CharacterBuild {
  if (!isRecord(value)) return false;
  const { abilities: a, choices: c, equipment: e, identity: i, playstyle: p } = value;
  if (!isRecord(a) || !isRecord(c) || !isRecord(e) || !isRecord(i) || !isRecord(p)) return false;
  if (!isRecord(a.baseAssignment) || !isRecord(a.backgroundBoosts)) return false;
  const base = a.baseAssignment;
  const ranger = c.ranger;
  if (value.classId === "ranger" && (!isRecord(ranger) || !["skills", "prepared", "extraLanguages"].every((k) => strings(ranger[k])) || !["expertise", "style"].every((k) => typeof ranger[k] === "string") || !isRecord(ranger.primal) || !["form", "damage", "appearance"].every((k) => typeof (ranger.primal as Record<string, unknown>)[k] === "string"))) return false;
  const pact = c.warlock;
  if (value.classId === "warlock" && (!isRecord(pact) || !["skills", "cantrips", "prepared"].every((k) => strings(pact[k])) || !Array.isArray(pact.invocations) || !pact.invocations.every((v) => isRecord(v) && typeof v.id === "string" && (v.target === undefined || typeof v.target === "string")))) return false;
  const d = c.druid;
  if (value.classId === "druid" && (!isRecord(d) || !["skills", "cantrips", "prepared", "knownForms"].every((k) => strings(d[k])) || typeof d.order !== "string")) return false;
  const w = c.wizard;
  if (value.classId === "wizard" && (!isRecord(w) || !["skills", "cantrips", "earlyBook", "level3Book", "evocationBook", "prepared"].every((k) => strings(w[k])) || typeof w.scholar !== "string")) return false;
  const origin = c.origin;
  if (!isRecord(origin) || typeof origin.gamingSet !== "string" || !isRecord(origin.magicInitiate) || !strings(origin.magicInitiate.cantrips) || typeof origin.magicInitiate.spell !== "string" || !["intelligence", "wisdom", "charisma"].includes(String(origin.magicInitiate.ability))) return false;
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
  if (build.schemaVersion !== 1 || build.level !== 3 || build.speciesId !== "dwarf") return false;
  if (build.classId === "ranger") return build.subclassId === "beast-master" && build.profileId === "ranger-beast-master" && build.equipment.classPackage === "ranger-a";
  if (build.classId === "warlock") return build.subclassId === "fiend" && build.profileId === "warlock-fiend" && build.equipment.classPackage === "warlock-a";
  if (build.classId === "druid") return build.subclassId === "moon" && build.profileId === "druid-moon" && build.equipment.classPackage === "druid-a";
  if (build.classId === "wizard") return build.subclassId === "evoker" && build.profileId === "wizard-evoker" && build.equipment.classPackage === "wizard-a";
  return build.classId === "fighter" && build.subclassId === "champion"
    && build.profileId === "fighter-heavy" && build.choices.fightingStyle === "defense"
    && build.equipment.classPackage === "fighter-a";
}
