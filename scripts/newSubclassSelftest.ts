import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CharacterSheets } from "../src/components/character/CharacterSheets";
import { NEW_SUBCLASSES, newAutoSpells, newAutoCantrips, newSkillCount } from "../src/data/newSubclasses";
import { PALADIN_STYLES } from "../src/data/newClassFeatures";
import { NEW_CLASS_IDS } from "../src/data/newClasses";
import { SPECIES } from "../src/data/species";
import { BACKGROUNDS } from "../src/data/backgrounds";
import { defaultBuild } from "../src/rules/defaultBuild";
import { changeNewSubclass, patchNewChoices, newChoices } from "../src/rules/newClasses";
import { changeSpecies } from "../src/rules/species";
import { changeBackground } from "../src/rules/origins";
import { applyRecommendation } from "../src/rules/guides/onboarding";
import { beginnerGuide } from "../src/rules/guides/beginnerGuide";
import { deriveCharacter } from "../src/rules/engine/deriveCharacter";
import { validateBuild } from "../src/rules/validator/validateBuild";
import { parseDraft, switchClass } from "../src/store/draft";
import { spell } from "../src/data/spells";
import { WILD_MAGIC } from "../src/data/wildMagic";
import type { CharacterBuild, NewSubclassId, SpeciesId, BackgroundId } from "../src/rules/types";

export function newSubclassChecks(assert:(ok:unknown,message:string)=>void) {
  const ready=(b:CharacterBuild)=>({...b,identity:{name:"子职验证",alignment:"NG" as const}});
  const recommend=(b:CharacterBuild)=>applyRecommendation(applyRecommendation(b,"configuration"),"spells");
  const make=(sub:NewSubclassId)=>recommend(ready(changeNewSubclass(defaultBuild(NEW_SUBCLASSES[sub].classId),sub)));
  const render=(b:CharacterBuild,mode:"quick"|"full")=>renderToStaticMarkup(createElement(CharacterSheets,{build:b,character:deriveCharacter(b),mode}));
  assert(Object.keys(NEW_SUBCLASSES).length===24,"six classes each have four subclasses");
  for(const id of NEW_CLASS_IDS) assert(Object.values(NEW_SUBCLASSES).filter(s=>s.classId===id).length===4,`${id}: four routes`);
  // 每个新子职与所有起源组合验证名额和恢复；不能用一个默认种族代表全部组合。
  for(const [sub,def] of Object.entries(NEW_SUBCLASSES)) {
    const b=make(sub as NewSubclassId),c=deriveCharacter(b),full=render(b,"full"),quick=render(b,"quick");
    assert(validateBuild(b).canGenerate,`${sub}: recommended build valid`);
    assert(!/undefined|NaN/.test(full+quick)&&full.includes(def.name),`${sub}: sheets contain complete localized content`);
    assert((quick.match(/data-sheet-page/g)??[]).length===1,`${sub}: beginner guide one page`);
    assert(def.features.every(f=>c.features.includes(f)),`${sub}: own features`);
    const alien=Object.values(NEW_SUBCLASSES).filter(s=>s.classId===def.classId&&s!==def).flatMap(s=>s.features).filter(f=>!def.features.includes(f));
    assert(alien.every(f=>!c.features.includes(f)),`${sub}: no other subclass abilities`);
    assert(newAutoSpells(b).every(s=>!!spell(s)&&c.spellcasting?.prepared.includes(s)),`${sub}: automatic spells resolve`);
    assert(newAutoCantrips(b).every(s=>c.spellcasting?.cantrips.includes(s)&&!newChoices(b)!.cantrips.includes(s)),`${sub}: extra cantrip separate`);
    assert(JSON.stringify(switchClass(switchClass({build:b,step:"class"},"fighter"),def.classId).build)===JSON.stringify(b),`${sub}: class cache`);
    for(const sp of Object.keys(SPECIES) as SpeciesId[]) for(const bg of Object.keys(BACKGROUNDS) as BackgroundId[]) {
      const before=ready(changeBackground(changeSpecies(b,sp),bg)),snapshot=JSON.stringify(before),next=recommend(before),label=`${sub}/${sp}/${bg}`;
      assert(validateBuild(next).canGenerate,`${label}: legal ${JSON.stringify(validateBuild(next).messages.filter(m=>m.severity==="blocker"))}`);
      assert(JSON.stringify(before)===snapshot&&next.abilities===before.abilities&&next.identity===before.identity,`${label}: recommendation scoped and immutable`);
      assert(newChoices(next)!.skills.length===newSkillCount(next),`${label}: subclass skill count`);
      assert(parseDraft(JSON.stringify({build:next,step:"character"})).state?.step==="character",`${label}: finished draft roundtrip`);
      assert(beginnerGuide(next,deriveCharacter(next)).actions.length===3,`${label}: three guide actions`);
    }
    for(const [other,otherDef] of Object.entries(NEW_SUBCLASSES).filter(([,v])=>v.classId===def.classId)) {
      const snapshot=JSON.stringify(b),next=changeNewSubclass(b,other as NewSubclassId),n=newChoices(next)!;
      assert(JSON.stringify(b)===snapshot&&next.abilities===b.abilities&&next.identity===b.identity,`${sub}->${other}: preserve user context`);
      assert(n.prepared.every(s=>newChoices(b)!.prepared.includes(s)&&!newAutoSpells(next).includes(s)),`${sub}->${other}: preserve legal spells only`);
      assert(validateBuild(recommend(next)).canGenerate,`${sub}->${other}: repair recommendation`);
      assert(otherDef.features.every(f=>deriveCharacter(recommend(next)).features.includes(f)),`${other}: new mechanics`);
    }
  }
  const dance=deriveCharacter(make("dance")),lore=deriveCharacter(make("lore"));
  assert(dance.armorClass===10+dance.abilities.dexterity.modifier+dance.abilities.charisma.modifier&&dance.armorClass!==lore.armorClass,"dance: unarmored AC");
  const sor=deriveCharacter(make("wild-magic")),dragon=deriveCharacter(make("draconic"));
  assert(dragon.maxHp===sor.maxHp+3&&sor.armorClass===10+sor.abilities.dexterity.modifier,"non-draconic: no dragon HP or AC");
  const shadow=deriveCharacter(make("shadow")),mercy=deriveCharacter(make("mercy"));
  assert(shadow.senses.darkvision===180,"shadow: dwarf vision plus 60");
  assert(mercy.tools.includes("herbalism-kit")&&mercy.skills.medicine.proficiency!=="none"&&mercy.skills.insight.proficiency!=="none","mercy fixed proficiencies");
  const light=deriveCharacter(make("light")),war=deriveCharacter(make("war"));
  assert(!light.resources.find(r=>r.id==="warding-flare")?.shortRestRestore&&war.resources.find(r=>r.id==="war-priest")!.shortRestRestore!>0,"different short-rest rules");
  assert(Object.keys(PAD()).length===11,"ten fighting styles plus blessed warrior");
  for(const style of Object.keys(PAD())) {const b=patchNewChoices(make("vengeance"),{style});assert(validateBuild(b).canGenerate&&render(b,"full").includes(PAD()[style].name),`${style}: legal and documented`);}
  const pal=make("devotion"),thrown=deriveCharacter(patchNewChoices(pal,{style:"thrown-weapon-fighting"})),normal=deriveCharacter(pal);
  assert(thrown.attacks.find(a=>a.weaponId==="javelin")!.damageModifier===normal.attacks.find(a=>a.weaponId==="javelin")!.damageModifier+2,"thrown javelin adds damage");
  assert(!validateBuild(patchNewChoices(pal,{style:"invalid"})).canGenerate,"invalid fighting style blocked");
  assert(WILD_MAGIC.length===25&&WILD_MAGIC[0][0]==="01–04"&&WILD_MAGIC[24][0]==="97–100","wild table all 100 outcomes");
  assert(!render(make("light"),"full").includes("生命门徒："),"light has no life healing bonus");
  assert(!beginnerGuide(make("world-tree"),deriveCharacter(make("world-tree"))).actions.some(a=>a.how.includes("首次力量命中额外 +2d6")),"world tree guide no frenzy");
}
function PAD(){return PALADIN_STYLES;}
