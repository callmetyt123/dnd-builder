import type { ReactNode } from "react";

// 玩法选择用原生按钮，键盘与读屏可识别选中状态。
export function Card({ children, selected = false, recommended = false, onClick }: { children: ReactNode; selected?: boolean; recommended?: boolean; onClick?: () => void }) {
  return (
    <button type="button" aria-pressed={selected} className={`card ${selected ? "selected" : ""} ${onClick ? "clickable" : ""}`} onClick={onClick}>
      {recommended && <div className="badge recommended">★ 适合第一次游玩</div>}
      {children}
    </button>
  );
}
