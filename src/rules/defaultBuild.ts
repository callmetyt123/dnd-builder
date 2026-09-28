import type { CharacterBuild, ClassId } from "./types";

export function defaultBuild(classId: ClassId = "fighter"): CharacterBuild {
  if (classId === "wizard") {
    const base = defaultBuild();
    return { ...base, classId: "wizard", subclassId: "evoker", backgroundId: "sage", profileId: "wizard-evoker",
      abilities: { baseAssignment: { strength: 8, dexterity: 14, constitution: 13, intelligence: 15, wisdom: 12, charisma: 10 }, backgroundBoosts: { intelligence: 2, constitution: 1 } },
      choices: { ...base.choices, fighterSkills: [], weaponMasteries: [], wizard: { skills: ["insight", "investigation"], scholar: "arcana", cantrips: ["fire-bolt", "ray-of-frost", "prestidigitation"], earlyBook: ["alarm", "detect-magic", "feather-fall", "grease", "magic-missile", "shield", "sleep", "thunderwave"], level3Book: ["misty-step", "web"], evocationBook: ["scorching-ray", "shatter"], prepared: ["shield", "magic-missile", "misty-step", "web", "scorching-ray", "shatter"], initiateCantrips: ["light", "mage-hand"], initiateSpell: "mage-armor", initiateAbility: "intelligence" } },
      equipment: { classPackage: "wizard-a", backgroundPackage: "sage-a" },
    };
  }
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

