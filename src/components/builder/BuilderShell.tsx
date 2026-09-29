import { StepGuide } from "./StepGuide";
import { validateBuild } from "../../rules/validator/validateBuild";
import { stepBlockers, STEP_NAMES } from "../../rules/guides/onboarding";
import { hasSpellStep } from "../../data/rogue";
import { Children, type ReactNode } from "react";
import { useBuilder, type BuilderStep } from "../../store/builder";

const ALL_STEPS: { id: BuilderStep; label: string }[] = [
  { id: "playstyle", label: "玩法" },
  { id: "class", label: "职业" },
  { id: "species", label: "种族" },
  { id: "background", label: "背景" },
  { id: "abilities", label: "属性" },
  { id: "configuration", label: "配置" },
  { id: "spells", label: "法术" },
  { id: "identity", label: "身份" },
  { id: "review", label: "检查" },
];

export function BuilderShell({ children, previous, next, nextLabel = "下一步", nextDisabled = false }: { children: ReactNode; previous?: BuilderStep; next?: BuilderStep; nextLabel?: string; nextDisabled?: boolean }) {
  const { state, dispatch, storageError } = useBuilder();
  const issues = stepBlockers(validateBuild(state.build).messages, state.step);
  const content = Children.toArray(children);
  const blocked = nextDisabled || issues.length > 0;
  const FLOW = ALL_STEPS.filter((s) => s.id !== "spells" || hasSpellStep(state.build));
  const currentIndex = FLOW.findIndex((item) => item.id === state.step);
  return (
    <div className="app-shell">
      <header className="site-header">
        <div>
          <strong>D&D 5R</strong>
          <span>角色创建器</span>
        </div>
        <span className="saved-indicator">{storageError ? "保存失败" : "草稿自动保存"}</span>
      </header>
      <div className="progress-wrap">
        <div className="progress-mobile">步骤 {currentIndex + 1} / {FLOW.length} · {FLOW[currentIndex]?.label}</div>
        <div className="progress-bar"><span style={{ width: `${((currentIndex + 1) / FLOW.length) * 100}%` }} /></div>
        <div className="progress-desktop">{FLOW.map((item, i) => <span className={i <= currentIndex ? "active" : ""} key={item.id}>{item.label}</span>)}</div>
      </div>
      <main className="builder-content">{content[0]}<StepGuide key={state.step} />{content.slice(1)}
        {state.step !== "review" && issues.length > 0 && <section className="step-missing" aria-label="本步待完成" role="status"><strong>还需要完成 {issues.length} 项，才能继续</strong><ul>{issues.map((m) => <li key={m.id}>{m.message}</li>)}</ul><p>在本页对应选项中补齐；有推荐按钮时也可以采用推荐。</p></section>}
      </main>
      <footer className="builder-footer">
        <button className="button secondary" disabled={!previous} onClick={() => previous && dispatch({ type: "step", step: previous })}>← 上一步</button>
        {!["playstyle", "class", "review"].includes(state.step) && <button className="button secondary checklist-link" onClick={() => dispatch({ type: "step", step: "review" })}>查看检查清单</button>}
        {next && <button className="button primary" disabled={blocked} onClick={() => dispatch({ type: "step", step: next })}>{blocked ? state.step === "review" ? "先完成必填项" : `请完成${STEP_NAMES[state.step]}选择` : nextLabel} →</button>}
      </footer>
    </div>
  );
}
