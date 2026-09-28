import type { AbilityScores } from "../types";

export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function proficiencyBonus(level: number): number {
  return 2 + Math.floor((level - 1) / 4);
}

export function normalizeAdvantage(advantages: string[], disadvantages: string[]) {
  if (advantages.length > 0 && disadvantages.length === 0) return "advantage" as const;
  if (disadvantages.length > 0 && advantages.length === 0) return "disadvantage" as const;
  return "normal" as const;
}

export function addAbilityBoosts(base: AbilityScores, boosts: Partial<Record<keyof AbilityScores, number>>): AbilityScores {
  return {
    strength: base.strength + (boosts.strength ?? 0),
    dexterity: base.dexterity + (boosts.dexterity ?? 0),
    constitution: base.constitution + (boosts.constitution ?? 0),
    intelligence: base.intelligence + (boosts.intelligence ?? 0),
    wisdom: base.wisdom + (boosts.wisdom ?? 0),
    charisma: base.charisma + (boosts.charisma ?? 0),
  };
}
