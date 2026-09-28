import type { ReactNode } from "react";

export function Card({ children, selected = false, recommended = false, onClick }: { children: ReactNode; selected?: boolean; recommended?: boolean; onClick?: () => void }) {
  return (
    <div className={`card ${selected ? "selected" : ""} ${onClick ? "clickable" : ""}`} onClick={onClick}>
      {recommended && <div className="badge recommended">★ 适合第一次游玩</div>}
      {children}
    </div>
  );
}
