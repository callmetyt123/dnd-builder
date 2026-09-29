import { defaultBuild } from "../src/rules/defaultBuild";
import { applyRecommendation, recommendClasses, stepBlockers, recommendationInfo } from "../src/rules/guides/onboarding";
import { validateBuild } from "../src/rules/validator/validateBuild";
import { changeSpecies } from "../src/rules/species";
import { changeBackground } from "../src/rules/origins";
import { switchClass, parseDraft } from "../src/store/draft";
import { SPECIES } from "../src/data/species";
import { BACKGROUNDS } from "../src/data/backgrounds";
import type { ClassId, SpeciesId, BackgroundId, RogueSubclass } from "../src/rules/types";

export function onboardingChecks(assert: (ok: unknown, message: string) => void) {
  for (const [tag, complexity, expected] of [["stealth", "simple", "rogue"], ["melee", "simple", "fighter"], ["magic", "simple", "warlock"], ["magic", "deep", "wizard"], ["support", "simple", "druid"], ["nature", "deep", "ranger"]] as const) {
    assert(recommendClasses({ tags: [tag], complexity })[0].id === expected, `${tag}/${complexity}: preference drives recommendation`);
  }
  assert(parseDraft(JSON.stringify({build: defaultBuild(), step: "class"})).state?.build.playstyle.tags[0] === "melee", "preference survives draft reload");
  const original = defaultBuild(); original.playstyle = { tags: ["magic"], complexity: "deep" };
  let state = switchClass({ build: original, step: "class" }, "wizard"); state.build.choices.wizard!.cantrips = ["light", "mage-hand", "prestidigitation"];
  state = switchClass(state, "fighter"); state.build.playstyle = { tags: ["support"], complexity: "balanced" }; state = switchClass(state, "wizard");
  assert(state.build.playstyle.tags[0] === "support" && state.build.choices.wizard!.cantrips[0] === "light", "switching restores custom build but carries latest preference");
  // 覆盖推荐在自定义起源与四个游荡者子职下的合法性，防止恢复默认覆盖无关选择。
  for (const classId of ["fighter", "wizard", "druid", "warlock", "ranger", "rogue"] as ClassId[]) for (const subclass of (classId === "rogue" ? ["thief", "assassin", "arcane-trickster", "soulknife"] : [null]) as (RogueSubclass | null)[]) for (const species of Object.keys(SPECIES) as SpeciesId[]) for (const background of Object.keys(BACKGROUNDS) as BackgroundId[]) {
    let b = changeBackground(changeSpecies(defaultBuild(classId), species), background); if (subclass) b.subclassId = subclass;
    b.identity.name = "引导验证"; b.identity.alignment = "NG";
    const sourceBuild = b, before = JSON.stringify(b), identity = b.identity, abilities = b.abilities;
    b = applyRecommendation(b, "configuration"); b = applyRecommendation(b, "spells");
    assert(validateBuild(b).canGenerate, `${classId}/${subclass}/${species}/${background}: scoped recommendations stay legal`);
    assert(b.identity === identity && b.abilities === abilities && b.speciesId === species && b.backgroundId === background && (!subclass || b.subclassId === subclass), "recommendations retain identity, origins, scores and subclass");
    assert(!/undefined|NaN/.test(recommendationInfo(b, "configuration").preview), "recommendation preview is complete");
    assert(JSON.stringify(sourceBuild) === before, "recommendations do not mutate source build");
  }
  const fighter = defaultBuild(); fighter.choices.fighterSkills = [];
  let messages = validateBuild(fighter).messages;
  assert(stepBlockers(messages, "configuration").some((m) => m.id === "fighter-skills-count") && !stepBlockers(messages, "configuration").some((m) => m.targetStep === "identity"), "current step blocks its missing skills, not future identity");
  fighter.identity.name = "自选角色"; fighter.identity.alignment = "NG";
  const fixed = applyRecommendation(fighter, "configuration");
  assert(stepBlockers(validateBuild(fixed).messages, "configuration").length === 0, "recommended configuration resolves missing selections");
  const unusual = changeBackground(fixed, "sage");
  assert(validateBuild(unusual).canGenerate && validateBuild(unusual).messages.some((m) => m.severity === "warning") && stepBlockers(validateBuild(unusual).messages, "review").length === 0, "legal nonrecommended background remains generatable");
  const druid = defaultBuild("druid"); druid.choices.druid!.order = "warden";
  const recommendedDruid = applyRecommendation(druid, "spells");
  assert(recommendedDruid.choices.druid!.cantrips.length === 2 && !recommendationInfo(druid, "spells").why.includes("荆棘之鞭"), "warden recommendation respects two cantrips and its explanation");
  const customWizard = defaultBuild("wizard"); customWizard.choices.wizard!.prepared = ["sleep"];
  const savedSpells = JSON.stringify(customWizard.choices.wizard!.prepared), source = JSON.stringify(customWizard);
  const recommendedWizard = applyRecommendation(customWizard, "configuration");
  assert(JSON.stringify(recommendedWizard.choices.wizard!.prepared) === savedSpells && JSON.stringify(customWizard) === source, "configuration recommendation preserves custom spells without source mutation");
}
