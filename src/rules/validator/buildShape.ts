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
  const w = c.wizard;
  if (value.classId === "wizard" && (!isRecord(w) || !["skills", "cantrips", "earlyBook", "level3Book", "evocationBook", "prepared", "initiateCantrips"].every((k) => strings(w[k])) || typeof w.scholar !== "string" || typeof w.initiateSpell !== "string" || !["intelligence", "wisdom", "charisma"].includes(String(w.initiateAbility)))) return false;
  return ABILITIES.every((id) => finite(base[id])) && Object.keys(base).length === 6
    && Object.values(a.backgroundBoosts).every(finite)
    && strings(c.languages) && strings(c.fighterSkills) && strings(c.weaponMasteries)
    && (c.soldierGamingSet === undefined || typeof c.soldierGamingSet === "string")
    && typeof i.name === "string"
    && ["gender", "alignment", "appearance", "description"].every((key) => i[key] === undefined || typeof i[key] === "string")
    && (i.age === undefined || finite(i.age))
    && (i.personalityTraits === undefined || strings(i.personalityTraits))
    && strings(p.tags) && ["simple", "balanced", "deep"].includes(String(p.complexity));
}

export function isSupportedBuild(build: CharacterBuild): boolean {
  if (build.schemaVersion !== 1 || build.level !== 3 || build.speciesId !== "dwarf") return false;
  if (build.classId === "wizard") return build.subclassId === "evoker" && build.backgroundId === "sage" && build.profileId === "wizard-evoker" && build.equipment.classPackage === "wizard-a" && build.equipment.backgroundPackage === "sage-a";
  return build.classId === "fighter" && build.subclassId === "champion" && build.backgroundId === "soldier"
    && build.profileId === "fighter-heavy" && build.choices.fightingStyle === "defense"
    && build.equipment.classPackage === "fighter-a" && build.equipment.backgroundPackage === "soldier-a";
}
