import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CharacterSheets } from "../src/components/character/CharacterSheets";
import { defaultBuild } from "../src/rules/defaultBuild";
import { changeExpandedSubclass, subclassDefaults, wizardSpell, illusionCantrip } from "../src/rules/expandedSubclasses";
import { applyRecommendation, recommendationInfo } from "../src/rules/guides/onboarding";
import { deriveCharacter } from "../src/rules/engine/deriveCharacter";
import { validateBuild } from "../src/rules/validator/validateBuild";
import { parseDraft, switchClass } from "../src/store/draft";
import { changeSpecies } from "../src/rules/species";
import { changeBackground, recommendSkills } from "../src/rules/origins";
import { SPECIES } from "../src/data/species";
import { BACKGROUNDS } from "../src/data/backgrounds";
import { SPELL_LIST, spell } from "../src/data/spells";
import { WIZARD_SUBCLASSES, MANEUVERS } from "../src/data/expandedSubclasses";
import { beginnerGuide } from "../src/rules/guides/beginnerGuide";
import type { BackgroundId, SpeciesId, FighterSubclass, WizardSubclass, CharacterBuild } from "../src/rules/types";

export function expansionRoutes(): CharacterBuild[] {
  return [...(["battle-master", "eldritch-knight", "psi-warrior"] as FighterSubclass[]).map((id) => changeExpandedSubclass(defaultBuild(), id)), ...(["abjurer", "diviner", "illusionist"] as WizardSubclass[]).map((id) => changeExpandedSubclass(defaultBuild("wizard"), id))];
}
export function expansionChecks(assert: (ok: unknown, message: string) => void) {
  assert(SPELL_LIST.length === 90 && SPELL_LIST.every(Boolean) && new Set(SPELL_LIST.map((s) => s.id)).size === 90, "wizard catalog has 90 unique resolved spells");
  for (const [level, expected] of [[0, 20], [1, 31], [2, 39]]) assert(SPELL_LIST.filter((s) => s.level === level).length === expected, `complete PHB level ${level} list`);
  assert(Object.keys(MANEUVERS).length === 20, "twenty PHB maneuvers available");
  const complete = (b: CharacterBuild): CharacterBuild => ({ ...b, identity: { name: "子职验证", alignment: "NG" as const } });
  const render = (b: CharacterBuild, mode: "quick" | "full") => renderToStaticMarkup(createElement(CharacterSheets, { build: b, character: deriveCharacter(b), mode }));
  // 新路线与所有起源交叉验证：推荐、草稿恢复、实际数值与单页指南使用同一构筑。
  for (const route of expansionRoutes()) for (const species of Object.keys(SPECIES) as SpeciesId[]) for (const bg of Object.keys(BACKGROUNDS) as BackgroundId[]) {
    let b = complete(changeBackground(changeSpecies(structuredClone(route), species), bg));
    const original = JSON.stringify(b), identity = b.identity, scores = b.abilities;
    b = applyRecommendation(applyRecommendation(b, "configuration"), "spells");
    const c = deriveCharacter(b), guide = beginnerGuide(b, c), label = `${b.subclassId}/${species}/${bg}`;
    assert(validateBuild(b).canGenerate, `${label}: legal recommended route`);
    assert(b.identity === identity && b.abilities === scores && b.speciesId === species && b.backgroundId === bg, `${label}: preserve unrelated choices`);
    assert(guide.actions.length === 3 && guide.actions.every((a) => a.title && a.how && a.cost && (!spell(a.id) || c.spellcasting?.cantrips.includes(a.id) || c.spellcasting?.prepared.includes(a.id))), `${label}: three available actions`);
    const quick = render(b, "quick");
    assert((quick.match(/data-sheet-page/g) ?? []).length === 1 && !/undefined|NaN/.test(quick), `${label}: one complete beginner page`);
    assert(parseDraft(JSON.stringify({ build: b, step: "character" })).state?.step === "character", `${label}: reload supports subclass`);
    assert(!/undefined|NaN/.test(recommendationInfo(b, "spells").preview) && original.length > 0, `${label}: recommendation preview`);
  }
  for (const route of expansionRoutes()) {
    const b = complete(subclassDefaults(route)), c = deriveCharacter(b), full = render(b, "full");
    assert(validateBuild(b).canGenerate && !/undefined|NaN/.test(full), `${b.subclassId}: default full output`);
    assert(!c.features.includes("potent-cantrip") && !c.features.includes("improved-critical") && c.criticalThreshold === 20 && c.initiative.state === "normal", `${b.subclassId}: no evoker or champion leakage`);
    assert(full.includes("子职能力") && full.includes("当前 HP ____"), `${b.subclassId}: complete offline reference`);
    const other = switchClass({ build: b, step: "class" }, b.classId === "wizard" ? "fighter" : "wizard");
    assert(switchClass(other, b.classId).build.subclassId === b.subclassId, `${b.subclassId}: route survives class cache`);
    if (b.classId === "wizard") assert(b.choices.wizard!.evocationBook.every((id) => spell(id)?.school === WIZARD_SUBCLASSES[b.subclassId as WizardSubclass].school), "school spell source is restricted");
    if (b.subclassId === "eldritch-knight") {
      assert(c.armorClass === 17 && c.spellcasting?.cantrips.length === 2 && c.spellcasting.prepared.length === 3 && c.spellcasting.book.length === 0 && c.resources.find((r) => r.id === "spell-slot-1")?.max === 2 && !c.resources.some((r) => r.id === "spell-slot-2"), "knight armor, preparations and slots");
      assert(full.includes("轻甲、中甲、重甲") && !full.includes("学者套组") && full.includes("奥法骑士法术"), "knight does not inherit wizard equipment or armor text");
      const bad = structuredClone(b); bad.choices.fighter!.prepared[0] = "web"; assert(!validateBuild(bad).canGenerate, "knight cannot prepare second-level spell");
      bad.choices.fighter!.prepared[0] = "cure-wounds"; assert(!validateBuild(bad).canGenerate, "knight cannot learn nonwizard spell");
      bad.choices.fighter!.prepared[0] = "find-familiar"; assert(validateBuild(bad).canGenerate && render(bad, "full").includes("随行记录"), "knight familiar gets its sheet");
    }
    if (b.subclassId === "battle-master") {
      assert(c.skills[b.choices.fighter!.studentSkill].proficiency === "proficient" && c.tools.includes("smiths-tools") && c.resources.find((r) => r.id === "combat-superiority")?.max === 4, "student grants and d8 pool");
      for (const key of Object.keys(MANEUVERS)) { const choice = structuredClone(b); choice.choices.fighter!.maneuvers = [key, ...Object.keys(MANEUVERS).filter((id) => id !== key).slice(0, 2)]; assert(validateBuild(choice).canGenerate && render(choice, "full").includes(MANEUVERS[key].name), `${key}: selectable and documented`); }
      const bad = structuredClone(b); bad.choices.fighter!.maneuvers = ["parry", "parry", "trip-attack"]; assert(!validateBuild(bad).canGenerate, "duplicate maneuvers rejected");
    }
    if (b.subclassId === "psi-warrior") assert(c.abilities.intelligence.modifier === 2 && c.resources.find((r) => r.id === "psi-warrior-energy")?.shortRestRestore === 1 && c.resources.find((r) => r.id === "telekinetic-movement")?.shortRestRestore === 1, "psi recommendation and distinct recovery");
    if (b.subclassId === "abjurer") assert(full.includes("HP 上限 9") && full.includes("今日已创建"), "ward has correct capacity and creation blank");
    if (b.subclassId === "diviner") assert(full.includes("结果一") && full.includes("结果二") && !c.resources.some((r) => r.id === "portent"), "portent records rolled values, not invented rolls");
    if (b.subclassId === "illusionist") {
      assert(c.spellcasting?.cantrips.length === 4 && new Set(c.spellcasting.cantrips).size === 4, "illusionist extra cantrip");
      const minor = wizardSpell(b, "minor-illusion")!, silent = wizardSpell(b, "silent-image")!;
      assert(minor.range.startsWith("90") && minor.time.includes("附赠") && silent.range.startsWith("120") && !silent.components.includes("V") && spell("silent-image")!.components.includes("V"), "illusion modifiers apply without mutating global spells");
      assert(wizardSpell(b, "invisibility")!.range === spell("invisibility")!.range, "touch range unchanged");
    }
  }
  const wizard = complete(defaultBuild("wizard")); wizard.choices.wizard!.cantrips = ["minor-illusion", "light", "mage-hand"];
  const before = JSON.stringify(wizard), changed = changeExpandedSubclass(wizard, "illusionist");
  assert(JSON.stringify(wizard) === before && changed.choices.wizard!.cantrips.length === 3 && changed.choices.wizard!.cantrips.includes("minor-illusion") && deriveCharacter(changed).spellcasting!.cantrips.length === 4 && validateBuild(changed).canGenerate, "subclass switch preserves source and resolves free-cantrip overlap");
  const forest = changeSpecies(complete(changeExpandedSubclass(defaultBuild("wizard"), "illusionist")), "gnome");
  assert(illusionCantrip(forest) !== "minor-illusion" && validateBuild(forest).canGenerate, "forest gnome keeps origin illusion and gets different extra cantrip");
  forest.choices.wizard!.illusionCantrip = "mind-sliver";
  const restored = parseDraft(JSON.stringify({ build: forest, step: "spells" })).state;
  assert(restored?.build.choices.wizard?.illusionCantrip === "mind-sliver", "chosen extra cantrip persists");
  assert(render(forest, "full").includes("90 尺") && wizardSpell(forest, "minor-illusion")!.time.includes("附赠"), "origin illusion uses subclass adjustments in full card");
  forest.choices.wizard!.illusionCantrip = forest.choices.wizard!.cantrips[0];
  assert(!validateBuild(forest).canGenerate, "extra illusion cantrip cannot duplicate known class cantrip");
  forest.choices.wizard!.cantrips = SPELL_LIST.filter((s) => s.level === 0).map((s) => s.id);
  delete forest.choices.wizard!.illusionCantrip;
  assert(!validateBuild(forest).canGenerate, "overfilled malformed cantrips fail without crashing default resolution");
  const legacy = complete(defaultBuild()); delete legacy.choices.fighter;
  assert(parseDraft(JSON.stringify({ build: legacy, step: "character" })).state?.step === "character" && validateBuild(changeExpandedSubclass(legacy, "battle-master")).canGenerate, "old champion draft migrates upon explicit subclass selection");
  for (const malformed of [null, {}, { ...defaultBuild().choices.fighter, maneuvers: null }]) assert(!validateBuild({ ...defaultBuild(), choices: { ...defaultBuild().choices, fighter: malformed } }).canGenerate, "malformed new choices rejected before derivation");
  // 法师学习每个目录选项均有正常数据；专属列表外法术仍被拦截。
  for (const s of SPELL_LIST) assert(s.text.length > 10 && !!s.components && [0, 1, 2].includes(s.level), `${s.id}: complete spell reference`);
  const badWizard = complete(defaultBuild("wizard")); badWizard.choices.wizard!.cantrips[0] = "eldritch-blast";
  assert(!validateBuild(badWizard).canGenerate, "shared spell dictionary does not enlarge wizard eligibility");
  assert(recommendSkills(changeExpandedSubclass(defaultBuild(), "battle-master")).choices.fighterSkills.length === 2, "student extra skill does not consume base class skill quota");
}
