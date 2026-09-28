import { deriveCharacter } from "../src/rules/engine/deriveCharacter";
import type { CharacterBuild } from "../src/rules/types";
import { validateBuild } from "../src/rules/validator/validateBuild";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

const build: CharacterBuild = {
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
  identity: { name: "测试角色", age: 40, alignment: "NG" },
};

const derived = deriveCharacter(build);
assert(derived.proficiencyBonus === 2, "PB should be +2");
assert(derived.abilities.strength.score === 17 && derived.abilities.strength.modifier === 3, "STR should be 17 (+3)");
assert(derived.maxHp === 31, "HP should be 31");
assert(derived.armorClass === 17, "AC should be 17 (chain mail + Defense)");
assert(derived.speed === 30, "speed should stay 30");
assert(derived.initiative.modifier === 1 && derived.initiative.state === "advantage", "initiative should be +1 with advantage");
assert(derived.skills.athletics.modifier === 5 && derived.skills.athletics.state === "advantage", "Athletics should be +5 with advantage");
assert(derived.skills.perception.modifier === 3, "Perception should be +3");
assert(derived.savingThrows.strength.modifier === 5, "STR save should be +5");
assert(derived.savingThrows.constitution.modifier === 4, "CON save should be +4");
assert(derived.attacks.find((a) => a.weaponId === "greatsword")?.attackBonus === 5, "greatsword attack should be +5");
assert(derived.attacks.find((a) => a.weaponId === "greatsword")?.damageModifier === 3, "greatsword damage modifier should be +3");
assert(derived.attacks.find((a) => a.weaponId === "greatsword")?.mastery?.id === "graze", "greatsword mastery should be graze");
assert(derived.criticalThreshold === 19, "Champion critical threshold should be 19");
assert(derived.resources.find((r) => r.id === "second-wind")?.max === 2, "Second Wind should have 2 uses");
assert(derived.resources.find((r) => r.id === "action-surge")?.max === 1, "Action Surge should have 1 use");

const validation = validateBuild(build);
assert(validation.canGenerate, "complete golden fixture should be generatable");

const incomplete: CharacterBuild = { ...build, identity: { ...build.identity, name: "", alignment: undefined } };
const incompleteValidation = validateBuild(incomplete);
assert(!incompleteValidation.complete && !incompleteValidation.canGenerate, "missing name/alignment should block generation");
assert(incompleteValidation.messages.filter((m) => m.domain === "completeness" && m.severity === "blocker").length === 2, "should have two identity blockers");

console.log("rules selftest: OK");
console.log(JSON.stringify({
  hp: derived.maxHp,
  ac: derived.armorClass,
  initiative: derived.initiative,
  athletics: derived.skills.athletics,
  greatsword: derived.attacks.find((a) => a.weaponId === "greatsword"),
  criticalThreshold: derived.criticalThreshold,
}, null, 2));
