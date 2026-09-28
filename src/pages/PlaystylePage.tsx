import { BuilderShell } from "../components/builder/BuilderShell";
import { Card } from "../components/common/Card";
import { useBuilder } from "../store/builder";

const styles = [
  ["melee", "正面战斗", "冲进前线，直接解决敌人。"],
  ["mobile", "灵活作战", "移动、寻找机会并快速调整位置。"],
  ["ranged", "远程攻击", "保持距离，用远程武器精准攻击。"],
  ["magic", "魔法输出", "用法术造成强力效果。"],
  ["support", "帮助队友", "治疗、强化或控制战局。"],
  ["hybrid", "魔武结合", "同时使用武器和魔法。"],
] as const;

export function PlaystylePage() {
  const { state, dispatch } = useBuilder();
  const toggle = (id: string) => {
    const current = state.build.playstyle.tags;
    const next = current.includes(id) ? current.filter((v) => v !== id) : current.length >= 2 ? [current[1], id] : [...current, id];
    dispatch({ type: "playstyle", tags: next, complexity: state.build.playstyle.complexity });
  };
  return (
    <BuilderShell next="class">
      <section className="page-head"><h1>你希望在战斗中做什么？</h1><p>最多选择两个你觉得有意思的方向。</p></section>
      <div className="card-grid two">{styles.map(([id, title, desc]) => <Card key={id} selected={state.build.playstyle.tags.includes(id)} onClick={() => toggle(id)}><h3>{title}</h3><p>{desc}</p></Card>)}</div>
      <section className="section"><h2>你希望角色有多复杂？</h2><div className="segmented">
        {[["simple", "尽量简单"], ["balanced", "有一些选择没问题"], ["deep", "我喜欢研究很多能力"]].map(([id, label]) => <button key={id} className={state.build.playstyle.complexity === id ? "active" : ""} onClick={() => dispatch({ type: "playstyle", tags: state.build.playstyle.tags, complexity: id as "simple" | "balanced" | "deep" })}>{label}</button>)}
      </div></section>
    </BuilderShell>
  );
}
