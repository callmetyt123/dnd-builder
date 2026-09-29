import { BACKGROUNDS, RECOMMENDED_BACKGROUND } from "../data/backgrounds";
import { BuilderShell } from "../components/builder/BuilderShell";
import { useBuilder } from "../store/builder";
import { PROFILES } from "../data/profiles";

export function ClassPage() {
  const { state, dispatch } = useBuilder();
  return <BuilderShell previous="playstyle" next="species">
    <section className="page-head"><h1>选择职业与子职</h1><p>从五个完整的三级方案开始。切换职业会保存各自的配置与冒险记录。</p></section>
    <div className="class-options">{(["fighter", "wizard", "druid", "warlock", "ranger"] as const).map((id) => <button key={id} className={`class-option ${state.build.classId === id ? "selected" : ""}`} aria-pressed={state.build.classId === id} onClick={() => dispatch({ type: "class", id })}>
      <span className="eyebrow">{id === "ranger" ? "弓箭与伙伴 · 协同作战" : id === "warlock" ? "契约与祈唤 · 短休恢复法术位" : id === "fighter" ? "武器与防护 · 操作简单" : id === "druid" ? "自然与变形 · 兼顾施法和近战" : "奥术与策略 · 需要管理法术"}</span><h2>{PROFILES[id].name} / {PROFILES[id].subclass}</h2>
      <p>{id === "ranger" ? "驯兽师与原初行侣共同作战，管理伙伴行动、猎人印记与一环法术。" : id === "warlock" ? "邪魔宗主授予额外法术；以三项魔能祈唤定制戏法、防护与感官。" : id === "fighter" ? "勇士依靠稳定的武器攻击作战，以回气与动作如潮应对关键时刻。" : id === "druid" ? "月亮结社化身野兽，以临时生命值保护自身，并在兽形施展结社法术。" : "塑能师研习元素法术；强力戏法让未命中的伤害戏法也能造成半伤。"}</p>
      <span>矮人 · {BACKGROUNDS[RECOMMENDED_BACKGROUND[id]].name}为推荐背景 · 可在后续更换</span>
    </button>)}</div>
    <p className="muted-panel">这五种职业子职方案可自由搭配四种已开放背景。塑能师的法术塑形在 6 级获得，三级范围法术仍需避开盟友。</p>
  </BuilderShell>;
}
