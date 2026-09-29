import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CharacterSheets } from "../src/components/character/CharacterSheets";
import { NEW_CLASS_IDS, NEW_CLASSES } from "../src/data/newClasses";
import { NEW_CLASS_SPELL_IDS } from "../src/data/newClassSpells";
import { primalSpell } from "../src/rules/primalSubclasses";
import { METAMAGIC } from "../src/data/newClassFeatures";
import { SPECIES } from "../src/data/species";
import { BACKGROUNDS } from "../src/data/backgrounds";
import { spell } from "../src/data/spells";
import { defaultBuild } from "../src/rules/defaultBuild";
import { patchNewChoices, newChoices, newCantripCount } from "../src/rules/newClasses";
import { changeSpecies } from "../src/rules/species";
import { changeBackground } from "../src/rules/origins";
import { applyRecommendation } from "../src/rules/guides/onboarding";
import { beginnerGuide } from "../src/rules/guides/beginnerGuide";
import { deriveCharacter } from "../src/rules/engine/deriveCharacter";
import { validateBuild } from "../src/rules/validator/validateBuild";
import { parseDraft, switchClass } from "../src/store/draft";
import type { CharacterBuild, SpeciesId, BackgroundId } from "../src/rules/types";

export function newClassChecks(assert:(ok:unknown,message:string)=>void) {
  const ready=(b:CharacterBuild)=>({...b,identity:{name:"六职业验证",alignment:"NG" as const}});
  const render=(b:CharacterBuild,mode:"quick"|"full")=>renderToStaticMarkup(createElement(CharacterSheets,{build:b,character:deriveCharacter(b),mode}));
  for(const [id,count] of [["bard",61],["cleric",41],["paladin",16],["sorcerer",72]] as const) assert(NEW_CLASS_SPELL_IDS[id].length===count&&new Set(NEW_CLASS_SPELL_IDS[id]).size===count&&NEW_CLASS_SPELL_IDS[id].every(v=>!!spell(v)?.text),`${id}: full catalog resolves`);
  // 全部起源组合经过推荐、派生与重新载入，防止新职业借用旧职业兜底。
  for(const id of NEW_CLASS_IDS) for(const species of Object.keys(SPECIES) as SpeciesId[]) for(const bg of Object.keys(BACKGROUNDS) as BackgroundId[]) {
    const source=ready(changeBackground(changeSpecies(defaultBuild(id),species),bg)), snapshot=JSON.stringify(source);
    const b=applyRecommendation(applyRecommendation(source,"configuration"),"spells"),c=deriveCharacter(b),label=`${id}/${species}/${bg}`;
    assert(validateBuild(b).canGenerate,`${label}: legal recommendation ${JSON.stringify(validateBuild(b).messages.filter(v=>v.severity==="blocker"))}`);
    assert(snapshot===JSON.stringify(source)&&b.abilities===source.abilities,`${label}: no mutation or unrelated reset`);
    const guide=beginnerGuide(b,c),quick=render(b,"quick");
    assert(guide.actions.length===3&&guide.actions.every(a=>a.title&&a.how&&a.cost),`${label}: three useful actions`);
    assert((quick.match(/data-sheet-page/g)??[]).length===1&&!/undefined|NaN/.test(quick),`${label}: one valid beginner sheet`);
    assert(parseDraft(JSON.stringify({build:b,step:"character"})).state?.step==="character",`${label}: restore finished build`);
    assert(!c.features.includes("arcane-recovery")&&!c.resources.some(v=>v.id==="arcane-recovery"),`${label}: no wizard leakage`);
  }
  for(const id of NEW_CLASS_IDS) {
    const b=ready(defaultBuild(id)),c=deriveCharacter(b),full=render(b,"full"),q=newChoices(b)!;
    assert(validateBuild(b).canGenerate,`${id}: initial build legal`);
    assert(!/undefined|NaN|class-instrument|class-tool/.test(full),`${id}: full sheet complete`);
    assert(c.hitDie===NEW_CLASSES[id].hitDie&&c.maxHp>0,`${id}: class hit dice`);
    assert(JSON.stringify(switchClass(switchClass({build:b,step:"class"},"fighter"),id).build)===JSON.stringify(b),`${id}: class cache preserves custom choices`);
    assert(!validateBuild(patchNewChoices(b,{skills:[]})).canGenerate,`${id}: missing skills block`);
    if(q.prepared.length) assert(!validateBuild(patchNewChoices(b,{prepared:[...q.prepared.slice(1),"wish"]})).canGenerate,`${id}: unknown or high spell blocked`);
    assert(NEW_CLASSES[id].auto.every(v=>c.spellcasting!.prepared.includes(v)),`${id}: automatic spells included`);
  }
  assert(primalSpell(defaultBuild("bard"), "healing-word")!.text.includes("魅力调整值")&&!primalSpell(defaultBuild("bard"), "healing-word")!.text.includes("感知调整值"), "bard: healing uses Charisma in spell cards");
  assert(primalSpell(defaultBuild("paladin"), "cure-wounds")!.text.includes("魅力调整值"), "paladin: healing uses Charisma");
  assert(!primalSpell(defaultBuild("sorcerer"), "arcane-vigor")!.text.includes("法师 d6"), "sorcerer: no wizard hit dice label");
  const monk=ready(defaultBuild("monk")),m=deriveCharacter(monk);
  assert(m.armorClass===10+m.abilities.dexterity.modifier+m.abilities.wisdom.modifier&&m.speed===40, "monk: AC and speed");
  assert(m.attacks.find(a=>a.weaponId==="dagger")?.damageDice==="1d6"&&m.attacks.find(a=>a.weaponId==="spear")?.attackBonus===2+Math.max(m.abilities.strength.modifier,m.abilities.dexterity.modifier),"monk: martial weapons use d6 and Dexterity");
  const cleric=ready(defaultBuild("cleric")),protector=patchNewChoices(cleric,{order:"protector"});
  assert(newCantripCount(cleric)===4&&newCantripCount(protector)===3&&newChoices(protector)!.cantrips.length===3&&validateBuild(protector).canGenerate,"cleric: order changes quota legally");
  const cl=deriveCharacter(cleric),pr=deriveCharacter(protector);
  assert(cl.skills.arcana.modifier-pr.skills.arcana.modifier===Math.max(1,cl.abilities.wisdom.modifier),"cleric: thaumaturge adds Wisdom");
  const pal=ready(defaultBuild("paladin")),blessed=patchNewChoices(pal,{style:"blessed-warrior"});
  assert(newChoices(blessed)!.cantrips.length===2&&validateBuild(blessed).canGenerate&&deriveCharacter(pal).armorClass-deriveCharacter(blessed).armorClass===1,"paladin: blessed warrior replaces defense");
  assert(deriveCharacter(pal).skills.stealth.state==="disadvantage","paladin: chain mail imposes stealth disadvantage");
  for(const id of Object.keys(METAMAGIC)) {
    const b=patchNewChoices(ready(defaultBuild("sorcerer")),{metamagic:[id,id==="subtle"?"empowered":"subtle"]});
    assert(validateBuild(b).canGenerate&&render(b,"full").includes(METAMAGIC[id].text.replace(/&/g,"&amp;")),`${id}: selected metamagic recorded`);
  }
  assert(!validateBuild(patchNewChoices(ready(defaultBuild("sorcerer")),{metamagic:["subtle","subtle"]})).canGenerate,"duplicate metamagic blocked");
}
