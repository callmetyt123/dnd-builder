import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CharacterSheets } from "../src/components/character/CharacterSheets";
import { BACKGROUNDS } from "../src/data/backgrounds";
import { defaultBuild } from "../src/rules/defaultBuild";
import { deriveCharacter } from "../src/rules/engine/deriveCharacter";
import { normalizePlayState } from "../src/rules/engine/playState";
import { changeBackground, classSkills, recommendSkills, recommendedBoosts } from "../src/rules/origins";
import type { CharacterBuild, ClassId } from "../src/rules/types";
import { validateBuild } from "../src/rules/validator/validateBuild";
import { parseDraft } from "../src/store/draft";

export function originChecks(assert: (condition: unknown, message: string) => void) {
  const classes = ["fighter", "wizard", "druid", "warlock", "ranger"] as const;
  const backgrounds = ["soldier", "sage", "hermit", "wayfarer"] as const;
  const classGold = { fighter: 4, wizard: 5, druid: 9, warlock: 15, ranger: 7 };
  const backgroundGold = { soldier: 14, sage: 8, hermit: 16, wayfarer: 16 };
  // 交叉组合检验数据来源与实际输出；不只验证五个推荐套餐。
  for (const classId of classes) for (const backgroundId of backgrounds) {
    const original = defaultBuild(classId);
    original.identity = { name: "背景组合验证", alignment: "NG" };
    const changed = changeBackground(original, backgroundId);
    const build = recommendSkills(changed);
    const c = deriveCharacter(build);
    const play = normalizePlayState(undefined, c);
    const label = `${classId}/${backgroundId}`;
    assert(JSON.stringify(classSkills(changed)) === JSON.stringify(classSkills(original)) && changed.identity === original.identity, `${label}: switching background preserves choices and identity`);
    assert(validateBuild(build).canGenerate, `${label}: legal after explicit skill repair`);
    assert(c.equipment.find((i) => i.id === "gp")?.quantity === classGold[classId] + backgroundGold[backgroundId], `${label}: only selected equipment packages add gold`);
    assert(c.features.includes(BACKGROUNDS[backgroundId].feat) && c.features.filter((id) => ["lucky", "healer", "savage-attacker", "magic-initiate"].includes(id)).length === 1, `${label}: no old feat leakage`);
    assert(c.resources.some((r) => r.id === "lucky") === (backgroundId === "wayfarer") && c.resources.some((r) => r.id === "magic-initiate") === (backgroundId === "sage"), `${label}: resources follow background`);
    assert(c.equipment.some((i) => i.id === "healers-kit") === (backgroundId === "soldier"), `${label}: healer kit not confused with herbalism kit`);
    assert(classSkills(build).every((id) => !BACKGROUNDS[backgroundId].skills.includes(id)), `${label}: repair avoids duplicated proficiency`);
    assert(BACKGROUNDS[backgroundId].skills.every((id) => c.skills[id].proficiency !== "none"), `${label}: background skills are active`);
    assert(Object.keys(recommendedBoosts(classId, backgroundId)).every((id) => (BACKGROUNDS[backgroundId].abilities as readonly string[]).includes(id)), `${label}: recommended boosts remain legal`);
    for (const mode of ["quick", "full"] as const) {
      const html = renderToStaticMarkup(createElement(CharacterSheets, { build, character: c, play, mode }));
      assert(!html.includes("undefined") && !html.includes("NaN"), `${label}/${mode}: no missing values in printed tree`);
      assert(html.includes("背景法术附页") === (mode === "full" && backgroundId === "sage"), `${label}/${mode}: origin spell appendix follows actual source`);
      assert(html.includes("凶蛮打手") === (backgroundId === "soldier"), `${label}/${mode}: savage attacker text follows background`);
      assert(html.includes("医疗师") === (backgroundId === "hermit"), `${label}/${mode}: healer text follows background`);
      assert(html.includes("幸运") === (backgroundId === "wayfarer"), `${label}/${mode}: lucky text follows background`);
    }
  }
  const fighterSage = changeBackground(defaultBuild(), "sage");
  fighterSage.identity = { name: "选择贤者的战士", alignment: "N" };
  const c = deriveCharacter(fighterSage);
  assert(!c.spellcasting && !!c.originMagic && c.armorClass === 17 && c.resources.some((r) => r.id === "action-surge"), "sage fighter has origin magic without wizard armor/resources");
  assert(validateBuild(fighterSage).canGenerate && validateBuild(fighterSage).messages.some((m) => m.id === "background-main-ability" && m.severity === "warning"), "suboptimal legal background is not blocked");
  const wizard = defaultBuild("wizard");
  wizard.identity = { name: "法师迁移验证", alignment: "NG" };
  const soldierWizard = changeBackground(wizard, "soldier");
  assert(validateBuild(soldierWizard).messages.some((m) => m.id === "scholar"), "loss of background proficiency invalidates dependent expertise");
  assert(validateBuild(recommendSkills(soldierWizard)).canGenerate, "explicit repair restores valid scholar choice");
  assert(!deriveCharacter(soldierWizard).armorNote?.includes("法师护甲"), "removing sage also removes unavailable mage armor guidance");
  assert(!renderToStaticMarkup(createElement(CharacterSheets, { build: fighterSage, character: c, play: normalizePlayState(undefined, c), mode: "full" })).includes("其中一根为奥术法器"), "sage equipment does not turn a fighter staff into an arcane focus");
  const duplicate = defaultBuild("druid");
  duplicate.identity = { name: "重复熟练", alignment: "N" };
  duplicate.choices.druid!.skills = ["medicine", "nature"];
  assert(validateBuild(duplicate).canGenerate && validateBuild(duplicate).messages.some((m) => m.id === "duplicate-skill"), "duplicate skills warn consistently for all classes");
  const newSage = structuredClone(fighterSage);
  newSage.choices.origin.magicInitiate.ability = "wisdom";
  assert(deriveCharacter(newSage).originMagic?.dc === 11 && deriveCharacter(newSage).originMagic?.attack === 3, "feat casting uses its own chosen ability");
  for (const id of ["web", "cure-wounds", "constructor"]) {
    newSage.choices.origin.magicInitiate.spell = id;
    assert(!validateBuild(newSage).canGenerate, "origin list rejects higher-level, other-class and inherited keys");
  }
  assert(!validateBuild({ ...fighterSage, backgroundId: "constructor" }).canGenerate, "unknown backgrounds do not access object prototypes");
  assert(!validateBuild({ ...fighterSage, equipment: { ...fighterSage.equipment, backgroundPackage: "soldier-a" } }).canGenerate, "mismatched background package is rejected");
  for (const origin of [null, {}, { gamingSet: "dice-set", magicInitiate: { cantrips: [], spell: "shield", ability: "strength" } }]) {
    assert(!validateBuild({ ...fighterSage, choices: { ...fighterSage.choices, origin } }).canGenerate, "malformed origin payload is rejected without throwing");
  }
  const spent = normalizePlayState(undefined, deriveCharacter(defaultBuild("warlock")));
  spent.hp = 7; spent.remaining["lucky"] = 0; spent.remaining["pact-slot"] = 0;
  const nextPlay = normalizePlayState(spent, deriveCharacter(changeBackground(defaultBuild("warlock"), "sage")));
  assert(nextPlay.hp === 7 && nextPlay.remaining["pact-slot"] === 0 && !("lucky" in nextPlay.remaining) && nextPlay.remaining["magic-initiate"] === 1, "background change removes stale resource while preserving spent class resources and HP");

  // 构造真实旧字段，不借新默认构筑绕过迁移；当前与缓存职业都必须保留自定义内容。
  const legacy = (build: CharacterBuild) => {
    const old = JSON.parse(JSON.stringify(build));
    const origin = old.choices.origin;
    delete old.choices.origin;
    old.choices.soldierGamingSet = "playing-card-set";
    if (old.choices.wizard) Object.assign(old.choices.wizard, { initiateCantrips: origin.magicInitiate.cantrips, initiateSpell: "shield", initiateAbility: "charisma" });
    if (old.choices.warlock) old.choices.warlock.gamingSet = "playing-card-set";
    if (old.choices.ranger) old.choices.ranger.gamingSet = "playing-card-set";
    return old;
  };
  for (const classId of classes) {
    const build = defaultBuild(classId);
    build.identity = { name: "旧草稿自定义姓名", alignment: "NG" };
    const old = legacy(build);
    const result = parseDraft(JSON.stringify({ step: "review", build: old, play: { hp: 5 }, profiles: { [classId]: { build: old, play: { hp: 4 } } } })).state!;
    assert(result?.build.identity.name === build.identity.name && result.play?.hp === 5 && result.profiles?.[classId]?.play?.hp === 4, `${classId}: active and cached legacy drafts preserve identity/HP`);
    assert(result.build.choices.origin.gamingSet === "playing-card-set", `${classId}: custom gaming set migrates`);
    if (classId === "wizard") assert(result.build.choices.origin.magicInitiate.spell === "shield" && result.build.choices.origin.magicInitiate.ability === "charisma", "legacy initiate spell and ability migrate exactly");
  }
  const invalidLegacy = legacy(wizard);
  invalidLegacy.choices.wizard.initiateCantrips = null;
  assert(parseDraft(JSON.stringify({ build: invalidLegacy })).preserveOriginal, "malformed legacy magic is preserved for recovery instead of silently replaced");
}
