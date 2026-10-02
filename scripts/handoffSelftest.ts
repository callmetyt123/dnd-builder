import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CharacterSheets } from "../src/components/character/CharacterSheets";
import { CharacterPage } from "../src/pages/CharacterPage";
import { BuilderProvider } from "../src/store/builder";
import { defaultBuild } from "../src/rules/defaultBuild";
import { deriveCharacter } from "../src/rules/engine/deriveCharacter";
import { normalizePlayState } from "../src/rules/engine/playState";
import { beginnerGuide } from "../src/rules/guides/beginnerGuide";
import { changeSpecies } from "../src/rules/species";
import { changeBackground, recommendSkills } from "../src/rules/origins";
import { SPECIES } from "../src/data/species";
import { BACKGROUNDS } from "../src/data/backgrounds";
import { beast } from "../src/data/beasts";
import { spell } from "../src/data/spells";
import { parseDraft } from "../src/store/draft";
import type { CharacterBuild, ClassId, RogueSubclass, SpeciesId, BackgroundId } from "../src/rules/types";

export function handoffChecks(assert: (ok: unknown, message: string) => void) {
  const routes: CharacterBuild[] = (["fighter", "wizard", "druid", "warlock", "ranger"] as ClassId[]).map(defaultBuild);
  for (const subclassId of ["thief", "assassin", "arcane-trickster", "soulknife"] as RogueSubclass[]) routes.push({ ...defaultBuild("rogue"), subclassId });
  const render = (b: CharacterBuild, mode: "quick" | "standard" | "reference", dirty = false) => {
    const c = deriveCharacter(b), play = normalizePlayState(undefined, c);
    if (dirty) { play.hp = 1; play.temporaryHp = 97; play.hitDice = 0; play.remaining = Object.fromEntries(c.resources.map((r) => [r.id, 0])); play.formId = "cat"; play.agathys = true; play.warlockArmor = "unarmored"; if (play.primal) { play.primal.hp = 1; play.primal.choice.appearance = "旧冒险伙伴"; } }
    return renderToStaticMarkup(createElement(CharacterSheets, { build: b, character: c, play, mode }));
  };
  // 全路线 × 全起源验证输出契约；旧冒险状态不应进入新生成的两种卡片。
  for (const route of routes) for (const species of Object.keys(SPECIES) as SpeciesId[]) for (const bg of Object.keys(BACKGROUNDS) as BackgroundId[]) {
    const b = recommendSkills(changeBackground(changeSpecies(structuredClone(route), species), bg)); b.identity.name = "上手卡验证";
    const c = deriveCharacter(b), label = `${route.subclassId}/${species}/${bg}`, guide = beginnerGuide(b, c), quick = render(b, "quick");
    assert((quick.match(/data-sheet-page/g) ?? []).length === 1 && !quick.includes("法术附页"), `${label}: exactly one guide page without appendices`);
    assert(guide.actions.length === 3 && guide.actions.every((a) => a.title && a.how && a.cost) && !/undefined|NaN/.test(quick), `${label}: three complete options`);
    assert(guide.skills.every((s) => c.skills[s.id].proficiency !== "none" && s.modifier === c.skills[s.id].modifier), `${label}: actual selected skills`);
    assert(guide.actions.every((a) => !spell(a.id) || c.spellcasting?.cantrips.includes(a.id) || c.spellcasting?.prepared.includes(a.id)), `${label}: no unavailable spell recommendations`);
  }
  for (const route of routes) {
    route.identity.name = "状态隔离验证";
    for (const mode of ["quick", "standard", "reference"] as const) assert(render(route, mode) === render(route, mode, true), `${route.subclassId}/${mode}: old HP, resources and temporary effects cannot change output`);
    // 常规卡固定两页，只保留可记录数值与写空位，不铺规则正文。
    const standard = render(route, "standard");
    assert((standard.match(/data-sheet-page/g) ?? []).length === 2, `${route.subclassId}: standard card stays at two pages`);
    assert(standard.includes("当前 HP ____") && standard.includes("临时 HP ____") && standard.includes("使用后勾选") && standard.includes("□") && standard.includes("起始装备"), `${route.subclassId}: standard card keeps offline write-in fields`);
    assert(!standard.includes("spell-card") && !standard.includes("sheet-features"), `${route.subclassId}: standard card carries no rule prose`);
    // 资料速查卡承接全部完整描述，并保持写空位字段。
    const reference = render(route, "reference");
    assert(reference.includes("当前 HP ____") && reference.includes("使用后勾选") && reference.includes("□"), `${route.subclassId}: reference card keeps tracked fields`);
    const state = { build: route, step: "character", play: { hp: 1, temporaryHp: 97 } };
    assert(parseDraft(JSON.stringify(state)).state?.play?.hp === 1, `${route.subclassId}: legacy state retained without destructive migration`);
  }
  // 自定义法术不能被推荐模板覆盖；没有攻击戏法时回退到已持有武器。
  const wizard = defaultBuild("wizard"); wizard.choices.wizard!.cantrips = ["light", "mage-hand", "prestidigitation"]; wizard.choices.wizard!.prepared = ["alarm", "detect-magic", "feather-fall", "grease", "sleep", "thunderwave"];
  let c = deriveCharacter(wizard), guide = beginnerGuide(wizard, c);
  assert(!guide.actions.some((a) => ["fire-bolt", "magic-missile", "shield", "web"].includes(a.id)) && c.attacks.some((a) => a.weaponId === guide.actions[0].id), "utility-only wizard uses an owned weapon and only actual prepared spells");
  const warlock = defaultBuild("warlock"); warlock.choices.warlock!.cantrips = ["mind-sliver", "mage-hand"]; warlock.choices.warlock!.invocations = [{ id: "agonizing-blast", target: "mind-sliver" }, { id: "devils-sight" }, { id: "eldritch-mind" }];
  c = deriveCharacter(warlock); guide = beginnerGuide(warlock, c);
  assert(guide.actions[0].id === "mind-sliver" && guide.actions[0].how.includes("智力豁免") && guide.actions[0].how.includes("1d6+3") && !guide.actions[0].how.includes("推离"), "warlock guide applies only selected cantrip invocation");
  const druid = defaultBuild("druid"); druid.choices.druid!.knownForms = ["panther", "wolf", "cat", "badger"];
  guide = beginnerGuide(druid, deriveCharacter(druid));
  assert(guide.actions[1].id === "panther" && guide.actions[1].title.includes(beast("panther")!.name) && !guide.actions[1].title.includes("棕熊"), "wild shape suggestion follows known forms");
  const page = renderToStaticMarkup(createElement(BuilderProvider, null, createElement(CharacterPage)));
  assert(page.includes("新人上手卡 · 1 页") && page.includes("导出当前卡 PDF") && !/冒险记录|确认休息|消耗一次|荒野变形操作/.test(page) && !page.includes('type="number"'), "completion page offers handoff without adventure controls");
}
