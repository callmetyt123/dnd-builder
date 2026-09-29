import { isNewClass, NEW_CLASSES } from "../../data/newClasses";
import { NEW_FEATURE_IDS } from "../../rules/engine/newClasses";
import { METAMAGIC, PALADIN_STYLES } from "../../data/newClassFeatures";
import { newChoices } from "../../rules/newClasses";
import { features, itemNames, damageNames, masteryDescriptions } from "../../data/characterDetails";
import { primalSpell } from "../../rules/primalSubclasses";
import { ABILITIES, SKILLS } from "../../data/core";
import { WEAPONS } from "../../data/weapons";
import { signed, damageFormula } from "../../rules/engine/format";
import { abilityNames, skillNames, masteryName, zhCN } from "../../translations/zh-CN";
import type { CharacterBuild, DerivedCharacter, SkillId } from "../../rules/types";
import type { PlayState } from "../../rules/engine/playState";
import { Header, Stats, Resources } from "./CharacterSheets";
import { SpeciesSummary } from "./OriginSheets";

const packContents: Record<string,string> = {
  "explorers-pack":"背包、铺盖、2 瓶油、10 日口粮、绳索、火绒盒、10 支火把、水袋。",
  "dungeoneers-pack":"背包、铁蒺藜、撬棍、2 瓶油、10 日口粮、绳索、火绒盒、10 支火把、水袋。",
  "entertainers-pack":"背包、铺盖、铃铛、牛眼提灯、3 套戏服、镜子、8 瓶油、9 日口粮、火绒盒、水袋。",
  "priests-pack":"背包、毯子、圣水、油灯、7 日口粮、长袍、火绒盒。",
};
// 核心、资源、选择、装备和法术分开分页，避免长法术挤压核心数值。
export function NewClassSheets({build:b,c,play}:{build:CharacterBuild;c:DerivedCharacter;play:PlayState}) {
  if (!isNewClass(b.classId)) return null;
  const id=b.classId,d=NEW_CLASSES[id],q=newChoices(b)!, cast=c.spellcasting;
  const ids=[...new Set([...(cast?.cantrips ?? []),...(cast?.prepared ?? [])])];
  const pages=Array.from({length:Math.ceil(ids.length/6)},(_,i)=>ids.slice(i*6,i*6+6));
  const total=4+pages.length, head=(title:string,n:number)=><Header build={b} title={title} page={`${n} / ${total}`} />;
  const martialMod=Math.max(c.abilities.strength.modifier,c.abilities.dexterity.modifier);
  return <><article className="sheet-page core-reference" data-sheet-page>{head("完整人物卡 · 核心数值",1)}<Stats c={c} play={play}/><div className="sheet-abilities">{ABILITIES.map((a)=><div key={a}><small>{abilityNames[a]}</small><b>{c.abilities[a].score}</b><span>{signed(c.abilities[a].modifier)}</span></div>)}</div>
    <div className="sheet-columns"><section><h3>豁免 · ● 熟练</h3><div className="sheet-rolls">{ABILITIES.map((a)=><div key={a}><span>{c.savingThrows[a].proficiency==="proficient"?"●":"○"} {abilityNames[a]}</span><b>{signed(c.savingThrows[a].modifier)}{c.savingThrows[a].state==="advantage"?" 优势":""}</b></div>)}</div><SpeciesSummary c={c}/><h3>护甲与武器训练</h3><p>{d.training}{id==="cleric"&&q.order==="protector"?" 保护者另授予重甲与军用武器。":""}</p>{id==="barbarian"&&<p>未失能时敏捷豁免有优势；狂暴时力量检定和豁免有优势。</p>}</section><section><h3>全部技能 · ◆ 专精</h3><div className="sheet-rolls">{(Object.keys(SKILLS) as SkillId[]).map((v)=><div key={v}><span>{c.skills[v].proficiency==="expertise"?"◆":c.skills[v].proficiency==="proficient"?"●":"○"} {skillNames[v]}</span><b>{signed(c.skills[v].modifier)}{c.skills[v].state==="disadvantage"?" 劣势":""}</b></div>)}</div>{id==="bard"&&<p>未熟练技能含万事通 +1；先攻与豁免不加。</p>}</section></div>
    <section><h3>武器攻击 · 攻击动作一次攻击</h3><table className="sheet-attacks"><thead><tr><th>武器</th><th>命中</th><th>伤害</th><th>精通</th></tr></thead><tbody>{c.attacks.map(a=><tr key={a.weaponId}><td><b>{itemNames[a.weaponId]}</b><small>{WEAPONS[a.weaponId].properties}{a.range?` · ${a.range.join(" / ")} 尺`:" · 5 尺"}</small>{a.disadvantage&&<small>{a.disadvantage}</small>}</td><td>{signed(a.attackBonus)}</td><td>{damageFormula(a.damageDice,a.damageModifier)} {damageNames[a.damageType]}</td><td>{a.mastery?.unlocked?masteryName(a.mastery.id):"—"}</td></tr>)}</tbody></table>{id==="monk"&&<p><b>徒手攻击：</b>5 尺，命中 {signed(martialMod+2)}，1d6{signed(martialMod)} 钝击；擒抱／推撞目标力量或敏捷豁免 DC {10+martialMod}。</p>}</section><footer className="sheet-footer">武器或徒手攻击 d20 为 20 时伤害骰翻倍，固定值不翻倍。射程第二项为最远距离；超过正常射程有劣势。条件伤害尚未加入。</footer></article>
    <article className="sheet-page" data-sheet-page>{head("完整人物卡 · 能力与资源",2)}<Resources c={c} play={play}/><div className="sheet-features">{NEW_FEATURE_IDS[id].map(v=><div key={v}><b>{features[v].name}</b><small>{features[v].timing}</small><p>{features[v].text}</p></div>)}</div>{cast&&<p className="sheet-note">{id==="cleric"?"感知":"魅力"}施法，攻击 {signed(cast.attack)}，DC {cast.dc}；专注体质豁免 {signed(c.savingThrows.constitution.modifier)}，DC 为 10 或伤害一半向下取整的较高值，最高 30。一次只维持一个专注效果。</p>}</article>
    <article className="sheet-page" data-sheet-page>{head("完整人物卡 · 已选配置与用法",3)}<h3>技能与工具</h3><p>职业技能：{q.skills.map(v=>skillNames[v]).join("、")}。{id==="bard"&&`含逸闻额外三项；专精：${q.expertise.map(v=>skillNames[v]).join("、")}。`}</p><p>工具熟练：{c.tools.map(v=>itemNames[v]??v).join("、")||"无"}。</p>
    {id==="cleric"&&<><h3>当前圣职：{q.order==="protector"?"保护者":"奇术使"}</h3><p>{q.order==="protector"?"重甲训练与军用武器熟练；当前仍穿起始链甲衫。":`额外一道牧师戏法已计入；奥秘和宗教额外 +${Math.max(1,c.abilities.wisdom.modifier)} 已计入。`}</p><h3>引导神力数值</h3><p>神圣火花：1d8{signed(c.abilities.wisdom.modifier)} 治疗或伤害；火花体质、驱散亡灵感知豁免 DC {cast!.dc}。维持生命共分配 15 HP，每人至多恢复到半血。</p></>}
    {id==="monk"&&<><h3>拨挡与散打</h3><p>拨挡减伤 1d10{signed(c.abilities.dexterity.modifier+3)}；转向伤害 2d6{signed(c.abilities.dexterity.modifier)}，敏捷豁免 DC {10+c.abilities.wisdom.modifier}。散打推离与倒地的豁免 DC 同为 {10+c.abilities.wisdom.modifier}。</p><p>三级没有震慑拳、额外攻击或纯元素拨挡。免费附赠徒手与疾风连击不能在同回合各用一次。</p></>}
    {id==="sorcerer"&&<><h3>当前两种超魔法</h3>{q.metamagic.map(v=><section key={v}><h4>{METAMAGIC[v].name} · {METAMAGIC[v].cost} 术法点</h4><p>{METAMAGIC[v].text}</p></section>)}<p>先天术法开启时，术士法术攻击有优势，DC {cast!.dc+1}；不影响起源来源。龙族体魄 HP +3、无甲 AC 已计入。</p></>}
    {id==="paladin"&&<><h3>当前战斗风格：{PALADIN_STYLES[q.style].name}</h3><p>{PALADIN_STYLES[q.style].text}</p><p>圣洁武器生效：指定手持近战武器命中再加 {Math.max(1,c.abilities.charisma.modifier)}，原伤害或光耀二选一；不加伤害值。</p></>}
    {b.choices.weaponMasteries.length>0&&<section><h3>所选精通</h3>{b.choices.weaponMasteries.map(v=><p key={v}><b>{itemNames[v]} · {masteryName(WEAPONS[v].mastery)}</b>：{masteryDescriptions[WEAPONS[v].mastery]}</p>)}</section>}
    {id==="barbarian"&&<p>狂暴力量攻击伤害 +2；狂暴中鲁莽攻击的本回合首次力量命中再 +2d6。这些条件伤害未加入常驻攻击表。使用灵巧武器时只有选择力量才受益。</p>}
    <section><h3>武器与动作提醒</h3><p>轻型武器额外攻击须用另一把轻型武器，通常占附赠动作，不加正属性伤害；迅击可改纳入攻击动作，但仍每回合一次。徒手附赠攻击与轻型规则分开处理。双手武器攻击需要双手；丢失装备不会保留其防护。</p></section></article>
    <article className="sheet-page" data-sheet-page>{head("完整人物卡 · 装备与身份",4)}<div className="sheet-columns"><section><h3>起始装备</h3><div className="sheet-rolls">{c.equipment.map(e=><div key={e.id}><span>{itemNames[e.id]??e.id}</span><b>× {e.quantity}</b></div>)}</div><p>{c.armorNote}。装备变化请与主持人确认后记录。</p></section><section><h3>语言</h3><p>{c.languages.map(v=>zhCN.language[v as keyof typeof zhCN.language]).join("、")}</p>{c.equipment.filter(e=>packContents[e.id]).map(e=><section key={e.id}><h3>{itemNames[e.id]}内容</h3><p>{packContents[e.id]}</p></section>)}<h3>施法成分</h3><p>{id==="bard"?"乐器可作为吟游诗人法器。":id==="cleric"||id==="paladin"?"圣徽可作为本职业法器。":id==="sorcerer"?"奥术水晶可作为术士法器。":"起源施法按其独立来源满足材料。"}法器只替代本职业无标价且不消耗的材料；姿势需要自由手，兼有材料和姿势时可用同一只持材料的手完成。仅有姿势无材料的法术仍需空手。</p>{id==="bard"&&<p>三种乐器熟练与起始携带实物分开；当前职业实物是{itemNames[q.instrument]}。</p>}</section></div><section className="sheet-story"><h3>角色身份</h3><p>{b.identity.gender||"性别未填写"} · {b.identity.age??"—"} 岁 · {b.identity.personalityTraits?.join("、")||"性格未填写"}</p><h4>外貌</h4><p>{b.identity.appearance||"—"}</p><h4>故事</h4><p>{b.identity.description||"—"}</p></section></article>
    {pages.map((chunk,i)=><article className="sheet-page wizard-spell-page" data-sheet-page key={i}>{head("完整人物卡 · 职业法术",5+i)}<p className="casting-strip">{id==="cleric"?"感知":"魅力"} · 法术攻击 {signed(cast!.attack)} · 豁免 DC {cast!.dc} · 法术位与免费次数见资源页</p><div className="spell-card-grid">{chunk.map(v=>{const s=primalSpell(b,v)!;return <section className="spell-card" key={v}><h3>{s.name} <small>{s.level===0?"戏法":`${s.level} 环`} · {s.school}</small></h3><div className="spell-source">{d.auto.includes(v)?"职业／子职自动授予 · 始终准备":s.level===0?"职业戏法":"职业准备"}{s.ritual?" · 可仪式":""}</div><p><b>{s.time}</b> · {s.range}<br/>{s.components}<br/>{s.concentration?"专注 · ":""}{s.duration}</p><p>{s.text}</p>{id==="cleric"&&["cure-wounds","healing-word","prayer-of-healing"].includes(v)&&<p>生命门徒：耗位施法该回合的治疗另加 2 + 位环阶；免费施法不加。</p>}{c.features.includes("healer")&&["cure-wounds","healing-word","prayer-of-healing"].includes(v)&&<p>医疗师：治疗骰出现 1 可重掷，必须用新结果。</p>}</section>})}</div><footer className="sheet-footer">一回合最多消耗一个法术位施法。仪式额外花 10 分钟、不耗位，仍需成分和施法期间专注。起源法术另见附页。</footer></article>)}
  </>;
}
