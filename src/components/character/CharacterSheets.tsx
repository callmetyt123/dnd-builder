import { isNewClass } from "../../data/newClasses";
import { NewClassSheets } from "./NewClassSheets";
import { PrimalSubclassSheet } from "./PrimalSubclassSheet";
import { SummonedBeastSheet } from "./SummonedBeastSheet";
import { SubclassSheet } from "./SubclassSheet";
import { subclassFeatures } from "../../rules/expandedSubclasses";
import { BeginnerSheet } from "./BeginnerSheet";
import { normalizePlayState } from "../../rules/engine/playState";
import { RogueSheets } from "./RogueSheets";
import { FamiliarSheet } from "./FamiliarSheet";
import { SPECIES } from "../../data/species";
import { OriginSpellSheet, OriginSummary, OriginDetailSheet, SpeciesSummary, classFeatureIds, isOriginResource } from "./OriginSheets";
import { RangerSheets } from "./RangerSheets";
import { WarlockSheets } from "./WarlockSheets";
import { DruidSheets } from "./DruidSheets";
import type { CharacterBuild, DerivedCharacter, DerivedRoll } from "../../rules/types";
import type { PlayState } from "../../rules/engine/playState";
import { signed, damageFormula } from "../../rules/engine/format";
import { abilityNames, alignmentNames, skillNames, masteryName, zhCN } from "../../translations/zh-CN";
import { damageNames, features, itemNames, masteryDescriptions } from "../../data/characterDetails";
import { WEAPONS } from "../../data/weapons";
import { SpellPages } from "./WizardSheets";
import { ABILITIES, SKILLS } from "../../data/core";

type Props = { build: CharacterBuild; character: DerivedCharacter; play?: PlayState; mode: "quick" | "full" };
function Roll({ roll }: { roll: DerivedRoll }) {
  return <><b>{signed(roll.modifier)}</b>{roll.state !== "normal" && <em>{roll.state === "advantage" ? "优势" : "劣势"}</em>}</>;
}
export function Header({ build, title, page }: { build: CharacterBuild; title: string; page: string }) {
  return <header className="sheet-header"><div><div className="sheet-kicker">D&D 5R / {title}</div><h2>{build.identity.name}</h2><p>{SPECIES[build.speciesId].name} · {zhCN.class[build.classId]} 3 级 · {zhCN.subclass[build.subclassId]} · {zhCN.background[build.backgroundId]} · {build.identity.alignment && alignmentNames[build.identity.alignment]}</p></div><span className="sheet-page-number">{page}</span></header>;
}
export function Stats({ c }: { c: DerivedCharacter; play: PlayState }) {
  return <div className="sheet-stats"><div><small>生命值 HP 上限</small><strong>{c.maxHp}</strong><small>当前 HP ____ · 临时 HP ____</small></div><div><small>护甲等级 AC</small><strong>{c.armorClass}</strong><small>{c.armorNote ?? (c.spellcasting ? `无甲；法师护甲生效时 ${13 + c.abilities.dexterity.modifier}` : "链甲 + 防御")}</small></div><div><small>先攻</small><strong>{signed(c.initiative.modifier)}</strong><small>{c.initiative.state === "advantage" ? "优势" : "正常检定"}</small></div><div><small>速度</small><strong>{c.speed}<sub> 尺</sub></strong><small>熟练加值 {signed(c.proficiencyBonus)}</small></div></div>;
}
function Attacks({ c }: { c: DerivedCharacter }) {
  return <section><h3>攻击与武器</h3><table className="sheet-attacks"><thead><tr><th>武器 / 射程（尺）</th><th>命中</th><th>伤害</th><th>精通</th></tr></thead><tbody>{c.attacks.map((a) => <tr key={a.weaponId}><td><b>{itemNames[a.weaponId]}</b><small>{WEAPONS[a.weaponId].properties ?? "近战 5 尺"}{a.range ? ` · ${a.range.join(" / ")}` : ""}</small>{a.disadvantage && <small className="rule-alert">{a.disadvantage}</small>}</td><td>{signed(a.attackBonus)}</td><td>{damageFormula(a.damageDice, a.damageModifier)}<small>{damageNames[a.damageType]}</small></td><td>{a.mastery?.unlocked ? masteryName(a.mastery.id) : "未解锁"}</td></tr>)}</tbody></table><p className="sheet-note">攻击动作：1 次攻击。武器与徒手攻击 d20 为 {c.criticalThreshold === 19 ? "19–20" : "20"} 时重击（伤害骰加倍，固定加值不加倍）。超过正常射程的远程攻击具有劣势，不可超过最大射程。</p></section>;
}
export function Resources({ c, play }: { c: DerivedCharacter; play: PlayState }) {
  return <section><h3>线下资源记录 · 使用后勾选方框</h3><div className="sheet-resources">{c.resources.filter((r) => !isOriginResource(c, r.id)).map((r) => <div key={r.id}><b>{features[r.id].name}{!!play.formId && (c.speciesFeatures.includes(r.id) || r.id === "species-magic") ? "（兽形不可用）" : ""} <span>{"□ ".repeat(r.max)} / {r.max}</span></b><small>{r.recovery}</small></div>)}<div><b>生命骰 <span>□ □ □ / {c.level} d{c.hitDie}</span></b><small>短休可消耗，每骰恢复 max(1, 1d{c.hitDie}{signed(c.abilities.constitution.modifier)}) HP；长休全恢复。</small></div></div></section>;
}
function Masteries({ c }: { c: DerivedCharacter }) {
  const active = [...new Set(c.attacks.filter((a) => a.mastery?.unlocked).map((a) => a.mastery!.id))];
  if (!active.length) return null;
  return <section><h3>已解锁精通速查</h3><div className="sheet-masteries">{active.map((id) => <p key={id}><b>{masteryName(id)}</b>　{masteryDescriptions[id]}</p>)}</div></section>;
}
// 历史草稿中的冒险状态继续保留，但新车卡产物只由构筑决定。
export function CharacterSheets(props: Props) {
  if (props.mode === "quick") return <BeginnerSheet build={props.build} c={props.character} />;
  const play = normalizePlayState(undefined, props.character);
  return <><ClassSheets {...props} play={play} /><PrimalSubclassSheet build={props.build} c={props.character} /><SummonedBeastSheet build={props.build} c={props.character} /><OriginDetailSheet build={props.build} c={props.character} play={play} /><OriginSpellSheet build={props.build} c={props.character} play={play} /><FamiliarSheet build={props.build} c={props.character} /></>;
}
function ClassSheets({ build, character: c, play, mode }: Props & { play: PlayState }) {
  if (isNewClass(build.classId)) return <NewClassSheets build={build} c={c} play={play} />;
  if (build.classId === "rogue") return <RogueSheets build={build} c={c} play={play} mode={mode} />;
  if (build.classId === "ranger") return <RangerSheets build={build} c={c} play={play} mode={mode} />;
  if (build.classId === "warlock") return <WarlockSheets build={build} c={c} play={play} mode={mode} />;
  if (build.classId === "druid") return <DruidSheets build={build} c={c} play={play} mode={mode} />;
  const wizard = build.classId === "wizard";
  const extraPage = !["champion", "evoker"].includes(build.subclassId);
  const total = 3 + Number(extraPage) + (c.spellcasting ? Math.ceil(new Set([...c.spellcasting.cantrips, ...(wizard ? c.spellcasting.book : c.spellcasting.prepared)]).size / 6) : 0);
  return <>
    <article className="sheet-page core-reference" data-sheet-page>
      <Header build={build} title="完整人物卡 · 核心数值" page={`01 / ${total}`} /><Stats c={c} play={play} />
      <div className="sheet-abilities">{ABILITIES.map((id) => <div key={id}><small>{abilityNames[id]}</small><b>{c.abilities[id].score}</b><span>{signed(c.abilities[id].modifier)}</span></div>)}</div>
      <div className="sheet-columns"><section><h3>豁免检定</h3><div className="sheet-rolls">{ABILITIES.map((id) => <div key={id}><span>{c.savingThrows[id].proficiency !== "none" ? "●" : "○"} {abilityNames[id]}</span><Roll roll={c.savingThrows[id]} /></div>)}</div><p className="sheet-note">◆ 专精　● 熟练　○ 未熟练</p><h3>感官与防护</h3><SpeciesSummary c={c} /><h3>护甲与武器训练</h3><p>{wizard ? "无护甲受训；简易武器熟练。" : "轻甲、中甲、重甲、盾牌；简易武器、军用武器。"}</p></section><section><h3>全部技能</h3><div className="sheet-rolls">{(Object.keys(SKILLS) as (keyof typeof SKILLS)[]).map((id) => <div key={id}><span>{c.skills[id].proficiency === "expertise" ? "◆" : c.skills[id].proficiency === "proficient" ? "●" : "○"} {skillNames[id]} <small>{abilityNames[SKILLS[id].defaultAbility]}</small></span><Roll roll={c.skills[id]} /></div>)}</div></section></div>
      <Attacks c={c} /><footer className="sheet-footer">D&D 5R · 固定生命值成长 · 属性、熟练与装备效果已计入</footer>
    </article>
    <article className="sheet-page" data-sheet-page>
      <Header build={build} title="完整人物卡 · 能力与资源" page={`02 / ${total}`} /><Resources c={c} play={play} />
      <section><h3>职业、种族与专长</h3><div className="sheet-features">{classFeatureIds(c).filter((id) => !extraPage || !subclassFeatures(build).includes(id)).map((id) => <div key={id}><b>{features[id]?.name ?? id}</b><small>{features[id]?.timing}</small><p>{features[id]?.text}</p></div>)}</div></section>
      <Masteries c={c} /><footer className="sheet-footer">短休至少 1 小时；长休通常 8 小时，精灵出神可用 4 小时。仍须满足其他休息条件。</footer>
    </article>
    <article className="sheet-page" data-sheet-page>
      <Header build={build} title="完整人物卡 · 装备与身份" page={`03 / ${total}`} />
      <div className="sheet-columns"><section><h3>起始装备</h3><div className="sheet-rolls">{c.equipment.map((item) => <div key={item.id}><span>{item.id === "quarterstaff" && build.classId === "wizard" ? "长棍（其中一根为奥术法器）" : itemNames[item.id] ?? item.id}</span><b>× {item.quantity}</b></div>)}</div><p className="sheet-note">{wizard ? "未着装护甲；施展法师护甲后才可使用对应 AC。" : "链甲已着装，隐匿检定具有劣势；力量不足 13 时速度 −10 尺（已计入）。"}此处列出起始装备，消耗品数量由玩家另行记录。</p></section><section><h3>语言与工具</h3><p>{c.languages.map((id) => zhCN.language[id as keyof typeof zhCN.language]).join("、")}</p><p>工具熟练：{c.tools.map((id) => itemNames[id] ?? id).join("、")}</p>{wizard ? <><h3>学者套组</h3><p>背包、书籍、墨水、墨水笔、油灯、10 瓶油、10 张羊皮纸、火绒盒。</p><h3>施法材料</h3><p>奥术法器或法术书替代无标价且不消耗的材料。言语需能出声；姿势需一只自由手。兼有材料和姿势成分时，持法器的手可完成该法术的姿势。</p></> : <><h3>地城探索者套组</h3><p>背包、铁蒺藜、撬棍、2 瓶油、10 日份口粮、绳索、火绒盒、10 支火把、水袋。</p>{c.equipment.some((e) => e.id === "healers-kit") && <><h3>医疗包</h3><p>共 10 次；以利用动作花费 1 次，使一名 0 HP 且昏迷的生物伤势稳定，无需医药检定。</p></>}</>}</section></div>
      <section className="sheet-story"><h3>角色身份</h3><p>{build.identity.gender || "性别未填写"} · {build.identity.age === undefined ? "年龄未填写" : `${build.identity.age} 岁`} · {build.identity.personalityTraits?.join("、") || "性格未填写"}</p><h4>外貌</h4><p>{build.identity.appearance || "—"}</p><h4>故事</h4><p>{build.identity.description || "—"}</p></section>
      <footer className="sheet-footer">D&D 5R · 初始构筑记录 · 装备变化请与主持人确认</footer>
    </article>
    {extraPage && <SubclassSheet build={build} c={c} total={total} />}
    {c.spellcasting && <SpellPages build={build} c={c} full start={4 + Number(extraPage)} total={total} />}
  </>;
}
