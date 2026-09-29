import { OriginSummary } from "./OriginSheets";
import type { CharacterBuild, DerivedCharacter, SkillId } from "../../rules/types";
import type { PlayState } from "../../rules/engine/playState";
import { deriveWildShape } from "../../rules/engine/wildShape";
import { beast, type Beast } from "../../data/beasts";
import { MOON_SPELLS, DRUID_ALWAYS } from "../../data/druidSpells";
import { spell } from "../../data/spells";
import { features, itemNames, damageNames } from "../../data/characterDetails";
import { ABILITIES, SKILLS } from "../../data/core";
import { abilityNames, skillNames, zhCN } from "../../translations/zh-CN";
import { signed, damageFormula } from "../../rules/engine/format";
import { Header, Stats, Resources } from "./CharacterSheets";

export function BeastActions({ form }: { form: Beast }) {
  return <section><h3>{form.name} · 动作与特性</h3>{form.traits.map((t) => <p key={t}>{t}</p>)}{form.attacks.map((a) => <p key={a.name}><b>{a.name} {signed(a.bonus)}</b> · 近战 5 尺 · {a.damage}。{a.effect}</p>)}</section>;
}
export function DruidSheets({ build, c, play, mode }: { build: CharacterBuild; c: DerivedCharacter; play: PlayState; mode: "quick" | "full" }) {
  const full = mode === "full";
  const active = deriveWildShape(c, play.formId);
  const d = build.choices.druid!;
  const ids = [...new Set([...c.spellcasting!.cantrips, ...c.spellcasting!.prepared])];
  const spellPages = Array.from({ length: Math.ceil(ids.length / 6) }, (_, i) => ids.slice(i * 6, i * 6 + 6));
  const formPages = full ? Array.from({ length: Math.ceil(d.knownForms.length / 2) }, (_, i) => d.knownForms.slice(i * 2, i * 2 + 2)) : [];
  // 页面编号依据实际渲染内容计算，当前兽形额外占一页，预览与导出共用此树。
  const total = (full ? 3 + (play.formId ? 1 : 0) + formPages.length : 1) + spellPages.length;
  let page = 0;
  const header = (title: string) => <Header build={build} title={title} page={`${++page} / ${total}`} />;
  const core = (values: DerivedCharacter, formId?: string) => {
    const form = formId ? beast(formId) : undefined;
    return <article className="sheet-page" data-sheet-page key={formId ?? "original"}>
      {header(`${full ? "完整人物卡" : "战斗速查"} · ${form?.name ?? "原形"}`)}<Stats c={values} play={play} />
      <p className="casting-strip">感知施法 · 攻击 {signed(c.spellcasting!.attack)} · DC {c.spellcasting!.dc} · 当前形态：{beast(play.formId ?? "")?.name ?? "原形"}{play.incapacitated ? " · 失能" : ""}</p>
      <div className="sheet-abilities">{ABILITIES.map((id) => <div key={id}><small>{abilityNames[id]}</small><b>{values.abilities[id].score}</b><span>{signed(values.abilities[id].modifier)}</span></div>)}</div>
      <p>{form?.size ?? "中型"} · 类人生物 · 黑暗视觉 {values.senses.darkvision} 尺 · 被动察觉 {values.passivePerception} · {values.resistances.includes("poison") ? "毒素抗性" : "无伤害抗性"}{form?.climb ? ` · 攀爬 ${form.climb} 尺` : ""}{form?.burrow ? ` · 掘地 ${form.burrow} 尺` : ""}</p>
      {full && <div className="sheet-columns"><section><h3>豁免</h3><div className="sheet-rolls">{ABILITIES.map((id) => <div key={id}><span>{values.savingThrows[id].proficiency !== "none" ? "●" : "○"} {abilityNames[id]}</span><b>{signed(values.savingThrows[id].modifier)}</b></div>)}</div><p className="sheet-note">{form ? "兽形不保留矮人的中毒豁免优势、120 尺黑暗视觉和石中精妙。" : "避免或结束中毒状态的豁免具有优势。轻甲和盾牌受训；简易武器熟练。"}{d.order === "warden" && "卫士另获中甲训练与军用武器熟练。"}</p></section><section><h3>技能 · ● 熟练 / ◆ 专精</h3><div className="sheet-rolls">{(Object.keys(SKILLS) as SkillId[]).map((id) => <div key={id}><span>{values.skills[id].proficiency === "expertise" ? "◆" : values.skills[id].proficiency === "proficient" ? "●" : "○"} {skillNames[id]}</span><b>{signed(values.skills[id].modifier)}</b></div>)}</div></section></div>}
      {form ? <BeastActions form={form} /> : <section><h3>原形武器 · 无武器精通</h3>{c.attacks.map((a) => <p key={a.weaponId}><b>{a.weaponId === "quarterstaff" ? "长棍（单手）" : itemNames[a.weaponId]}</b> · 命中 {signed(a.attackBonus)} · {damageFormula(a.damageDice, a.damageModifier)} {damageNames[a.damageType]}</p>)}</section>}
      {!full && <><Resources c={active} play={play} /><OriginSummary c={c} /></>}
      <p className="sheet-note">本页体质豁免 {signed(values.savingThrows.constitution.modifier)}。兽形保留 HP 上限、当前 HP、生命骰和心智属性；临时 HP 先承伤，耗尽不结束形态。专注不因变形终止；受伤作体质豁免，DC = max(10, 伤害一半向下取整)，上限 30；临时 HP 吸收的伤害仍计入。失能终止专注与形态。</p>
      <footer className="sheet-footer">{form ? "装备全部融入；保持语言与职业能力。数值使用 MM 2025 野兽。" : "已计入皮甲、盾牌与矮人 HP 加值。持盾时注意自由手与施法成分。"}</footer>
    </article>;
  };
  return <>{full ? <>{core(c)}{play.formId && core(active, play.formId)}</> : core(active, play.formId)}
    {full && <article className="sheet-page" data-sheet-page>{header("完整人物卡 · 能力与资源")}<Resources c={active} play={play} /><div className="sheet-features">{c.features.map((id) => <div key={id}><b>{features[id].name}</b><small>{features[id].timing}</small><p>{features[id].text}</p></div>)}</div><footer className="sheet-footer">种族能力仅原形可用；变形时保留已有 HP 上限。荒野伙伴：{play.companion ? "已召唤（妖精）" : "未召唤"}。</footer></article>}
    {full && <article className="sheet-page" data-sheet-page>{header("完整人物卡 · 装备与身份")}<div className="sheet-columns"><section><h3>装备 · 两个包 A 合并</h3><div className="sheet-rolls">{c.equipment.map((e) => <div key={e.id}><span>{e.id === "quarterstaff" ? "长棍（其中一根为德鲁伊法器）" : itemNames[e.id]}</span><b>× {e.quantity}</b></div>)}</div><p>皮甲和盾牌已着装。探索者套组含背包、铺盖、2 瓶油、10 日口粮、绳索、火绒盒、10 支火把、水袋。</p></section><section><h3>语言与工具</h3><p>{c.languages.map((id) => zhCN.language[id as keyof typeof zhCN.language]).join("、")}</p><p>工具熟练：{c.tools.map((id) => itemNames[id] ?? id).join("、")}。重复熟练不叠加，实物数量见装备表。</p><h3>变形与装备</h3><p>本方案默认装备全部融入，兽形不能使用融入的装备。若桌面采用掉落或穿戴方式，请由主持人另算。</p><h3>施法成分</h3><p>结社允许兽形施展三道结社法术，仍需满足成分；月华之光需要可用的月籽藤叶或法器，融入体内的法器不可用。请与主持人确认取用方式。</p></section></div><section className="sheet-story"><h3>身份</h3><p>{build.identity.gender || "性别未填写"} · {build.identity.age ?? "—"} 岁 · {build.identity.personalityTraits?.join("、") || "性格未填写"}</p><h4>外貌</h4><p>{build.identity.appearance || "—"}</p><h4>故事</h4><p>{build.identity.description || "—"}</p></section><footer className="sheet-footer">库存变化、魔宠行动及具体法术效果由玩家记录。</footer></article>}
    {formPages.map((forms, i) => <article className="sheet-page" data-sheet-page key={`forms-${i}`}>{header("完整人物卡 · 已知兽形")}{forms.map((id) => { const f = beast(id)!; const v = deriveWildShape(c, id); return <section key={id}><h3>{f.name} · {f.size} · CR {f.cr === 0.25 ? "1/4" : f.cr}</h3><p>AC {v.armorClass} · 原角色 HP 上限 {c.maxHp} · 变形获得 9 临时 HP · 速度 {f.speed} 尺{f.climb ? ` / 攀爬 ${f.climb}` : ""}{f.burrow ? ` / 掘地 ${f.burrow}` : ""}</p><p>{ABILITIES.map((a) => `${abilityNames[a]} ${v.abilities[a].score}（${signed(v.abilities[a].modifier)}）`).join(" · ")}</p><p>黑暗视觉 {f.darkvision} 尺 · 被动察觉 {v.passivePerception} · 隐匿 {signed(v.skills.stealth.modifier)} · 体质豁免 {signed(v.savingThrows.constitution.modifier)}</p><BeastActions form={f} /></section>; })}<footer className="sheet-footer">已采用角色熟练与野兽数据中较高的检定加值；没有野兽独立血池。形态持续时间由玩家跟踪。</footer></article>)}
    {spellPages.map((spells, i) => <article className="sheet-page" data-sheet-page key={`spells-${i}`}>{header("德鲁伊法术 · 已准备与戏法")}<p className="casting-strip">感知 · 攻击 {signed(c.spellcasting!.attack)} · DC {c.spellcasting!.dc} · 兽形仅可施展标有「结社」的法术</p><div className="spell-card-grid">{spells.map((id) => { const s = spell(id)!; const moon = MOON_SPELLS.includes(id); return <section className="spell-card" key={id}><h3>{s.name} <small>{s.level === 0 ? "戏法" : `${s.level} 环`} · {s.school}</small></h3><div className="spell-source">{moon ? "结社 · 兽形可施展（仍需成分）" : DRUID_ALWAYS.includes(id) ? "德鲁伊语 · 始终准备" : s.level === 0 ? "职业戏法" : "职业 · 已准备"}{play.formId && !moon ? " · 当前兽形不能施展" : ""}</div><p><b>{s.time}</b> · {s.range}<br />{s.components}<br />{s.concentration ? "专注 · " : ""}{s.duration}{s.ritual ? " · 可仪式" : ""}</p><p>{s.text}</p>{c.features.includes("healer") && ["cure-wounds", "healing-word"].includes(id) && <p>医疗师：治疗骰掷出 1 可重掷，必须使用新结果。</p>}</section>; })}</div><footer className="sheet-footer">只有已准备的仪式法术能用仪式施展；额外花费 10 分钟。法术位、治疗结果及专注由玩家记录。</footer></article>)}
  </>;
}
