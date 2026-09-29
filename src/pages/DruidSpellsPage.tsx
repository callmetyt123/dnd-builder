import { BuilderShell } from "../components/builder/BuilderShell";
import { DRUID_ALWAYS, DRUID_CANTRIPS, DRUID_PREPARABLE, MOON_SPELLS } from "../data/druidSpells";
import { spell } from "../data/spells";
import { useBuilder } from "../store/builder";

export function DruidSpellsPage() {
  const { state, dispatch } = useBuilder();
  const d = state.build.choices.druid!;
  const choices = (key: "cantrips" | "prepared", title: string, count: number, ids: string[]) => <section className="section"><h2>{title} · {d[key].length}/{count}</h2><div className="druid-spell-options">{ids.map((id) => {
    const s = spell(id)!;
    return <label className="druid-spell-choice" key={id}><input type="checkbox" checked={d[key].includes(id)} disabled={!d[key].includes(id) && d[key].length >= count} onChange={() => dispatch({ type: "druid", patch: { [key]: d[key].includes(id) ? d[key].filter((v) => v !== id) : [...d[key], id] } })} /><span><b>{s.name}</b><small>{s.level === 0 ? "戏法" : `${s.level} 环`} · {s.time} · {s.concentration ? "专注 · " : ""}{s.duration}</small><small>{s.text}</small></span></label>;
  })}</div></section>;
  return <BuilderShell previous="configuration" next="identity"><section className="page-head"><h1>准备自然魔法</h1><p>以感知施法；三级有 4 个一环、2 个二环法术位，长休恢复。德鲁伊不使用法术书，长休可从职业列表重新准备。</p></section>

    <p className="muted-panel">当前法术库为核对过的三级子集。点点星芒和三道始终准备法术自动获得，不重复占用下面的名额。</p>
    {choices("cantrips", "职业戏法", d.order === "magician" ? 3 : 2, DRUID_CANTRIPS)}
    {choices("prepared", "职业准备法术", 6, DRUID_PREPARABLE)}
    <section className="success-panel"><h2>自动获得</h2><p>{[MOON_SPELLS[0], ...DRUID_ALWAYS].map((id) => spell(id)!.name).join("、")}</p><p>兽形只能施展结社法术：点点星芒、疗伤术、月华之光。变形不会中断已有专注；只可对已准备的仪式法术使用仪式施法。</p></section>
  </BuilderShell>;
}
