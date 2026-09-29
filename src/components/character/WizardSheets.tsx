import { OriginSummary, SpeciesSummary } from "./OriginSheets";
import type { CharacterBuild, DerivedCharacter } from "../../rules/types";
import type { PlayState } from "../../rules/engine/playState";
import { signed } from "../../rules/engine/format";
import { spell } from "../../data/spells";
import { skillNames } from "../../translations/zh-CN";
import { Header, Resources, Stats } from "./CharacterSheets";

type WizardProps = { build: CharacterBuild; c: DerivedCharacter };
export function SpellPages({ build, c, full = false, start, total }: WizardProps & { full?: boolean; start: number; total: number }) {
  const casting = c.spellcasting!;
  const w = build.choices.wizard!;
  // One card per spell; all learning sources remain visible when their lists overlap.
  const ids = [...new Set([...casting.cantrips, ...(full ? casting.book : casting.prepared)])];
  const pages = Array.from({ length: Math.ceil(ids.length / 6) }, (_, i) => ids.slice(i * 6, i * 6 + 6));
  return <>{pages.map((page, i) => <article className="sheet-page" data-sheet-page key={i}>
    <Header build={build} title={full ? "完整人物卡 · 法术书" : "战斗速查 · 可施展法术"} page={`${start + i} / ${total}`} />
    <p className="casting-strip">法师：攻击 {signed(casting.attack)} · DC {casting.dc}</p>
    <div className="spell-card-grid">{page.map((id) => {
      const s = spell(id);
      if (!s) return null;
      const source = [casting.cantrips.includes(id) && "职业戏法", casting.prepared.includes(id) && "职业·已准备", casting.book.includes(id) && !casting.prepared.includes(id) && "书中·未准备", w.evocationBook.includes(id) && "塑能学者"].filter(Boolean).join(" / ");
      return <section className="spell-card" key={id}><h3>{s.name} <small>{s.level === 0 ? "戏法" : `${s.level} 环`} · {s.school}</small></h3><div className="spell-source">{source}</div><p><b>{s.time}</b><br />{s.range}<br />{s.components}<br />{s.concentration ? "专注 · " : ""}{s.duration}{s.ritual ? " · 可仪式" : ""}</p><p>{s.text}</p></section>;
    })}</div>
    <footer className="sheet-footer">2024 规则 · V 言语 / S 姿势 / M 材料 · 专注同一时间只能维持一个 · 摘要仅含三级适用效果</footer>
  </article>)}</>;
}
export function WizardQuickSheet({ build, c, play }: WizardProps & { play: PlayState }) {
  const casting = c.spellcasting!;
  const total = 1 + Math.ceil(new Set([...casting.cantrips, ...casting.prepared]).size / 6);
  return <><article className="sheet-page" data-sheet-page>
    <Header build={build} title="战斗速查 · 施法与资源" page={`1 / ${total}`} /><Stats c={c} play={play} />
    <p className="casting-strip">法师法术攻击 <b>{signed(casting.attack)}</b> · 豁免 <b>DC {casting.dc}</b> · 学者专精 {skillNames[build.choices.wizard!.scholar]}</p>
    <Resources c={c} play={play} /><OriginSummary c={c} /><SpeciesSummary c={c} />
    <section><h3>你的回合</h3><p>移动至多 {c.speed} 尺；选择一个动作（如施展动作法术）。有相应能力才可使用一个附赠动作。使用迷踪步消耗法术位后，本回合可用动作施展戏法，不能再消耗另一法术位。</p><p>反应按触发使用，例如护盾术；使用后到你的下回合开始前不能再次使用反应。近旁 5 尺内有能看见你且未失能的敌人时，远程攻击具有劣势。</p></section>
    <section><h3>强力戏法与范围法术</h3><p>伤害戏法失手或目标生物豁免成功，仍造成半伤（向下取整），不附带减速等其他效果。三级尚无“法术塑形”，范围法术会影响其中的盟友。</p></section>
    <section><h3>专注与施法材料</h3><p>同一时间只能专注一个效果；新专注会终止旧专注。受伤后作体质豁免（{signed(c.savingThrows.constitution.modifier)}），DC 为 10 或伤害一半向下取整，取较高者、上限 30；失能或死亡也会终止专注。</p><p>法器或法术书可替代无标价且不消耗的材料；仍需满足言语和姿势条件。施法时间超过一动作需持续专注。</p></section>
    <section><h3>法术书仪式</h3><p>{casting.ritualSpells.map((id) => spell(id)?.name).join("、") || "无"}。阅读书中仪式可不准备、不耗法术位施展，施法时间额外增加 10 分钟；具体效果见完整人物卡。</p></section>
    <footer className="sheet-footer">当前记录随草稿保存；法术位、能力次数和 HP 均由玩家记录。</footer>
  </article><SpellPages build={build} c={c} start={2} total={total} /></>;
}
