import type { CharacterBuild } from "./types";

export function defaultBuild(): CharacterBuild {
  return {
    schemaVersion: 1,
    level: 3,
    classId: "fighter",
    subclassId: "champion",
    speciesId: "dwarf",
    backgroundId: "soldier",
    profileId: "fighter-heavy",
    playstyle: { tags: ["melee", "durability"], complexity: "simple" },
    abilities: {
      baseAssignment: {
        strength: 15,
        dexterity: 13,
        constitution: 14,
        intelligence: 8,
        wisdom: 12,
        charisma: 10,
      },
      backgroundBoosts: { strength: 2, constitution: 1 },
    },
    choices: {
      languages: ["dwarvish", "giant"],
      soldierGamingSet: "dice-set",
      fighterSkills: ["perception", "survival"],
      fightingStyle: "defense",
      weaponMasteries: ["greatsword", "flail", "javelin"],
    },
    equipment: { classPackage: "fighter-a", backgroundPackage: "soldier-a" },
    identity: { name: "", alignment: undefined, age: 40, personalityTraits: [] },
  };
}

