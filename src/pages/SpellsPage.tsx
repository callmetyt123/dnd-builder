import { BuilderShell } from "../components/builder/BuilderShell";
import { SPELL_LIST, spell, spellSource } from "../data/spells";
import { defaultBuild } from "../rules/defaultBuild";
import type { WizardChoices } from "../rules/types";
import { validateWizard } from "../rules/validator/validateWizard";
import { useBuilder } from "../store/builder";
import { BACKGROUNDS } from "../data/backgrounds";

type ListKey = "cantrips" | "earlyBook" | "level3Book" | "evocationBook" | "prepared";
export function SpellsPage() {
  const { state, dispatch } = useBuilder();
  const w = state.build.choices.wizard!;
  const book = [...w.earlyBook, ...w.level3Book, ...w.evocationBook];
  const errors = validateWizard(w, BACKGROUNDS[state.build.backgroundId].skills).filter((m) => m.targetStep === "spells");
  const patch = (value: Partial<WizardChoices>) => dispatch({ type: "wizard", patch: value });
  function choices(key: ListKey, title: string, count: number, options: string[], hint: string, open = false) {
    const current = w[key];
    const bookKey = ["earlyBook", "level3Book", "evocationBook"].includes(key);
    return <details className="choice-section" open={open || undefined}><summary><span>{title}</span><span>{current.length}/{count}</span></summary><p className="hint">{hint}</p>
      <div className="spell-choices">{options.map((id) => {
        const s = spell(id)!;
        const selected = current.includes(id);
        const otherSource = bookKey && book.includes(id) && !selected;
        return <div className={`spell-choice ${selected ? "selected" : ""}`} key={id}><label><input type="checkbox" checked={selected} disabled={!selected && (current.length >= count || otherSource)} onChange={() => patch({ [key]: selected ? current.filter((v) => v !== id) : [...current, id] })} /><span><b>{s.name}</b><small>{s.level === 0 ? "戏法" : `${s.level} 环`} · {s.school} · {s.time}{s.concentration ? " · 专注" : ""}{s.ritual ? " · 仪式" : ""}{otherSource ? " · 已由其他来源学习" : ""}</small></span></label><details><summary>法术说明</summary><p>{s.range} · {s.components} · {s.duration}</p><p>{s.text}</p><a href={spellSource(s.level)} target="_blank" rel="noreferrer">查看规则来源 ↗</a></details></div>;
      })}</div>
    </details>;
  }
  const cantrips = SPELL_LIST.filter((s) => s.level === 0).map((s) => s.id);
  const first = SPELL_LIST.filter((s) => s.level === 1).map((s) => s.id);
  const leveled = SPELL_LIST.filter((s) => s.level > 0).map((s) => s.id);
  return <BuilderShell previous="configuration" next="identity" nextDisabled={errors.length > 0}>
    <section className="page-head"><h1>整理你的法术书</h1><p>推荐已配好：职业戏法 3 道、法术书 12 道、职业准备 6 道。背景获得的法术在背景页单独配置。</p></section>
    <div className="muted-panel">当前收录 {SPELL_LIST.length} 道经过核对的 2024 法师法术。先取消旧选择，再勾选替代法术；法术书中未准备的仪式仍可阅读法术书施展。</div>
    <button className="button secondary" onClick={() => { const defaults = defaultBuild("wizard").choices.wizard!; patch({ ...defaults, skills: w.skills, scholar: w.scholar }); }}>恢复推荐法术</button>
    {errors.length > 0 && <div className="message-list" role="status">{errors.map((m) => <p className="validation blocker" key={m.id}>{m.message}</p>)}</div>}
    {choices("cantrips", "法师戏法", 3, cantrips, "无需法术位，可以重复施展。")}
    {choices("earlyBook", "一至二级 · 法术书基础", 8, first, "一级学习 6 道，二级新增 2 道；这些都必须是一环法术。")}
    {choices("level3Book", "三级升级 · 新增法术", 2, leveled, "从一环或二环法术中学习 2 道。")}
    {choices("evocationBook", "塑能学者 · 额外法术", 2, leveled.filter((id) => spell(id)!.school === "塑能"), "额外学习 2 道不高于二环的塑能法术。不能与其他学习来源重复。")}
    {choices("prepared", "今日准备 · 职业法术", 6, [...new Set(book)].filter((id) => spell(id)), "只有准备好的非戏法能消耗法术位施展；长休后可更换。移出法术书的准备项请取消或恢复推荐。", true)}
    {w.prepared.filter((id) => !book.includes(id)).map((id) => <button className="button secondary" key={id} onClick={() => patch({ prepared: w.prepared.filter((v) => v !== id) })}>移除已不在书中的 {spell(id)?.name ?? id}</button>)}

  </BuilderShell>;
}
