import { BuilderShell } from "../components/builder/BuilderShell";
import { useBuilder } from "../store/builder";
import { PROFILES } from "../data/profiles";

export function ClassPage() {
  const { state, dispatch } = useBuilder();
  return <BuilderShell previous="playstyle" next="species">
    <section className="page-head"><h1>选择职业与子职</h1><p>从两个完整的三级方案开始。切换职业会保存各自的配置与冒险记录。</p></section>
    <div className="class-options">{(["fighter", "wizard"] as const).map((id) => <button key={id} className={`class-option ${state.build.classId === id ? "selected" : ""}`} aria-pressed={state.build.classId === id} onClick={() => dispatch({ type: "class", id })}>
      <span className="eyebrow">{id === "fighter" ? "武器与防护 · 操作简单" : "奥术与策略 · 需要管理法术"}</span><h2>{PROFILES[id].name} / {PROFILES[id].subclass}</h2>
      <p>{id === "fighter" ? "勇士依靠稳定的武器攻击作战，以回气与动作如潮应对关键时刻。" : "塑能师研习元素法术；强力戏法让未命中的伤害戏法也能造成半伤。"}</p>
      <span>矮人 · {PROFILES[id].background}背景 · 起始装备包 A</span>
    </button>)}</div>
    <p className="muted-panel">当前支持上述两套职业、子职与背景组合。塑能师的法术塑形在 6 级获得，三级范围法术仍需避开盟友。</p>
  </BuilderShell>;
}
