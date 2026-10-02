import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CharacterSheets } from "../src/components/character/CharacterSheets";
import { defaultBuild } from "../src/rules/defaultBuild";
import { changePrimalSubclass, reconcilePrimalChoices, primalSpell } from "../src/rules/primalSubclasses";
import { DRUID_SUBCLASSES, WARLOCK_SUBCLASSES, RANGER_SUBCLASSES, automaticMagic, LAND_TYPES, STAR_FORMS } from "../src/data/primalSubclasses";
import { DRUID_SPELL_IDS, WARLOCK_SPELL_IDS, RANGER_SPELL_IDS } from "../src/data/primalSpells";
import { SPECIES } from "../src/data/species";
import { BACKGROUNDS } from "../src/data/backgrounds";
import { spell } from "../src/data/spells";
import { CANTRIP_DAMAGE, INVOCATIONS } from "../src/data/warlock";
import { changeSpecies } from "../src/rules/species";
import { changeBackground } from "../src/rules/origins";
import { applyRecommendation } from "../src/rules/guides/onboarding";
import { beginnerGuide } from "../src/rules/guides/beginnerGuide";
import { deriveCharacter } from "../src/rules/engine/deriveCharacter";
import { deriveWildShape } from "../src/rules/engine/wildShape";
import { warlockCantrip } from "../src/rules/engine/warlock";
import { validateBuild } from "../src/rules/validator/validateBuild";
import { parseDraft, switchClass } from "../src/store/draft";
import type { CharacterBuild, ClassId, PrimalSubclassId, SpeciesId, BackgroundId } from "../src/rules/types";

export function primalRoutes(): CharacterBuild[] {
  return ([['druid', DRUID_SUBCLASSES], ['warlock', WARLOCK_SUBCLASSES], ['ranger', RANGER_SUBCLASSES]] as const).flatMap(([cls, table]) => Object.keys(table).map((id) => ({ ...changePrimalSubclass(defaultBuild(cls), id as PrimalSubclassId), identity: { name: "自然契约验证", alignment: "NG" as const } })));
}
export function primalChecks(assert: (ok: unknown, message: string) => void) {
  const render = (b: CharacterBuild, mode: "quick" | "standard" | "reference" = "reference") => renderToStaticMarkup(createElement(CharacterSheets, { build: b, character: deriveCharacter(b), mode }));
  for (const [ids, total] of [[DRUID_SPELL_IDS, 54], [WARLOCK_SPELL_IDS, 39], [RANGER_SPELL_IDS, 14]] as const) assert(ids.length === total && new Set(ids).size === total && ids.every((id) => spell(id)?.text), `resolved unique primal catalog ${total}`);
  assert(INVOCATIONS.length === 10, "ten supported invocation choices");
  // 九条新路线逐一交叉全部种族与背景，检测推荐、来源和草稿边界。
  for (const route of primalRoutes().filter((b) => !['moon', 'fiend', 'beast-master'].includes(b.subclassId))) for (const species of Object.keys(SPECIES) as SpeciesId[]) for (const bg of Object.keys(BACKGROUNDS) as BackgroundId[]) {
    const input = changeBackground(changeSpecies(route, species), bg), snapshot = JSON.stringify(input);
    const b = applyRecommendation(applyRecommendation(input, "configuration"), "spells"), c = deriveCharacter(b), guide = beginnerGuide(b, c), label = `${b.subclassId}/${species}/${bg}`;
    assert(validateBuild(b).canGenerate, `${label}: recommended build is legal`);
    assert(snapshot === JSON.stringify(input) && b.identity === input.identity && b.abilities === input.abilities, `${label}: preserve input and unrelated fields`);
    assert(guide.actions.length === 3 && guide.actions.every((a) => a?.title && a.how && a.cost), `${label}: three actionable beginner choices`);
    const quick = render(b, "quick");
    assert((quick.match(/data-sheet-page/g) ?? []).length === 1 && !/undefined|NaN/.test(quick), `${label}: beginner sheet renders once`);
    assert(parseDraft(JSON.stringify({ build: b, step: "character" })).state?.step === "character", `${label}: draft reload preserves valid completion`);
    assert(!c.features.includes('circle-forms') && !c.features.includes('dark-ones-blessing') && !c.primalCompanion, `${label}: no legacy subclass leakage`);
  }
  for (const b of primalRoutes()) {
    const c = deriveCharacter(b), full = render(b), auto = automaticMagic(b);
    assert(validateBuild(b).canGenerate && !/undefined|NaN/.test(full), `${b.subclassId}: complete full sheet`);
    assert(auto.cantrips.every((id) => c.spellcasting!.cantrips.includes(id)) && auto.prepared.every((id) => c.spellcasting!.prepared.includes(id)), `${b.subclassId}: all automatic grants`);
    assert(c.resources.every((r) => full.includes(String(r.max))), `${b.subclassId}: resource rendering`);
    assert(switchClass(switchClass({ build: b, step: "class" }, "fighter"), b.classId).build.subclassId === b.subclassId, `${b.subclassId}: class cache`);
    if (b.classId === "druid") {
      assert(c.wildShape?.temporaryHp === (b.subclassId === "moon" ? 9 : 3), `${b.subclassId}: correct temporary HP`);
      if (b.subclassId !== "moon") {
        assert(!c.wildShape!.knownForms.includes("brown-bear") && deriveWildShape(c, "cat").armorClass === 12, "ordinary forms retain beast AC and CR restriction");
        const bad = structuredClone(b); bad.choices.druid!.knownForms[0] = "brown-bear";
        assert(!validateBuild(bad).canGenerate, "ordinary circle cannot select CR1 bear");
      }
    }
    if (b.classId === "ranger") {
      // 伙伴数据只属于资料速查卡；常规卡不含伙伴页。
      assert(full.includes("资料速查卡 · 原初行侣") === (b.subclassId === "beast-master"), "only beast master renders companion sheet");
      const standard = render(b, "standard");
      assert(!standard.includes("资料速查卡 · 原初行侣") && standard.includes("当前 HP ____"), `${b.subclassId}: standard card excludes companion reference`);
    }
    if (b.classId === "warlock") assert((c.pactMagic!.darkBlessing > 0) === (b.subclassId === "fiend"), "only fiend gains dark blessing");
  }
  const get = (id: PrimalSubclassId) => structuredClone(primalRoutes().find((b) => b.subclassId === id)!);
  for (const land of Object.keys(LAND_TYPES) as (keyof typeof LAND_TYPES)[]) {
    let b = get("land"); b.choices.druid!.land = land; b = reconcilePrimalChoices(b);
    assert(validateBuild(b).canGenerate && automaticMagic(b).cantrips.includes(LAND_TYPES[land].cantrip), `${land}: legal terrain`);
    assert(!b.choices.druid!.prepared.some((id) => automaticMagic(b).prepared.includes(id)), `${land}: no automatic spell spends prepared slot`);
    assert(render(b).includes(LAND_TYPES[land].name), `${land}: saved terrain on sheet`);
  }
  for (const star of Object.keys(STAR_FORMS) as (keyof typeof STAR_FORMS)[]) {
    const b = get("stars"); b.choices.druid!.starForm = star;
    const c = deriveCharacter(b), full = render(b);
    assert(beginnerGuide(b, c).actions[1].title.includes(STAR_FORMS[star]) && full.includes("三种星座"), `${star}: preference changes example, retains all options`);
    assert(c.resources.find((r) => r.id === "star-guiding-bolt")?.max === Math.max(1, c.abilities.wisdom.modifier) && c.equipment.some((e) => e.id === "star-map"), "star map equipment and free uses");
  }
  const celestial = get("celestial"); celestial.choices.warlock!.invocations[0] = { id: "agonizing-blast", target: "sacred-flame" };
  assert(validateBuild(celestial).canGenerate && warlockCantrip(deriveCharacter(celestial), "sacred-flame")?.save === "敏捷", "patron cantrip may bind invocation and uses its own save");
  assert(deriveCharacter(celestial).resources.find((r) => r.id === "healing-light")?.max === 4 && render(celestial).includes("4d8 + 魅力"), "separate healing dice and upcast cure wounds");
  for (const id of Object.keys(CANTRIP_DAMAGE).filter((id) => WARLOCK_SPELL_IDS.includes(id))) {
    const b = get("fiend"); b.choices.warlock!.cantrips = [id, "prestidigitation"];
    b.choices.warlock!.invocations = [{ id: "agonizing-blast", target: id }, { id: "eldritch-mind" }, { id: "devils-sight" }];
    assert(validateBuild(b).canGenerate && !/undefined|NaN/.test(render(b)) && beginnerGuide(b, deriveCharacter(b)).actions[0].id === id, `${id}: damaging cantrip with invocation`);
  }
  const goo = get("great-old-one"); goo.choices.warlock!.psychicDamage = "psychic";
  assert(primalSpell(goo, "hex")!.components.startsWith("M") && !primalSpell(goo, "hex")!.components.includes("V") && spell("hex")!.components.includes("V"), "GOO strips class V/S without global mutation");
  assert(warlockCantrip(deriveCharacter(goo), "eldritch-blast")!.damage.includes("心灵") && render(goo).includes("仍须材料"), "GOO damage preference and materials");
  assert(beginnerGuide(goo, deriveCharacter(goo)).actions.some((a) => a.how.includes("10 心灵伤害")), "GOO beginner armor uses chosen damage type");
  const toll = get("fiend"); toll.choices.warlock!.cantrips = ["toll-the-dead", "prestidigitation"];
  assert(beginnerGuide(toll, deriveCharacter(toll)).actions[0].how.includes("1d12"), "beginner toll explains injured target die");
  const hunter = get("hunter"); hunter.choices.ranger!.huntersPrey = "horde-breaker";
  assert(beginnerGuide(hunter, deriveCharacter(hunter)).actions[2].how.includes("本回合尚未攻击过") && render(hunter).includes("当前仅拥有：灭族者"), "horde target and selected ability");
  const fey = deriveCharacter(get("fey-wanderer")), plain = deriveCharacter(get("hunter"));
  assert(fey.skills.intimidation.modifier === plain.skills.intimidation.modifier + Math.max(1, fey.abilities.wisdom.modifier) && fey.savingThrows.charisma.modifier === plain.savingThrows.charisma.modifier, "glamour affects checks, not saves");
  const gloom = deriveCharacter(get("gloom-stalker"));
  assert(gloom.initiative.modifier === plain.initiative.modifier + gloom.abilities.wisdom.modifier && gloom.speed === plain.speed && gloom.senses.darkvision === plain.senses.darkvision! + 60, "gloom initiative and darkvision, no permanent speed buff");
  const summon = get("land"); summon.choices.druid!.prepared[0] = "summon-beast";
  const summonCard = render(summon);
  assert(validateBuild(summon).canGenerate && summonCard.includes("灵魄数据") && summonCard.includes("1d8+6") && summonCard.includes("仅能水下呼吸") && summonCard.includes("200 GP"), "summon has complete conditional stat appendix");
  assert(!render(get("land")).includes("灵魄数据") && !deriveCharacter(summon).equipment.some((e) => e.id.includes("acorn")), "spell preparation does not grant creature or costly material");
  for (const [cls, sub, field] of [["druid", "land", "land"], ["druid", "stars", "starForm"], ["ranger", "hunter", "huntersPrey"], ["ranger", "fey-wanderer", "feyGift"], ["warlock", "great-old-one", "psychicDamage"]] as const) {
    const b = get(sub); (b.choices[cls] as unknown as Record<string, unknown>)[field] = "constructor";
    assert(!validateBuild(b).canGenerate, `${sub}: invalid option rejected`);
  }
  for (const cls of ["druid", "warlock", "ranger"] as ClassId[]) assert(parseDraft(JSON.stringify({ build: { ...defaultBuild(cls), identity: { name: "旧卡", alignment: "NG" } }, step: "character" })).state?.step === "character", "legacy route without new fields still valid");
}
