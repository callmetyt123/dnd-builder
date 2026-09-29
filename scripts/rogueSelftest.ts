import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CharacterSheets } from "../src/components/character/CharacterSheets";
import { defaultBuild } from "../src/rules/defaultBuild";
import { deriveCharacter } from "../src/rules/engine/deriveCharacter";
import { validateBuild } from "../src/rules/validator/validateBuild";
import { changeBackground, recommendSkills, magicOptions } from "../src/rules/origins";
import { changeSpecies } from "../src/rules/species";
import { changeRogueSubclass } from "../src/rules/rogue";
import { normalizePlayState, updatePlayState } from "../src/rules/engine/playState";
import { ROGUE_SUBCLASSES, ROGUE_MASTERIES, ROGUE_LANGUAGES, hasSpellStep } from "../src/data/rogue";
import { BACKGROUNDS } from "../src/data/backgrounds";
import { SPECIES } from "../src/data/species";
import { itemNames } from "../src/data/characterDetails";
import { parseDraft, switchClass, type BuilderState } from "../src/store/draft";
import type { CharacterBuild, RogueSubclass, BackgroundId, SpeciesId } from "../src/rules/types";

export function rogueChecks(assert: (ok: unknown, message: string) => void) {
  const named = (b = defaultBuild("rogue")): CharacterBuild => ({ ...b, identity: { name: "游荡者验证", alignment: "NG" } });
  const html = (b: CharacterBuild, mode: "quick" | "full") => { const c = deriveCharacter(b); return renderToStaticMarkup(createElement(CharacterSheets, { build: b, character: c, play: normalizePlayState(undefined, c), mode })); };
  // 640 个起源组合分别验证四个子职；独立期望防止只测试推荐路线。
  for (const subclass of Object.keys(ROGUE_SUBCLASSES) as RogueSubclass[]) for (const bg of Object.keys(BACKGROUNDS) as BackgroundId[]) for (const species of Object.keys(SPECIES) as SpeciesId[]) {
    const b = recommendSkills(changeSpecies(changeBackground({ ...named(), subclassId: subclass }, bg), species));
    const c = deriveCharacter(b), label = `${subclass}/${bg}/${species}`;
    assert(validateBuild(b).canGenerate, `${label}: legal`);
    assert(c.maxHp === 18 + 3 * c.abilities.constitution.modifier + (species === "dwarf" ? 3 : 0) + (bg === "farmer" ? 6 : 0), `${label}: HP`);
    assert(c.armorClass === 11 + c.abilities.dexterity.modifier && c.criticalThreshold === 20, `${label}: armor/critical`);
    assert(c.skills[b.choices.rogue!.expertise[0]].proficiency === "expertise" && c.skills[b.choices.rogue!.expertise[1]].proficiency === "expertise", `${label}: both expertise`);
    assert(c.resources.some((r) => r.id === "psionic-power") === (subclass === "soulknife") && !!c.spellcasting === (subclass === "arcane-trickster"), `${label}: subclass isolation`);
    for (const mode of ["quick", "full"] as const) {
      const out = html(b, mode);
      assert(!/NaN|undefined/.test(out) && out.includes("2d6") && out.includes(ROGUE_SUBCLASSES[subclass].name), `${label}/${mode}: card`);
      assert(!out.includes("奥术回想") && !out.includes("remarkable-athlete"), `${label}/${mode}: no unrelated class abilities`);
    }
    assert(c.equipment.every((e) => !!itemNames[e.id]), `${label}: inventory labels`);
  }
  const b = named(), c = deriveCharacter(b);
  assert(c.maxHp === 27 && c.armorClass === 14 && c.initiative.modifier === 5, "default dwarf criminal rogue concrete stats");
  assert(c.skills.stealth.modifier === 7 && c.skills["sleight-of-hand"].modifier === 7 && c.skills.perception.modifier === 2, "default expertise and skills");
  assert(c.rogue?.climb === 30 && !c.spellcasting && !hasSpellStep(b), "thief climb / no spell step");
  assert(ROGUE_MASTERIES.length === 19 && ROGUE_MASTERIES.every((id) => !!itemNames[id]) && !ROGUE_MASTERIES.includes("longbow"), "complete 19 proficient weapon choices and labels");
  for (const id of ROGUE_MASTERIES) {
    const x = structuredClone(b); x.choices.weaponMasteries = [id, id === "dagger" ? "shortbow" : "dagger"];
    assert(validateBuild(x).canGenerate, `${id}: noncarried mastery allowed`);
  }
  for (const id of ROGUE_LANGUAGES.filter((id) => !["common", "thieves-cant", ...b.choices.languages].includes(id))) {
    const x = structuredClone(b); x.choices.rogue!.extraLanguage = id; assert(validateBuild(x).canGenerate, `${id}: extra language allowed`);
  }
  const bad = (mutate: (x: CharacterBuild) => void) => { const x = structuredClone(b); mutate(x); return !validateBuild(x).canGenerate; };
  assert(bad((x) => x.choices.rogue!.expertise = ["stealth", "stealth"]), "duplicate expertise rejected");
  assert(bad((x) => x.choices.rogue!.expertise = ["arcana", "stealth"]), "untrained expertise rejected");
  assert(bad((x) => x.choices.rogue!.extraLanguage = "common"), "duplicate language rejected");
  assert(bad((x) => x.choices.weaponMasteries = ["greatsword", "shortbow"]), "untrained mastery rejected");
  assert(bad((x) => x.choices.rogue!.skills = ["perception"]), "missing class skills rejected");
  const assassin = { ...b, subclassId: "assassin" as const }, ac = deriveCharacter(assassin);
  assert(ac.initiative.state === "advantage" && ac.initiative.modifier === 5 && ac.criticalThreshold === 20, "assassin plus Alert without automatic critical");
  assert(ac.tools.includes("disguise-kit") && ac.equipment.some((e) => e.id === "poisoners-kit") && !ac.features.includes("envenom-weapons"), "assassin level-three tools only");
  const soul = { ...b, subclassId: "soulknife" as const }, sc = deriveCharacter(soul);
  let play = normalizePlayState(undefined, sc); play.remaining["psionic-power"] = 0; play.remaining["psychic-whispers"] = 0;
  play = updatePlayState(play, { type: "rest", kind: "short" }, sc);
  assert(play.remaining["psionic-power"] === 1 && play.remaining["psychic-whispers"] === 0, "soulknife short rest recovers only one die");
  play = updatePlayState(play, { type: "rest", kind: "long" }, sc);
  assert(play.remaining["psionic-power"] === 4 && play.remaining["psychic-whispers"] === 1, "soulknife long rest");
  const trickster = { ...b, subclassId: "arcane-trickster" as const }, tc = deriveCharacter(trickster);
  assert(tc.spellcasting?.cantrips.length === 3 && tc.spellcasting.prepared.length === 3 && tc.spellcasting.dc === 12 && tc.resources.find((r) => r.id === "spell-slot-1")?.max === 2 && !tc.resources.some((r) => r.id === "spell-slot-2"), "trickster independent casting at level three");
  for (const s of magicOptions("wizard")) {
    if (s.id === "mage-hand") continue;
    const x = structuredClone(trickster), field = s.level === 0 ? "cantrips" : "prepared";
    x.choices.rogue![field] = [s.id, ...magicOptions("wizard").filter((v) => v.level === s.level && v.id !== "mage-hand" && v.id !== s.id).slice(0, s.level === 0 ? 1 : 2).map((v) => v.id)];
    assert(validateBuild(x).canGenerate, `${s.id}: trickster full catalog selectable`);
  }
  const invalid = structuredClone(trickster); invalid.choices.rogue!.prepared[0] = "web";
  assert(!validateBuild(invalid).canGenerate, "trickster cannot prepare second level");
  invalid.choices.rogue!.prepared = [...trickster.choices.rogue!.prepared]; invalid.choices.rogue!.cantrips[0] = "mage-hand";
  assert(!validateBuild(invalid).canGenerate, "mage hand cannot use an additional cantrip slot");
  let state: BuilderState = { build: soul, step: "class", play: normalizePlayState(undefined, sc) };
  state = changeRogueSubclass(state, "arcane-trickster");
  assert(state.build.choices.rogue!.expertise.join() === b.choices.rogue!.expertise.join() && state.play?.remaining["psionic-power"] === undefined && state.play?.remaining["spell-slot-1"] === 2, "subclass switch removes old resources, preserves choices");
  state.play!.remaining["spell-slot-1"] = 0;
  const restored = parseDraft(JSON.stringify(switchClass(switchClass(state, "fighter"), "rogue"))).state!;
  assert(restored.build.subclassId === "arcane-trickster" && restored.play?.remaining["spell-slot-1"] === 0, "class switch and reload preserve subtype and spent slots");
  const malformed = JSON.parse(JSON.stringify(state)); malformed.build.choices.rogue.expertise = null;
  assert(parseDraft(JSON.stringify(malformed)).preserveOriginal, "malformed rogue choice preserved for recovery");
  const familiar = structuredClone(trickster); familiar.choices.rogue!.prepared[0] = "find-familiar";
  assert(html(familiar, "quick").includes("寻获魔宠 · 随行记录"), "trickster familiar annex");
}
