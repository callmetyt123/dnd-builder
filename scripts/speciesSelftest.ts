import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CharacterSheets } from "../src/components/character/CharacterSheets";
import { BACKGROUNDS } from "../src/data/backgrounds";
import { SPECIES } from "../src/data/species";
import { ORIGIN_FEATS } from "../src/data/originOptions";
import { ORIGIN_SPELL_IDS } from "../src/data/originSpells";
import { spell } from "../src/data/spells";
import { defaultBuild } from "../src/rules/defaultBuild";
import { deriveCharacter } from "../src/rules/engine/deriveCharacter";
import { deriveWildShape } from "../src/rules/engine/wildShape";
import { normalizePlayState, updatePlayState } from "../src/rules/engine/playState";
import { changeBackground, defaultMagic, magicOptions, recommendSkills, proficientSkills } from "../src/rules/origins";
import { changeSpecies } from "../src/rules/species";
import { validateBuild } from "../src/rules/validator/validateBuild";
import { parseDraft } from "../src/store/draft";
import type { BackgroundId, ClassId, SpeciesId, CharacterBuild, MagicList } from "../src/rules/types";

export function speciesChecks(assert: (ok: unknown, message: string) => void) {
  const named = (b: CharacterBuild) => ({ ...b, identity: { name: "起源验证角色", alignment: "NG" as const } });
  // 每个职业 × 背景 × 种族均渲染两种纸卡；血系另外逐项验算，不依赖浏览器状态注入。
  for (const classId of ["fighter", "wizard", "druid", "warlock", "ranger"] as ClassId[]) {
    for (const bg of Object.keys(BACKGROUNDS) as BackgroundId[]) for (const species of Object.keys(SPECIES) as SpeciesId[]) {
      const b = named(recommendSkills(changeSpecies(changeBackground(defaultBuild(classId), bg), species)));
      const v = validateBuild(b), c = deriveCharacter(b), label = `${classId}/${bg}/${species}`;
      assert(v.canGenerate, `${label}: ${v.messages.filter((m) => m.severity === "blocker").map((m) => m.message).join(",")}`);
      assert(c.features.includes("dwarven-toughness") === (species === "dwarf"), `${label}: dwarf bonus isolated`);
      assert(c.resources.some((r) => r.id === "stonecunning") === (species === "dwarf"), `${label}: dwarf resource isolated`);
      assert(c.resources.every((r) => Number.isInteger(r.max) && r.max > 0) && new Set(c.resources.map((r) => r.id)).size === c.resources.length, `${label}: independent resources`);
      assert(c.savingThrows.wisdom.state === (species === "gnome" ? "advantage" : "normal"), `${label}: gnome save advantage isolated`);
      for (const mode of ["quick", "full"] as const) {
        const html = renderToStaticMarkup(createElement(CharacterSheets, { build: b, character: c, play: normalizePlayState(undefined, c), mode }));
        assert(!/undefined|NaN/.test(html), `${label}/${mode}: complete printed values`);
        assert(html.includes("起源能力附页") && html.includes(BACKGROUNDS[bg].name), `${label}/${mode}: origins printable`);
        assert(html.includes("石中精妙") === (species === "dwarf"), `${label}/${mode}: no stale dwarf text`);
      }
    }
  }
  for (const [id, definition] of Object.entries(SPECIES)) for (const lineage of Object.keys(definition.lineages ?? { "": "" })) {
    const b = named(changeSpecies(defaultBuild(), id as SpeciesId)); b.choices.species.lineage = lineage;
    const c = deriveCharacter(b);
    assert(validateBuild(b).canGenerate, `${id}/${lineage}: legal lineage`);
    assert(c.innateMagic.flatMap((m) => [...m.cantrips, ...m.spells]).every((s) => !!spell(s)), `${id}/${lineage}: every granted spell exists`);
    if (id === "elf") assert(c.speed === (lineage === "wood" ? 35 : 30) && c.senses.darkvision === (lineage === "drow" ? 120 : 60), `${lineage}: speed and vision`);
    if (id === "goliath") assert(!c.features.includes("large-form") && c.speed === 35, `${lineage}: no level-five benefit`);
    if (id === "dragonborn") assert(c.resistances.length === 1 && c.resources.find((r) => r.id === "breath-weapon")?.max === 2, `${lineage}: breath resistance and uses`);
  }
  const human = named(changeSpecies(defaultBuild(), "human"));
  for (const feat of ORIGIN_FEATS) {
    const b = structuredClone(human); b.choices.species.humanFeat = feat;
    assert(validateBuild(b).canGenerate === (feat !== "savage-attacker"), `${feat}: duplicate feat rules`);
  }
  const twiceMagic = changeBackground(structuredClone(human), "acolyte"); twiceMagic.choices.species.humanFeat = "magic-initiate";
  let c = deriveCharacter(twiceMagic);
  assert(validateBuild(twiceMagic).canGenerate && c.innateMagic.length === 2 && c.resources.filter((r) => ["magic-initiate", "human-magic"].includes(r.id)).length === 2, "different Magic Initiate lists coexist");
  twiceMagic.choices.species.feat.magicList = "cleric"; twiceMagic.choices.species.feat.magicInitiate = defaultMagic("cleric");
  assert(!validateBuild(twiceMagic).canGenerate, "same-list Magic Initiate cannot repeat");
  const tough = named(changeSpecies(changeBackground(defaultBuild(), "farmer"), "dwarf"));
  assert(deriveCharacter(tough).maxHp === 37, "dwarf + tough stack to 37 fighter HP");
  const alert = changeBackground(named(changeSpecies(defaultBuild(), "halfling")), "criminal"); c = deriveCharacter(alert);
  assert(c.initiative.modifier === c.abilities.dexterity.modifier + 2 && c.initiative.state === "advantage", "Alert bonus stacks with champion advantage");
  const orc = deriveCharacter(changeSpecies(defaultBuild(), "orc")); let play = normalizePlayState(undefined, orc); play.remaining["adrenaline-rush"] = 0; play.remaining["relentless-endurance"] = 0;
  play = updatePlayState(play, { type: "rest", kind: "short" }, orc);
  assert(play.remaining["adrenaline-rush"] === 2 && play.remaining["relentless-endurance"] === 0, "orc short rest restores only Adrenaline Rush");
  const druid = named(changeSpecies(defaultBuild("druid"), "gnome")); const base = deriveCharacter(druid), beast = deriveWildShape(base, "cat");
  assert(beast.savingThrows.wisdom.state === "normal" && !beast.features.includes("gnomish-cunning") && !beast.innateMagic.some((m) => m.source === "种族法术"), "wild shape removes species benefits");
  const beastHtml = renderToStaticMarkup(createElement(CharacterSheets, { build: druid, character: base, play: { ...normalizePlayState(undefined, base), formId: "cat" }, mode: "quick" }));
  assert(beastHtml.includes("类人生物（兽形）"), "wild shape retains the original creature type on paper");
  for (const list of ["cleric", "druid", "wizard"] as MagicList[]) {
    assert(ORIGIN_SPELL_IDS[list].every((id) => !!spell(id)), `${list}: complete origin catalog`);
    const b = changeBackground(human, list === "cleric" ? "acolyte" : list === "druid" ? "guide" : "sage");
    for (const s of magicOptions(list)) {
      const clone = structuredClone(b);
      if (s.level === 0) clone.choices.origin.magicInitiate.cantrips = [s.id, magicOptions(list).find((x) => x.level === 0 && x.id !== s.id)!.id];
      else clone.choices.origin.magicInitiate.spell = s.id;
      assert(validateBuild(clone).canGenerate, `${list}/${s.id}: every listed spell is selectable`);
    }
  }
  const skilled = changeBackground(structuredClone(human), "noble"); skilled.choices.species.feat.skilled = ["nature", "religion", "stealth"];
  assert(validateBuild(skilled).canGenerate && proficientSkills(skilled).includes("nature"), "Skilled can repeat with independent choices");
  const familiar = named(changeBackground(defaultBuild(), "sage")); familiar.choices.origin.magicInitiate.spell = "find-familiar";
  const familiarC = deriveCharacter(familiar);
  const familiarHtml = renderToStaticMarkup(createElement(CharacterSheets, { build: familiar, character: familiarC, play: normalizePlayState(undefined, familiarC), mode: "quick" }));
  assert(familiarHtml.includes("寻获魔宠 · 随行记录") && familiarHtml.includes("魔宠不能攻击"), "Find Familiar adds its offline reference without permitting attacks");
  const gnome = named(changeSpecies(defaultBuild(), "gnome"));
  let gnomeC = deriveCharacter(gnome);
  assert(gnomeC.resources.find((r) => r.id === "species-magic")?.max === 2, "forest gnome gets proficiency-bonus free casts");
  gnome.choices.species.lineage = "rock"; gnomeC = deriveCharacter(gnome);
  assert(!gnomeC.resources.some((r) => r.id === "species-magic") && gnomeC.innateMagic[0].cantrips.includes("mending"), "rock lineage removes forest spell and resource");
  const aasimar = deriveCharacter(changeSpecies(defaultBuild("wizard"), "aasimar"));
  assert(aasimar.innateMagic[0].ability === "charisma" && aasimar.innateMagic[0].dc === 10, "Aasimar Light remains Charisma even for a wizard");
  const originHp = deriveCharacter(changeSpecies(defaultBuild("wizard"), "human")).maxHp;
  assert(originHp === 20, "human wizard loses all dwarf HP bonuses");
  const imported = JSON.parse(JSON.stringify(named(defaultBuild("wizard")))); delete imported.choices.species;
  for (const key of ["artisanTool", "instrument", "skilled", "crafter", "musician", "magicList"]) delete imported.choices.origin[key];
  const restored = parseDraft(JSON.stringify({ build: imported, step: "review", play: { hp: 7 } })).state;
  assert(restored?.play?.hp === 7 && restored.build.choices.species.size === "medium" && restored.build.choices.origin.magicInitiate.spell === imported.choices.origin.magicInitiate.spell, "v0.7 draft upgrades without losing choices or HP");
  for (const field of ["species", "origin"]) {
    const invalid = structuredClone(imported); invalid.choices[field] = null;
    assert(parseDraft(JSON.stringify({ build: invalid })).preserveOriginal, `${field}: corrupted field preserved for recovery`);
  }
  assert(!validateBuild({ ...human, speciesId: "constructor" }).canGenerate, "species prototype key rejected");
  const invalid = structuredClone(human); invalid.choices.species.feat.skilled = ["constructor", "arcana", "medicine"];
  assert(!validateBuild(invalid).canGenerate, "tool/skill prototype key rejected");
}
