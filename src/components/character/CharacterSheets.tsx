import { isNewClass } from "../../data/newClasses";
import { NewClassSheets } from "./NewClassSheets";
import { PrimalSubclassSheet } from "./PrimalSubclassSheet";
import { SummonedBeastSheet } from "./SummonedBeastSheet";
import { SubclassSheet } from "./SubclassSheet";
import { BeginnerSheet } from "./BeginnerSheet";
import { normalizePlayState } from "../../rules/engine/playState";
import { RogueSheets } from "./RogueSheets";
import { FamiliarSheet } from "./FamiliarSheet";
import { SPECIES } from "../../data/species";
import { OriginSpellSheet, OriginDetailSheet, SpeciesSummary, classFeatureIds, isOriginOnlyResource } from "./OriginSheets";
import { RangerSheets } from "./RangerSheets";
import { WarlockSheets } from "./WarlockSheets";
import { DruidSheets } from "./DruidSheets";
import { SpellPages } from "./WizardSheets";
import { deriveCharacter } from "../../rules/engine/deriveCharacter";
import { newChoices } from "../../rules/newClasses";
import { newAutoCantrips, newAutoSpells } from "../../data/newSubclasses";
import { primalSpell } from "../../rules/primalSubclasses";
import { wizardSpell } from "../../rules/expandedSubclasses";
import { spell as spellEntry } from "../../data/spells";
import type { CharacterBuild, DerivedCharacter, DerivedRoll, SkillId } from "../../rules/types";
import type { PlayState } from "../../rules/engine/playState";
import { signed, damageFormula } from "../../rules/engine/format";
import { abilityNames, alignmentNames, skillNames, masteryName, zhCN } from "../../translations/zh-CN";
import { damageNames, features, itemNames, masteryDescriptions } from "../../data/characterDetails";
import { WEAPONS } from "../../data/weapons";
import { ABILITIES, SKILLS } from "../../data/core";

// 三种产物分工固定：quick 一页上手引导，standard 两页实战记录，reference 全部规则描述。
export type SheetMode = "quick" | "standard" | "reference";
// character 是 build 的派生值，省略时按 build 现场派生，便于自检脚本只传构筑。
type Props = { build: CharacterBuild; character?: DerivedCharacter; play?: PlayState; mode: SheetMode };
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
  return <section><h3>线下资源记录 · 使用后勾选方框</h3><div className="sheet-resources">{c.resources.filter((r) => !isOriginOnlyResource(c, r.id)).map((r) => <div key={r.id}><b>{features[r.id].name}{!!play.formId && (c.speciesFeatures.includes(r.id) || r.id === "species-magic") ? "（兽形不可用）" : ""} <span>{"□ ".repeat(r.max)} / {r.max}</span></b><small>{r.recovery}</small></div>)}<div><b>生命骰 <span>□ □ □ / {c.level} d{c.hitDie}</span></b><small>短休可消耗，每骰恢复 max(1, 1d{c.hitDie}{signed(c.abilities.constitution.modifier)}) HP；长休全恢复。</small></div></div></section>;
}
function Masteries({ c }: { c: DerivedCharacter }) {
  const active = [...new Set(c.attacks.filter((a) => a.mastery?.unlocked).map((a) => a.mastery!.id))];
  if (!active.length) return null;
  return <section><h3>已解锁精通速查</h3><div className="sheet-masteries">{active.map((id) => <p key={id}><b>{masteryName(id)}</b>　{masteryDescriptions[id]}</p>)}</div></section>;
}
// 常规人物卡只列名称与触发时机；完整解释统一放在资料速查卡，避免打印件堆成手册。
function AbilityNames({ c }: { c: DerivedCharacter }) {
  const names = classFeatureIds(c).map((id) => features[id]?.name ?? id);
  if (!names.length) return null;
  return <section><h3>职业、种族与专长能力</h3><p>{names.join("、")}</p><p className="sheet-note">完整规则文本见资料速查卡；扮演时若需要判定细节，以速查卡或规则书为准。</p></section>;
}
function IdentityFooter({ build }: { build: CharacterBuild }) {
  const identity = build.identity;
  const summary = [identity.gender || "性别未填写", identity.age === undefined ? "年龄未填写" : `${identity.age} 岁`, identity.personalityTraits?.join("、") || "性格未填写"].join(" · ");
  const story = [identity.appearance ? `外貌：${identity.appearance}` : "", identity.description ? `故事：${identity.description}` : ""].filter(Boolean).join("　");
  return <footer className="sheet-identity-footer"><b>角色身份：</b>{summary}{story ? `　${story}` : ""}</footer>;
}
// 常规卡只列法术名，让玩家知道"我有哪些法术"；规则全文留在资料速查卡。
export function spellGroups(build: CharacterBuild, c: DerivedCharacter): { label: string; names: string }[] {
  const name = (id: string) => primalSpell(build, id)?.name ?? spellEntry(id)?.name ?? id;
  const names = (ids: string[]) => [...new Set(ids)].map(name).join("、");
  const w = build.classId === "wizard" ? c.spellcasting?.book ?? [] : [];
  if (build.classId === "fighter") return [
    { label: "戏法", names: names(c.spellcasting?.cantrips ?? []) },
    { label: "已准备", names: names(c.spellcasting?.prepared ?? []) },
  ].filter((group) => group.names);
  if (build.classId === "wizard") {
    const wanted = c.spellcasting?.prepared ?? [];
    const prepared = w.filter((id) => wanted.includes(id));
    const unprepared = w.filter((id) => !wanted.includes(id));
    return [
      { label: "戏法", names: names(c.spellcasting?.cantrips ?? []) },
      { label: "已准备", names: names(prepared) },
      { label: "法术书中未准备", names: names(unprepared) },
    ].filter((group) => group.names);
  }
  if (build.classId === "rogue") return [
    { label: "戏法", names: names(c.spellcasting?.cantrips ?? []) },
    { label: "已准备", names: names(c.spellcasting?.prepared ?? []) },
  ].filter((group) => group.names);
  if (build.classId === "druid") return [
    { label: "戏法", names: names(c.spellcasting?.cantrips ?? []) },
    { label: "已准备", names: names(c.spellcasting?.prepared ?? []) },
  ].filter((group) => group.names);
  if (build.classId === "warlock") return [
    { label: "戏法", names: names(c.spellcasting?.cantrips ?? []) },
    { label: "已准备（契约法术位）", names: names(c.spellcasting?.prepared ?? []) },
    { label: "祈唤随意施法", names: names(c.pactMagic?.atWill ?? []) },
  ].filter((group) => group.names);
  if (build.classId === "ranger") return [
    { label: "已准备", names: names(c.spellcasting?.prepared ?? []) },
  ].filter((group) => group.names);
  const q = newChoices(build);
  if (!q) return [];
  return [
    { label: "戏法", names: names([...q.cantrips, ...newAutoCantrips(build), ...(c.spellcasting?.cantrips ?? [])]) },
    { label: "已准备", names: names([...q.prepared, ...newAutoSpells(build), ...(c.spellcasting?.prepared ?? [])]) },
  ].filter((group) => group.names);
}
function SpellNames({ build, c }: { build: CharacterBuild; c: DerivedCharacter }) {
  const groups = spellGroups(build, c);
  if (!groups.length) return null;
  return <section><h3>法术名录</h3>{groups.map((group) => <p key={group.label}><b>{group.label}：</b>{group.names}</p>)}<p className="sheet-note">施法时间、射程、成分与完整效果见资料速查卡；法术位与免费次数见上方资源勾选框。</p></section>;
}
// 核心数值页在两种卡里共用，保证默认资源与写空位始终有一份可记录的位置。
export function CoreReferencePage({ build, c, play, page, total, title = "常规人物卡 · 核心数值", footer }: { build: CharacterBuild; c: DerivedCharacter; play: PlayState; page: number; total: number; title?: string; footer: string }) {
  return <article className="sheet-page" data-sheet-page>
    <Header build={build} title={title} page={`${page} / ${total}`} /><Stats c={c} play={play} />
    <div className="sheet-abilities">{ABILITIES.map((id) => <div key={id}><small>{abilityNames[id]}</small><b>{c.abilities[id].score}</b><span>{signed(c.abilities[id].modifier)}</span></div>)}</div>
    <div className="sheet-columns"><section><h3>豁免检定 · ● 熟练</h3><div className="sheet-rolls">{ABILITIES.map((id) => <div key={id}><span>{c.savingThrows[id].proficiency !== "none" ? "●" : "○"} {abilityNames[id]}</span><Roll roll={c.savingThrows[id]} /></div>)}</div><SpeciesSummary c={c} /><h3>护甲与武器训练</h3><p>{build.classId === "wizard" ? "无护甲受训；简易武器熟练。" : "轻甲、中甲、重甲、盾牌；简易武器、军用武器。"}</p><h3>语言与工具</h3><p>{c.languages.map((id) => zhCN.language[id as keyof typeof zhCN.language]).join("、")}</p><p>{c.tools.map((id) => itemNames[id] ?? id).join("、") || "无工具熟练"}</p></section><section><h3>全部技能 · ◆ 专精 / ● 熟练</h3><div className="sheet-rolls">{(Object.keys(SKILLS) as SkillId[]).map((id) => <div key={id}><span>{c.skills[id].proficiency === "expertise" ? "◆" : c.skills[id].proficiency === "proficient" ? "●" : "○"} {skillNames[id]} <small>{abilityNames[SKILLS[id].defaultAbility]}</small></span><Roll roll={c.skills[id]} /></div>)}</div></section></div>
    <Attacks c={c} />
    <section><Resources c={c} play={play} /></section>
    <AbilityNames c={c} /><SpellNames build={build} c={c} /><Masteries c={c} />
    <footer className="sheet-footer">{footer}</footer>
  </article>;
}
function StandardCard({ build, c, play }: { build: CharacterBuild; c: DerivedCharacter; play: PlayState }) {
  return <>
    <CoreReferencePage build={build} c={c} play={play} page={1} total={2} footer="D&D 5R · 固定生命值成长 · 属性、熟练与装备效果已计入。能力的完整说明见资料速查卡。" />
    <article className="sheet-page" data-sheet-page>
      <Header build={build} title="常规人物卡 · 装备与身份" page="02 / 02" />
      <div className="sheet-columns"><section><h3>起始装备</h3><div className="sheet-rolls">{c.equipment.map((item) => <div key={item.id}><span>{itemNames[item.id] ?? item.id}</span><b>× {item.quantity}</b></div>)}</div><p className="sheet-note">{c.armorNote ?? "护甲状态见核心数值页"}；装备变化与消耗品由玩家记录。</p></section><section><h3>本页记录</h3><p>当前 HP ____ / {c.maxHp} · 临时 HP ____ · 生命骰已用 □ □ □</p><p>短休至少 1 小时；长休通常 8 小时，精灵出神可用 4 小时，仍须满足其他休息条件。</p></section></div>
      <IdentityFooter build={build} />
    </article>
  </>;
}
// 资料速查卡：只收录规则描述，不重复常驻数值，供线上或桌边查阅。
function ReferenceSheets({ build, c, play }: { build: CharacterBuild; c: DerivedCharacter; play: PlayState }) {
  return <><ClassReference build={build} c={c} play={play} /><PrimalSubclassSheet build={build} c={c} /><SummonedBeastSheet build={build} c={c} /><OriginDetailSheet build={build} c={c} play={play} /><OriginSpellSheet build={build} c={c} play={play} /><FamiliarSheet build={build} c={c} /></>;
}
function ClassReference({ build, c: character, play }: { build: CharacterBuild; c: DerivedCharacter; play: PlayState }) {
  if (isNewClass(build.classId)) return <NewClassSheets build={build} c={character} play={play} mode="reference" />;
  if (build.classId === "rogue") return <RogueSheets build={build} c={character} play={play} mode="reference" />;
  if (build.classId === "ranger") return <RangerSheets build={build} c={character} play={play} mode="reference" />;
  if (build.classId === "warlock") return <WarlockSheets build={build} c={character} play={play} mode="reference" />;
  if (build.classId === "druid") return <DruidSheets build={build} c={character} play={play} mode="reference" />;
  // 战士与法师：核心记录 + 职业能力全文 + 子职描述；有施法能力的子职再附法术卡。
  const featureIds = classFeatureIds(character);
  const hasSubclassAppendix = !["champion", "evoker"].includes(build.subclassId);
  const spellCount = character.spellcasting ? new Set([...character.spellcasting.cantrips, ...(build.classId === "wizard" ? character.spellcasting.book : character.spellcasting.prepared)]).size : 0;
  const spellPageCount = spellCount ? Math.ceil(spellCount / 6) : 0;
  const total = 1 + Number(!!featureIds.length) + Number(hasSubclassAppendix) + spellPageCount;
  let page = 1;
  const header = (title: string, n: number) => <Header build={build} title={title} page={`${n} / ${total}`} />;
  return <>
    <CoreReferencePage build={build} c={character} play={play} page={page++} total={total} title="资料速查卡 · 核心记录" footer="常驻数值与默认资源记录；职业能力与子职描述见后续页。" />
    {!!featureIds.length && <article className="sheet-page" data-sheet-page>{header("资料速查卡 · 职业能力", page++)}<div className="sheet-features">{featureIds.map((id) => <div key={id}><b>{features[id]?.name ?? id}</b><small>{features[id]?.timing}</small><p>{features[id]?.text}</p></div>)}</div></article>}
    {hasSubclassAppendix && <SubclassSheet build={build} c={character} total={total} />}
    {!!spellPageCount && <SpellPages build={build} c={character} full start={page} total={total} />}
  </>;
}
export function CharacterSheets(props: Props) {
  if (props.mode === "quick") return <BeginnerSheet build={props.build} c={props.character ?? deriveCharacter(props.build)} />;
  const character = props.character ?? deriveCharacter(props.build);
  // 历史草稿中的冒险状态继续保留，但新增车卡产物只由构筑决定。
  const play = normalizePlayState(undefined, character);
  if (props.mode === "standard") return <StandardCard build={props.build} c={character} play={play} />;
  return <ReferenceSheets build={props.build} c={character} play={play} />;
}
