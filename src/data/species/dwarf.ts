export const DWARF = {
  id: "dwarf" as const,
  speed: 30,
  darkvision: 120,
  hpBonusPerLevel: 1,
  resistances: ["poison"],
  lifespanReference: "约 350 年",
  features: ["darkvision", "dwarven-resilience", "dwarven-toughness", "stonecunning"],
  stonecunningUses: "proficiency-bonus" as const,
} as const;
