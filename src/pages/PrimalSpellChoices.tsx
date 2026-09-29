import { useState } from "react";
import type { CharacterBuild } from "../rules/types";
import { primalSpell } from "../rules/primalSubclasses";

// 搜索保留已选项，满额仍允许取消；职业与自动来源由调用者分别传入。
export function PrimalSpellChoices({ build, title, ids, selected, max, set, secondLimit }: { build: CharacterBuild; title: string; ids: string[]; selected: string[]; max: number; set: (ids: string[]) => void; secondLimit?: number }) {
  const [query, setQuery] = useState("");
  const second = selected.filter((id) => primalSpell(build, id)?.level === 2).length;
  return <section className="section"><h2>{title} · {selected.length}/{max}</h2><label>搜索{title}<input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="中文名、英文名或学派；已选项保留" /></label><div className="spell-choices">{ids.filter((id) => { const s = primalSpell(build, id)!; return selected.includes(id) || `${id} ${s.name} ${s.school}`.toLowerCase().includes(query.trim().toLowerCase()); }).map((id) => { const s = primalSpell(build, id)!, checked = selected.includes(id); return <div className={`spell-choice ${checked ? "selected" : ""}`} key={id}><label><input type="checkbox" checked={checked} disabled={!checked && (selected.length >= max || (s.level === 2 && secondLimit !== undefined && second >= secondLimit))} onChange={() => set(checked ? selected.filter((v) => v !== id) : [...selected, id])} /><span><b>{s.name}</b><small>{s.level === 0 ? "戏法" : `${s.level} 环`} · {s.school} · {s.time}{s.concentration ? " · 专注" : ""}</small></span></label><details><summary>法术说明</summary><p>{s.range} · {s.components} · {s.duration}{s.ritual ? " · 可仪式" : ""}</p><p>{s.text}</p></details></div>; })}</div></section>;
}
