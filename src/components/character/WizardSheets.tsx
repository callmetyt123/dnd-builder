import type { CharacterBuild, DerivedCharacter } from "../../rules/types";
import { signed } from "../../rules/engine/format";
import { spell } from "../../data/spells";
import { Header } from "./CharacterSheets";

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
