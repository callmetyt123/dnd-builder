import type { ReactNode } from "react";
import { useBuilder, type BuilderStep } from "../../store/builder";

const FLOW: { id: BuilderStep; label: string }[] = [
  { id: "playstyle", label: "玩法" },
  { id: "class", label: "职业" },
  { id: "species", label: "种族" },
  { id: "background", label: "背景" },
  { id: "abilities", label: "属性" },
  { id: "configuration", label: "配置" },
  { id: "identity", label: "身份" },
  { id: "review", label: "检查" },
];

export function BuilderShell({ children, previous, next, nextLabel = "下一步", nextDisabled = false }: { children: ReactNode; previous?: BuilderStep; next?: BuilderStep; nextLabel?: string; nextDisabled?: boolean }) {
  const { state, dispatch } = useBuilder();
  const currentIndex = FLOW.findIndex((item) => item.id === state.step);
  return (
    <div className="app-shell">
      <header className="site-header">
        <div>
          <strong>D&D 5R</strong>
          <span>角色创建器</span>
        </div>
        <span className="saved-indicator">草稿自动保存</span>
      </header>
      <div className="progress-wrap">
        <div className="progress-mobile">步骤 {currentIndex + 1} / {FLOW.length} · {FLOW[currentIndex]?.label}</div>
        <div className="progress-bar"><span style={{ width: `${((currentIndex + 1) / FLOW.length) * 100}%` }} /></div>
        <div className="progress-desktop">{FLOW.map((item, i) => <span className={i <= currentIndex ? "active" : ""} key={item.id}>{item.label}</span>)}</div>
      </div>
      <main className="builder-content">{children}</main>
      <footer className="builder-footer">
        <button className="button secondary" disabled={!previous} onClick={() => previous && dispatch({ type: "step", step: previous })}>← 上一步</button>
        {next && <button className="button primary" disabled={nextDisabled} onClick={() => dispatch({ type: "step", step: next })}>{nextLabel} →</button>}
      </footer>
    </div>
  );
}
