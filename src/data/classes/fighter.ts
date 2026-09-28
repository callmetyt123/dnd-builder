import type { SkillId } from "../../rules/types";

export const FIGHTER = {
  id: "fighter" as const,
  hitDie: 10,
  savingThrowProficiencies: ["strength", "constitution"] as const,
  skillOptions: [
    "acrobatics",
    "animal-handling",
    "athletics",
    "history",
    "insight",
    "intimidation",
    "persuasion",
    "perception",
    "survival",
  ] satisfies SkillId[],
  skillCount: 2,
  weaponMasteryCount: 3,
  subclassLevel: 3,
  secondWindUsesAtLevel3: 2,
  actionSurgeUsesAtLevel3: 1,
  fixedHpAfterFirstLevel: 6,
  equipmentPackages: {
    "fighter-a": [
      { id: "chain-mail", quantity: 1 },
      { id: "greatsword", quantity: 1 },
      { id: "flail", quantity: 1 },
      { id: "javelin", quantity: 8 },
      { id: "dungeoneers-pack", quantity: 1 },
      { id: "gp", quantity: 4 },
    ],
  },
} as const;
