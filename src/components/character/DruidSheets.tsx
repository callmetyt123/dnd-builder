import { automaticMagic, primalSubclass } from "../../data/primalSubclasses";
import { primalSpell } from "../../rules/primalSubclasses";
import { hasPrimalAppendix } from "./PrimalSubclassSheet";
import { DAMAGE_NAMES } from "../../data/species";
import { OriginSummary, SpeciesSummary, classFeatureIds } from "./OriginSheets";
import type { CharacterBuild, DerivedCharacter, SkillId } from "../../rules/types";
import type { PlayState } from "../../rules/engine/playState";
import { deriveWildShape } from "../../rules/engine/wildShape";
import { beast, type Beast } from "../../data/beasts";
import { MOON_SPELLS } from "../../data/druidSpells";
import { features, itemNames, damageNames } from "../../data/characterDetails";
import { ABILITIES, SKILLS } from "../../data/core";
import { abilityNames, skillNames, zhCN } from "../../translations/zh-CN";
import { signed, damageFormula } from "../../rules/engine/format";
import { Header, Stats, Resources } from "./CharacterSheets";
import type { SheetMode } from "./CharacterSheets";

export function BeastActions({ form }: { form: Beast }) {
  return <section><h3>{form.name} · 动作与特性</h3>{form.traits.map((t) => <p key={t}>{t}</p>)}{form.attacks.map((a) => <p key={a.name}><b>{a.name} {signed(a.bonus)}</b> · 近战 5 尺 · {a.damage}。{a.effect}</p>)}</section>;
}
// 常规卡一页只放原形战斗数值与资源；兽形数据、职业能力全文与法术卡全部归入资料速查卡。
export function DruidSheets({ build, c, play, mode }: { build: CharacterBuild; c: DerivedCharacter; play: PlayState; mode: SheetMode }) {
  const standard = mode === "standard";
  const d = build.choices.druid!;
  const ids = [...new Set([...c.spellcasting!.cantrips, ...c.spellcasting!.prepared])];
  const spellPages = Array.from({ length: Math.ceil(ids.length / 6) }, (_, i) => ids.slice(i * 6, i * 6 + 6));
  const formPages = standard ? [] : Array.from({ length: Math.ceil(d.knownForms.length / 2) }, (_, i) => d.knownForms.slice(i * 2, i * 2 + 2));
  const total = standard ? 1 : 2 + formPages.length + spellPages.length;
  let page = 0;
  const header = (title: string) => <Header build={build} title={title} page={`${++page} / ${total}`} />;
  const core = (values: DerivedCharacter, formId?: string) => {
    const form = formId ? beast(formId) : undefined;
    return <article className="sheet-page" data-sheet-page key={formId ?? "original"}>
      {header(`常规人物卡 · ${form?.name ?? "原形"}`)}<Stats c={values} play={play} />
      <p className="casting-strip">感知施法 · 攻击 {signed(c.spellcasting!.attack)} · DC {c.spellcasting!.dc} · 当前形态：{beast(play.formId ?? "")?.name ?? "原形"}{play.incapacitated ? " · 失能" : ""}</p>
      <div className="sheet-abilities">{ABILITIES.map((id) => <div key={id}><small>{abilityNames[id]}</small><b>{values.abilities[id].score}</b><span>{signed(values.abilities[id].modifier)}</span></div>)}</div>
      <p>{form ? `${form.size}类人生物（兽形）` : values.size === "small" ? "小型类人生物" : "中型类人生物"} · {values.senses.darkvision ? `黑暗视觉 ${values.senses.darkvision} 尺` : "普通视觉"} · 被动察觉 {values.passivePerception} · {values.resistances.length ? values.resistances.map((id) => DAMAGE_NAMES[id] ?? id).join("、") + "伤害抗性" : "无伤害抗性"}{form?.climb ? ` · 攀爬 ${form.climb} 尺` : ""}{form?.burrow ? ` · 掘地 ${form.burrow} 尺` : ""}</p>
      <div className="sheet-columns"><section><h3>豁免</h3><div className="sheet-rolls">{ABILITIES.map((id) => <div key={id}><span>{values.savingThrows[id].proficiency !== "none" ? "●" : "○"} {abilityNames[id]}</span><b>{signed(values.savingThrows[id].modifier)}{values.savingThrows[id].state === "advantage" ? " 优势" : ""}</b></div>)}</div><p className="sheet-note">{form ? "兽形不保留原形的种族能力，使用野兽的感官与抗性。" : "轻甲和盾牌受训；简易武器熟练。"}{d.order === "warden" && "卫士另获中甲训练与军用武器熟练。"}</p></section><section><h3>技能 · ● 熟练 / ◆ 专精</h3><div className="sheet-rolls">{(Object.keys(SKILLS) as SkillId[]).map((id) => <div key={id}><span>{values.skills[id].proficiency === "expertise" ? "◆" : values.skills[id].proficiency === "proficient" ? "●" : "○"} {skillNames[id]}</span><b>{signed(values.skills[id].modifier)}</b></div>)}</div></section></div>
      {!form && <section><h3>原形武器 · 无武器精通</h3>{c.attacks.map((a) => <p key={a.weaponId}><b>{a.weaponId === "quarterstaff" ? "长棍（单手）" : itemNames[a.weaponId]}</b> · 命中 {signed(a.attackBonus)} · {damageFormula(a.damageDice, a.damageModifier)} {damageNames[a.damageType]}</p>)}</section>}
      <Resources c={values} play={play} /><OriginSummary c={c} />{!form && <SpeciesSummary c={c} />}
      <p className="sheet-note">本页体质豁免 {signed(values.savingThrows.constitution.modifier)}。兽形保留 HP 上限、当前 HP、生命骰和心智属性；临时 HP 先承伤，耗尽不结束形态。专注不因变形终止；受伤作体质豁免，DC = max(10, 伤害一半向下取整)，上限 30；临时 HP 吸收的伤害仍计入。失能终止专注与形态。</p>
      <footer className="sheet-footer">{form ? "装备全部融入；保持语言与职业能力。数值使用 MM 2025 野兽。" : "已计入皮甲、盾牌与所选起源 HP 加值。持盾时注意自由手与施法成分。"}</footer>
    </article>;
  };
  return <>
    {(standard || !play.formId) && core(standard ? c : deriveWildShape(c, play.formId), standard ? undefined : play.formId)}
    {!standard && <article className="sheet-page" data-sheet-page>{header("资料速查卡 · 职业能力")}<div className="sheet-features">{classFeatureIds(c).filter((id) => !hasPrimalAppendix(build) || !primalSubclass(build)!.features.includes(id)).map((id) => <div key={id}><b>{features[id].name}</b><small>{features[id].timing}</small><p>{features[id].text}</p></div>)}</div><footer className="sheet-footer">种族能力仅原形可用；变形时保留已有 HP 上限。荒野伙伴：{play.companion ? "已召唤（妖精）" : "未召唤"}。</footer></article>}
    {!standard && <article className="sheet-page" data-sheet-page>{header("资料速查卡 · 装备与变形说明")}<div className="sheet-columns"><section><h3>装备 · 两个包 A 合并</h3><div className="sheet-rolls">{c.equipment.map((e) => <div key={e.id}><span>{e.id === "quarterstaff" ? "长棍（其中一根为德鲁伊法器）" : itemNames[e.id]}</span><b>× {e.quantity}</b></div>)}</div><p>皮甲和盾牌已着装。探索者套组含背包、铺盖、2 瓶油、10 日口粮、绳索、火绒盒、10 支火把、水袋。</p></section><section><h3>语言与工具</h3><p>{c.languages.map((id) => zhCN.language[id as keyof typeof zhCN.language]).join("、")}</p><p>工具熟练：{c.tools.map((id) => itemNames[id] ?? id).join("、")}。重复熟练不叠加，实物数量见装备表。</p><h3>变形与装备</h3><p>本方案默认装备全部融入，兽形不能使用融入的装备。若桌面采用掉落或穿戴方式，请由主持人另算。</p><h3>施法成分</h3><p>{build.subclassId === "moon" ? "月亮结社允许兽形施展三道结社法术，仍需满足成分；月华之光需要可用的月籽藤叶或法器，融入体内的法器不可用。" : "三级普通野兽形态不能施法。原形施法需满足言语、姿势与材料；星耀形态保留原形施法能力。"}</p></section></div><footer className="sheet-footer">库存变化、魔宠行动及具体法术效果由玩家记录。</footer></article>}
    {formPages.map((forms, i) => <article className="sheet-page" data-sheet-page key={`forms-${i}`}>{header("资料速查卡 · 已知兽形")}{forms.map((id) => { const f = beast(id)!; const v = deriveWildShape(c, id); return <section key={id}><h3>{f.name} · {f.size} · CR {f.cr === 0.25 ? "1/4" : f.cr}</h3><p>AC {v.armorClass} · 原角色 HP 上限 {c.maxHp} · 变形获得 {c.wildShape!.temporaryHp} 临时 HP · 速度 {f.speed} 尺{f.climb ? ` / 攀爬 ${f.climb}` : ""}{f.burrow ? ` / 掘地 ${f.burrow}` : ""}</p><p>{ABILITIES.map((a) => `${abilityNames[a]} ${v.abilities[a].score}（${signed(v.abilities[a].modifier)}）`).join(" · ")}</p><p>黑暗视觉 {f.darkvision} 尺 · 被动察觉 {v.passivePerception} · 隐匿 {signed(v.skills.stealth.modifier)} · 体质豁免 {signed(v.savingThrows.constitution.modifier)}</p><BeastActions form={f} /></section>; })}<footer className="sheet-footer">已采用角色熟练与野兽数据中较高的检定加值；没有野兽独立血池。形态持续时间由玩家跟踪。</footer></article>)}
    {spellPages.map((spells, i) => <article className="sheet-page wizard-spell-page" data-sheet-page key={`spells-${i}`}>{header("资料速查卡 · 德鲁伊法术")}<p className="casting-strip">感知 · 攻击 {signed(c.spellcasting!.attack)} · DC {c.spellcasting!.dc} · {build.subclassId === "moon" ? "兽形仅可施展标有「结社」的法术" : "野兽形态不能施法"}</p><div className="spell-card-grid">{spells.map((id) => { const s = primalSpell(build, id)!; const moon = build.subclassId === "moon" && MOON_SPELLS.includes(id); return <section className="spell-card" key={id}><h3>{s.name} <small>{s.level === 0 ? "戏法" : `${s.level} 环`} · {s.school}</small></h3><div className="spell-source">{moon ? "结社 · 兽形可施展（仍需成分）" : id === "speak-with-animals" ? "德鲁伊语 · 始终准备" : [...automaticMagic(build).cantrips, ...automaticMagic(build).prepared].includes(id) ? build.subclassId === "stars" ? "星图 · 持握时授予" : "结社 · 自动授予" : s.level === 0 ? "职业戏法" : "职业 · 已准备"}{play.formId && !moon ? " · 当前兽形不能施展" : ""}</div><p><b>{s.time}</b> · {s.range}<br />{s.components}<br />{s.concentration ? "专注 · " : ""}{s.duration}{s.ritual ? " · 可仪式" : ""}</p><p>{s.text}</p>{c.features.includes("healer") && ["cure-wounds", "healing-word"].includes(id) && <p>医疗师：治疗骰掷出 1 可重掷，必须使用新结果。</p>}</section>; })}</div><footer className="sheet-footer">只有已准备的仪式法术能用仪式施展；额外花费 10 分钟。法术位、治疗结果及专注由玩家记录。</footer></article>)}
  </>;
}
