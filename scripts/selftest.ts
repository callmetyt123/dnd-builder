import { onboardingChecks } from "./onboardingSelftest";
import { handoffChecks } from "./handoffSelftest";
import { rogueChecks } from "./rogueSelftest";
import { speciesChecks } from "./speciesSelftest";
import { defaultSpeciesChoices } from "../src/rules/species";
import { originChecks } from "./originSelftest";
import { defaultOriginChoices } from "../src/rules/origins";
import { rangerChecks } from "./rangerSelftest";
import { warlockChecks } from "./warlockSelftest";
import { druidChecks } from "./druidSelftest";
import { wizardChecks } from "./wizardSelftest";
import { parseDraft } from "../src/store/draft";
import { normalizePlayState, updatePlayState } from "../src/rules/engine/playState";
import { damageFormula } from "../src/rules/engine/format";
import { deriveCharacter } from "../src/rules/engine/deriveCharacter";
import type { CharacterBuild } from "../src/rules/types";
import { validateBuild } from "../src/rules/validator/validateBuild";

let checks = 0;
function assert(condition: unknown, message: string): asserts condition {
  checks += 1;
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
    origin: defaultOriginChoices("fighter"),
    species: defaultSpeciesChoices(),
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

// 以实际失败场景为边界：外部草稿不能绕过规则校验或让页面崩溃。
for (const value of [null, [], {}, { ...build, abilities: null }, { ...build, level: 5 }, { ...build, choices: { ...build.choices, fightingStyle: "archery" } }, { ...build, equipment: { ...build.equipment, classPackage: "missing" } }]) {
  assert(!validateBuild(value).canGenerate, "malformed or unsupported input must be rejected");
}
assert(!validateBuild({ ...build, identity: { ...build.identity, age: -1 } }).canGenerate, "negative age must be rejected");
assert(!validateBuild({ ...build, identity: { ...build.identity, alignment: "??" } }).canGenerate, "unknown alignment must be rejected");
assert(!validateBuild({ ...build, choices: { ...build.choices, origin: { ...build.choices.origin, gamingSet: "unknown" } } }).canGenerate, "unknown gaming set must be rejected");
assert(!validateBuild({ ...build, choices: { ...build.choices, weaponMasteries: ["constructor", "flail", "javelin"] } }).canGenerate, "inherited property must not be a weapon");
assert(!validateBuild({ ...build, choices: { ...build.choices, languages: ["giant", "giant"] } }).canGenerate, "duplicate languages must be rejected");
assert(!validateBuild({ ...build, choices: { ...build.choices, fighterSkills: ["arcana", "survival"] } }).canGenerate, "non-fighter skills must be rejected");
assert(validateBuild({ ...build, abilities: { ...build.abilities, backgroundBoosts: { strength: 1, dexterity: 1, constitution: 1 } } }).canGenerate, "three +1 boosts must be allowed");
assert(!validateBuild({ ...build, abilities: { ...build.abilities, backgroundBoosts: { strength: 3 } } }).canGenerate, "+3 single boost must be rejected");
assert(parseDraft("{oops").preserveOriginal, "invalid JSON must be retained for recovery");
assert(parseDraft(JSON.stringify({ build: { ...build, schemaVersion: 2 } })).preserveOriginal, "future schema must not be overwritten without recovery");
assert(parseDraft(JSON.stringify({ build, step: "unknown" })).state?.step === "review", "unknown steps must land on review");
assert(parseDraft(JSON.stringify({ build: incomplete, step: "character" })).state?.step === "review", "incomplete restored character must return to review");
assert(parseDraft(JSON.stringify({ build, step: "character" })).state?.step === "character", "v1 drafts without play state must migrate");
assert(derived.attacks.length === 5, "both equipment packages must contribute attacks");
assert(derived.attacks.find((a) => a.weaponId === "shortbow")?.attackBonus === 3, "shortbow uses DEX plus proficiency");
assert(!derived.attacks.find((a) => a.weaponId === "spear")?.mastery?.unlocked, "carried weapons do not automatically grant mastery");
assert(derived.equipment.find((i) => i.id === "gp")?.quantity === 18, "gold from class and background must be merged");
assert(derived.equipment.some((i) => i.id === "dice-set") && !derived.equipment.some((i) => i.id === "gaming-set"), "selected tool must replace generic gaming set");
assert(derived.skills.stealth.state === "disadvantage", "chain mail imposes stealth disadvantage");
const lowStrength = structuredClone(build);
lowStrength.abilities.baseAssignment.strength = 8;
lowStrength.abilities.baseAssignment.intelligence = 15;
lowStrength.abilities.backgroundBoosts = { dexterity: 2, constitution: 1 };
const weak = deriveCharacter(lowStrength);
assert(weak.speed === 20 && Boolean(weak.attacks[0].disadvantage), "low STR must affect armor speed and heavy attacks");
assert(damageFormula("2d6", -1) === "2d6−1" && damageFormula("1d6", 0) === "1d6", "negative and zero damage must format correctly");
let play = normalizePlayState(undefined, derived);
play = updatePlayState(play, { type: "hp", value: 8 }, derived);
play = updatePlayState(play, { type: "temporary-hp", value: 4 }, derived);
play = updatePlayState(play, { type: "hit-dice", value: 1 }, derived);
for (const id of ["second-wind", "action-surge", "stonecunning"]) play = updatePlayState(play, { type: "resource", id, value: 0 }, derived);
const rested = updatePlayState(play, { type: "rest", kind: "short" }, derived);
assert(rested.remaining["second-wind"] === 1 && rested.remaining["action-surge"] === 1 && rested.remaining.stonecunning === 0, "short rest must recover the correct amounts only");
assert(rested.hp === 8 && rested.hitDice === 1 && rested.temporaryHp === 4, "short rest must not heal or spend dice automatically");
assert(play.remaining["second-wind"] === 0, "rest must not mutate the previous state");
const longRested = updatePlayState(play, { type: "rest", kind: "long" }, derived);
assert(longRested.hp === 31 && longRested.hitDice === 3 && longRested.temporaryHp === 0 && longRested.remaining.stonecunning === 2, "long rest restores all HP, dice and resources");
assert(updatePlayState(rested, { type: "resource", id: "second-wind", value: -3 }, derived).remaining["second-wind"] === 0, "resources cannot drop below zero");
const clamped = normalizePlayState({ hp: 999, temporaryHp: -1, hitDice: 8, remaining: { "second-wind": 9, "action-surge": null } }, derived);
assert(clamped.hp === 31 && clamped.temporaryHp === 0 && clamped.hitDice === 3 && clamped.remaining["second-wind"] === 2 && clamped.remaining["action-surge"] === 1, "tampered play state must be bounded");
assert(parseDraft(JSON.stringify({ step: "character", build, play })).state?.play?.hp === 8, "play state must survive draft serialization");
originChecks(assert);
speciesChecks(assert);
rogueChecks(assert);
handoffChecks(assert);
onboardingChecks(assert);
wizardChecks(assert);
druidChecks(assert);
warlockChecks(assert);
rangerChecks(assert);
console.log(`rules selftest: OK (${checks} checks)`);
