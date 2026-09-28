import type { AbilityId, SkillId } from "../rules/types";

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const;

export const ABILITIES: AbilityId[] = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

export const SKILLS: Record<SkillId, { defaultAbility: AbilityId }> = {
  acrobatics: { defaultAbility: "dexterity" },
  "animal-handling": { defaultAbility: "wisdom" },
  arcana: { defaultAbility: "intelligence" },
  athletics: { defaultAbility: "strength" },
  deception: { defaultAbility: "charisma" },
  history: { defaultAbility: "intelligence" },
  insight: { defaultAbility: "wisdom" },
  intimidation: { defaultAbility: "charisma" },
  investigation: { defaultAbility: "intelligence" },
  medicine: { defaultAbility: "wisdom" },
  nature: { defaultAbility: "intelligence" },
  perception: { defaultAbility: "wisdom" },
  performance: { defaultAbility: "charisma" },
  persuasion: { defaultAbility: "charisma" },
  religion: { defaultAbility: "intelligence" },
  "sleight-of-hand": { defaultAbility: "dexterity" },
  stealth: { defaultAbility: "dexterity" },
  survival: { defaultAbility: "wisdom" },
};

export const STANDARD_LANGUAGE_IDS = [
  "common",
  "common-sign-language",
  "dwarvish",
  "elvish",
  "giant",
  "gnomish",
  "goblin",
  "halfling",
  "orc",
] as const;
