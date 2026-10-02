import { PLAYSTYLES } from "../rules/guides/onboarding";
import { BuilderShell } from "../components/builder/BuilderShell";
import { Card } from "../components/common/Card";
import { useBuilder } from "../store/builder";

export function PlaystylePage() {
  const { state, dispatch } = useBuilder();
  const toggle = (id: string) => {
    const current = state.build.playstyle.tags.filter((tag) => PLAYSTYLES.some(([id]) => id === tag));
    const next = current.includes(id) ? current.filter((v) => v !== id) : current.length >= 2 ? [current[1], id] : [...current, id];
    dispatch({ type: "playstyle", tags: next, complexity: state.build.playstyle.complexity });
  };
  return (
    <BuilderShell next="class">
      <section className="page-head"><h1>你想扮演怎样的冒险者？</h1><p><strong>最多选择两个</strong>喜欢的方向。它们会影响下一步的职业推荐，不会限制你的选择；还没想好也可以继续。</p></section>
      <div className="card-grid two">{PLAYSTYLES.map(([id, title, desc]) => <Card key={id} selected={state.build.playstyle.tags.includes(id)} onClick={() => toggle(id)}><h3>{title}</h3><p>{desc}</p></Card>)}</div>
      <section className="section"><h2>你希望角色有多复杂？</h2><div className="segmented">
        {[["simple", "尽量简单"], ["balanced", "有一些选择没问题"], ["deep", "我喜欢研究很多能力"]].map(([id, label]) => <button key={id} className={state.build.playstyle.complexity === id ? "active" : ""} onClick={() => dispatch({ type: "playstyle", tags: state.build.playstyle.tags, complexity: id as "simple" | "balanced" | "deep" })}>{label}</button>)}
      </div></section>
    </BuilderShell>
  );
}
