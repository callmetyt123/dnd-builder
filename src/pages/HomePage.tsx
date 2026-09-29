import { useBuilder } from "../store/builder";

export function HomePage() {
  const { dispatch, hasDraft, state } = useBuilder();
  return (
    <div className="landing">
      <div className="eyebrow">DUNGEONS & DRAGONS · 5R</div>
      <h1>创建你的冒险者</h1>
      <p className="lead">不需要提前了解规则。我们会一步步帮助你完成一个 3 级角色。</p>
      <div className="landing-actions">
        <button className="button primary large" onClick={() => dispatch({ type: "step", step: hasDraft && state.step !== "home" ? state.step : "playstyle" })}>{hasDraft ? "继续创建" : "开始创建角色"}</button>
        <button className="button secondary large" onClick={() => dispatch({ type: "step", step: "class" })}>我熟悉 D&D，直接选职业</button>
      </div>
      <div className="landing-points"><span>✓ D&D 5R</span><span>✓ 自动推荐构筑</span><span>✓ 电子人物卡</span></div>
      <p className="dev-note">三级矮人方案：战士／勇士／士兵，法师／塑能师／贤者，德鲁伊／月亮结社／隐士，或魔契师／邪魔宗主／流浪者。</p>
    </div>
  );
}
