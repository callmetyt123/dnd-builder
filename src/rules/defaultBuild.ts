import { defaultOriginChoices } from "./origins";
import type { CharacterBuild, ClassId } from "./types";

export function defaultBuild(classId: ClassId = "fighter"): CharacterBuild {
  if (classId === "ranger") {
    const base = defaultBuild();
    return { ...base, classId, subclassId: "beast-master", backgroundId: "wayfarer", profileId: "ranger-beast-master",
      abilities: { baseAssignment: { strength: 10, dexterity: 15, constitution: 13, intelligence: 12, wisdom: 14, charisma: 8 }, backgroundBoosts: { dexterity: 2, wisdom: 1 } },
      choices: { ...base.choices, origin: defaultOriginChoices(classId), fighterSkills: [], weaponMasteries: ["longbow", "shortsword"], ranger: { skills: ["perception", "survival", "animal-handling"], expertise: "perception", extraLanguages: ["elvish", "orc"], style: "archery", prepared: ["cure-wounds", "ensnaring-strike", "goodberry", "speak-with-animals"], primal: { form: "land", damage: "piercing", appearance: "狼" } } },
      equipment: { classPackage: "ranger-a", backgroundPackage: "wayfarer-a" } };
  }
  if (classId === "warlock") {
    const base = defaultBuild();
    return { ...base, classId, subclassId: "fiend", backgroundId: "wayfarer", profileId: "warlock-fiend",
      abilities: { baseAssignment: { strength: 8, dexterity: 13, constitution: 14, intelligence: 10, wisdom: 12, charisma: 15 }, backgroundBoosts: { charisma: 2, dexterity: 1 } },
      choices: { ...base.choices, origin: defaultOriginChoices(classId), fighterSkills: [], weaponMasteries: [], warlock: { skills: ["arcana", "intimidation"], cantrips: ["eldritch-blast", "prestidigitation"], prepared: ["hex", "armor-of-agathys", "misty-step", "invisibility"], invocations: [{ id: "agonizing-blast", target: "eldritch-blast" }, { id: "repelling-blast", target: "eldritch-blast" }, { id: "eldritch-mind" }] } },
      equipment: { classPackage: "warlock-a", backgroundPackage: "wayfarer-a" },
    };
  }
  if (classId === "druid") {
    const base = defaultBuild();
    return { ...base, classId, subclassId: "moon", backgroundId: "hermit", profileId: "druid-moon",
      abilities: { baseAssignment: { strength: 8, dexterity: 14, constitution: 13, intelligence: 12, wisdom: 15, charisma: 10 }, backgroundBoosts: { wisdom: 2, constitution: 1 } },
      choices: { ...base.choices, origin: defaultOriginChoices(classId), fighterSkills: [], weaponMasteries: [], druid: { skills: ["perception", "nature"], order: "magician", cantrips: ["guidance", "druidcraft", "thorn-whip"], prepared: ["healing-word", "entangle", "faerie-fire", "detect-magic", "lesser-restoration", "spike-growth"], knownForms: ["brown-bear", "dire-wolf", "cat", "badger"] } },
      equipment: { classPackage: "druid-a", backgroundPackage: "hermit-a" },
    };
  }
  if (classId === "wizard") {
    const base = defaultBuild();
    return { ...base, classId: "wizard", subclassId: "evoker", backgroundId: "sage", profileId: "wizard-evoker",
      abilities: { baseAssignment: { strength: 8, dexterity: 14, constitution: 13, intelligence: 15, wisdom: 12, charisma: 10 }, backgroundBoosts: { intelligence: 2, constitution: 1 } },
      choices: { ...base.choices, origin: defaultOriginChoices(classId), fighterSkills: [], weaponMasteries: [], wizard: { skills: ["insight", "investigation"], scholar: "arcana", cantrips: ["fire-bolt", "ray-of-frost", "prestidigitation"], earlyBook: ["alarm", "detect-magic", "feather-fall", "grease", "magic-missile", "shield", "sleep", "thunderwave"], level3Book: ["misty-step", "web"], evocationBook: ["scorching-ray", "shatter"], prepared: ["shield", "magic-missile", "misty-step", "web", "scorching-ray", "shatter"] } },
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
      origin: defaultOriginChoices("fighter"),
      fighterSkills: ["perception", "survival"],
      fightingStyle: "defense",
      weaponMasteries: ["greatsword", "flail", "javelin"],
    },
    equipment: { classPackage: "fighter-a", backgroundPackage: "soldier-a" },
    identity: { name: "", alignment: undefined, age: 40, personalityTraits: [] },
  };
}

