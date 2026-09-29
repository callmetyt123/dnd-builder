import { defaultBuild } from "../src/rules/defaultBuild";
import { deriveCharacter } from "../src/rules/engine/deriveCharacter";
import { normalizePlayState, updatePlayState } from "../src/rules/engine/playState";
import { validateBuild } from "../src/rules/validator/validateBuild";
import { parseDraft, switchClass } from "../src/store/draft";
import type { WizardChoices, MagicInitiateChoices } from "../src/rules/types";

export function wizardChecks(assert: (condition: unknown, message: string) => void) {
  const b = defaultBuild("wizard");
  b.identity = { name: "Wizard test", alignment: "NG" };
  const c = deriveCharacter(b);
  assert(validateBuild(b).canGenerate, "wizard default must be legal");
  assert(c.maxHp === 23 && c.hitDie === 6, "wizard HP includes dwarf toughness and fixed d6 growth");
  assert(c.armorClass === 12 && c.speed === 30, "unarmored wizard has no armor/style or low STR speed penalty");
  assert(c.initiative.state === "normal" && c.skills.stealth.state === "normal" && c.skills.athletics.state === "normal", "fighter roll effects cannot leak into wizard");
  assert(c.criticalThreshold === 20 && !c.features.includes("action-surge"), "fighter subclass features cannot leak into wizard");
  assert(c.savingThrows.intelligence.modifier === 5 && c.savingThrows.wisdom.modifier === 3 && c.savingThrows.constitution.modifier === 2, "wizard saves must use INT/WIS proficiency");
  assert(c.skills.arcana.modifier === 7 && c.skills.arcana.proficiency === "expertise", "scholar doubles proficiency, not the whole modifier");
  assert(c.spellcasting?.attack === 5 && c.spellcasting.dc === 13 && c.spellcasting.prepared.length === 6, "casting follows 2024 fixed prepared count");
  assert(c.spellcasting?.book.length === 12 && c.spellcasting.ritualSpells.includes("alarm") && !c.spellcasting.prepared.includes("alarm"), "unprepared book rituals remain castable");
  assert(c.attacks.length === 2 && c.attacks.every((a) => !a.mastery?.unlocked), "simple weapon proficiency is not mastery");
  assert(c.attacks.find((a) => a.weaponId === "dagger")?.attackBonus === 4 && c.attacks.find((a) => a.weaponId === "quarterstaff")?.attackBonus === 1, "dagger finesse and staff STR differ");
  assert(c.equipment.find((i) => i.id === "gp")?.quantity === 13 && c.equipment.find((i) => i.id === "quarterstaff")?.quantity === 2, "wizard and sage equipment both count");
  const changed = (patch: Partial<WizardChoices>) => ({ ...b, choices: { ...b.choices, wizard: { ...b.choices.wizard!, ...patch } } });
  for (const patch of [
    { cantrips: ["shield", "light", "mage-hand"] },
    { earlyBook: ["misty-step", ...b.choices.wizard!.earlyBook.slice(1)] },
    { level3Book: ["web", "web"] },
    { evocationBook: ["misty-step", "shatter"] },
    { evocationBook: ["magic-missile", "shatter"] },
    { prepared: [...b.choices.wizard!.prepared, "alarm"] },
    { prepared: ["mage-armor", ...b.choices.wizard!.prepared.slice(1)] },
    { scholar: "nature" },
  ] satisfies Partial<WizardChoices>[]) assert(!validateBuild(changed(patch)).canGenerate, "invalid wizard spell/skill source must block generation");
  const changedMagic = (patch: Partial<MagicInitiateChoices>) => ({ ...b, choices: { ...b.choices, origin: { ...b.choices.origin, magicInitiate: { ...b.choices.origin.magicInitiate, ...patch } } } });
  for (const patch of [{ spell: "web" }, { spell: "constructor" }, { cantrips: ["light", "light"] }]) assert(!validateBuild(changedMagic(patch)).canGenerate, "invalid origin spell must block generation");
  assert(validateBuild(changed({ skills: ["arcana", "investigation"] })).canGenerate, "duplicate skill proficiency is a recommendation warning");
  const charisma = deriveCharacter(changedMagic({ ability: "charisma" }));
  assert(charisma.originMagic?.dc === 10 && charisma.spellcasting?.dc === 13, "feat casting ability is independent from wizard INT");
  assert(validateBuild(changedMagic({ spell: "shield" })).canGenerate, "feat may overlap book without using a second preparation slot");
  assert(!validateBuild({ ...b, choices: { ...b.choices, wizard: null } }).canGenerate, "malformed wizard payload must not throw");
  assert(parseDraft(JSON.stringify({ step: "character", build: changed({ cantrips: [] }) })).state?.step === "review", "incomplete wizard draft must return to review");
  let play = normalizePlayState(undefined, c);
  play = updatePlayState(play, { type: "resource", id: "spell-slot-1", value: 1 }, c);
  play = updatePlayState(play, { type: "resource", id: "spell-slot-2", value: 0 }, c);
  play = updatePlayState(play, { type: "resource", id: "magic-initiate", value: 0 }, c);
  const noRecovery = updatePlayState(play, { type: "rest", kind: "short" }, c);
  assert(noRecovery.remaining["spell-slot-1"] === 1 && noRecovery.remaining["spell-slot-2"] === 0 && noRecovery.remaining["magic-initiate"] === 0, "ordinary short rest cannot restore wizard spells");
  const twoFirst = updatePlayState(play, { type: "rest", kind: "short", recover: "two-first" }, c);
  assert(twoFirst.remaining["spell-slot-1"] === 3 && twoFirst.remaining["arcane-recovery"] === 0, "two first-level slots consume recovery once");
  assert(updatePlayState(twoFirst, { type: "rest", kind: "short", recover: "one-second" }, c).remaining["spell-slot-2"] === 0, "repeated short rests cannot reuse spent recovery");
  const oneSecond = updatePlayState(play, { type: "rest", kind: "short", recover: "one-second" }, c);
  assert(oneSecond.remaining["spell-slot-2"] === 1 && oneSecond.remaining["spell-slot-1"] === 1, "recovery can choose a second-level slot instead");
  assert(updatePlayState(normalizePlayState(undefined, c), { type: "rest", kind: "short", recover: "two-first" }, c).remaining["arcane-recovery"] === 1, "recovery cannot consume a use without eligible expended slots");
  const rested = updatePlayState(twoFirst, { type: "rest", kind: "long" }, c);
  assert(rested.remaining["spell-slot-1"] === 4 && rested.remaining["spell-slot-2"] === 2 && rested.remaining["arcane-recovery"] === 1 && rested.remaining["magic-initiate"] === 1, "long rest restores all spell resources");
  const fighter = switchClass({ step: "character", build: b, play: twoFirst }, "fighter");
  const back = switchClass(fighter, "wizard");
  assert(JSON.stringify(back.build) === JSON.stringify(b) && back.play?.remaining["spell-slot-1"] === 3, "class switching preserves spell choices and spent resources");
  const restored = parseDraft(JSON.stringify(fighter)).state!;
  assert(switchClass(restored, "wizard").play?.remaining["arcane-recovery"] === 0, "inactive character survives refresh");
  assert(!parseDraft(JSON.stringify({ ...fighter, profiles: { wizard: { build: null } } })).state?.profiles?.wizard, "malformed inactive profile must be discarded safely");
}
