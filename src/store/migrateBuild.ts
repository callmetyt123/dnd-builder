import { defaultSpeciesChoices } from "../rules/species";
import { SPECIES } from "../data/species";
import type { SpeciesId } from "../rules/types";
import { defaultOriginChoices } from "../rules/origins";
import { isRecord } from "../rules/validator/buildShape";
import type { ClassId } from "../rules/types";

// v0.6 把赌具和魔法学徒存进职业配置；迁移保留原选择，畸形数据仍交给边界拒绝。
function migrateLegacy(value: unknown): unknown {
  if (!isRecord(value) || !isRecord(value.choices) || value.choices.origin !== undefined) return value;
  if (!["fighter", "wizard", "druid", "warlock", "ranger"].includes(String(value.classId))) return value;
  const choices = value.choices;
  const legacy = choices[value.classId as string];
  const origin = defaultOriginChoices(value.classId as ClassId);
  const gamingSet = isRecord(legacy) && legacy.gamingSet !== undefined ? legacy.gamingSet : choices.soldierGamingSet ?? origin.gamingSet;
  const magicInitiate = value.classId === "wizard" && isRecord(legacy)
    ? { cantrips: legacy.initiateCantrips, spell: legacy.initiateSpell, ability: legacy.initiateAbility }
    : origin.magicInitiate;
  return { ...value, choices: { ...choices, origin: { gamingSet, magicInitiate } } };
}

// v0.7 草稿补齐新增选择；不覆盖已保存的值，也不修复恶意或畸形数据。
export function migrateBuild(input: unknown): unknown {
  const value = migrateLegacy(input);
  if (!isRecord(value) || !isRecord(value.choices) || !isRecord(value.choices.origin) || !Object.prototype.hasOwnProperty.call(SPECIES, String(value.speciesId))) return value;
  const origin = { ...defaultOriginChoices(value.classId as ClassId), ...value.choices.origin };
  return { ...value, choices: { species: defaultSpeciesChoices(value.speciesId as SpeciesId), ...value.choices, origin } };
}
