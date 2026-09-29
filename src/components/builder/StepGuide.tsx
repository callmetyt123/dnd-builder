import { useState } from "react";
import { recommendationInfo, isRecommendationStep } from "../../rules/guides/onboarding";
import { useBuilder } from "../../store/builder";

// 同一份推荐模型同时驱动预览和按钮，避免说明与实际替换的选项不一致。
export function StepGuide() {
  const { state, dispatch } = useBuilder();
  const [applied, setApplied] = useState(false);
  if (!isRecommendationStep(state.step)) return null;
  const info = recommendationInfo(state.build, state.step);
  return <aside className="step-guide" aria-label="本步推荐">
    <div><strong>{info.title}</strong><p>{info.why}</p><p className="recommendation-scope">{info.scope}</p><details><summary>查看推荐内容</summary><p>{info.preview}</p></details></div>
    <button className="button secondary" onClick={() => { dispatch({ type: "recommend-step", step: state.step as Parameters<typeof recommendationInfo>[1] }); setApplied(true); }}>{info.label}</button>
    {applied && <span className="recommendation-applied" role="status">已采用推荐；仍可在下方自行调整。</span>}
    <small>可以直接沿用当前选择继续；点击按钮才会替换，也可在下方自行选择。</small>
  </aside>;
}
