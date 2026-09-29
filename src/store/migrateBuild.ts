import { defaultOriginChoices } from "../rules/origins";
import { isRecord } from "../rules/validator/buildShape";
import type { ClassId } from "../rules/types";

// v0.6 把赌具和魔法学徒存进职业配置；迁移保留原选择，畸形数据仍交给边界拒绝。
export function migrateBuild(value: unknown): unknown {
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
