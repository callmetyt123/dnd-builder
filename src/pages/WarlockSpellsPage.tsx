import { BuilderShell } from "../components/builder/BuilderShell";
import { FIEND_SPELLS, WARLOCK_CANTRIPS, WARLOCK_PREPARABLE } from "../data/warlock";
import { spell } from "../data/spells";
import { PACT_EFFECTS } from "../data/warlockSpells";
import { validateWarlock } from "../rules/validator/validateWarlock";
import { useBuilder } from "../store/builder";

export function WarlockSpellsPage() {
  const { state, dispatch } = useBuilder();
  const w = state.build.choices.warlock!;
  const errors = validateWarlock(w).filter((m) => m.targetStep === "spells");
  // 二环上限来自升级路径；取消已选项始终可用，避免数量门禁锁死修复。
  function choices(key: "cantrips" | "prepared", title: string, ids: string[], max: number) {
    const current = w[key];
    const second = w.prepared.filter((id) => spell(id)?.level === 2).length;
    return <section className="section"><h2>{title} · {current.length}/{max}</h2><div className="spell-choices">{ids.map((id) => { const s = spell(id)!; const selected = current.includes(id); return <div className={`spell-choice ${selected ? "selected" : ""}`} key={id}><label><input type="checkbox" checked={selected} disabled={!selected && (current.length >= max || (key === "prepared" && s.level === 2 && second >= 2))} onChange={() => dispatch({ type: "warlock", patch: { [key]: selected ? current.filter((v) => v !== id) : [...current, id] } })} /><span><b>{s.name}</b><small>{s.level === 0 ? "戏法" : `${s.level} 环`} · {s.time}{s.concentration ? " · 专注" : ""}</small></span></label><details><summary>法术说明</summary><p>{s.range} · {s.components} · {s.duration}</p><p>{s.text}</p>{PACT_EFFECTS[id] && <p><b>契约二环：</b>{PACT_EFFECTS[id]}</p>}</details></div>; })}</div></section>;
  }
  return <BuilderShell previous="configuration" next="identity" nextDisabled={errors.length > 0}><section className="page-head"><h1>配置契约魔法</h1><p>2 道戏法、4 道职业准备法术，另加 4 道始终准备的邪魔法术。</p></section><div className="muted-panel">两个契约法术位均为二环，短休全部恢复。职业法术仅在升级时按规则调整，长休不能任意换法术。三级最多选 2 道二环职业法术（新增一道、替换一道）。本阶段法术为精选子集。</div>

    {choices("cantrips", "职业戏法", WARLOCK_CANTRIPS, 2)}{choices("prepared", "职业准备法术", WARLOCK_PREPARABLE, 4)}
    <section className="section"><h2>邪魔宗主 · 始终准备</h2><p>{FIEND_SPELLS.map((id) => spell(id)!.name).join("、")}。不占上方名额，施展仍消耗契约法术位。</p></section>
    {w.prepared.includes("darkness") && !w.invocations.some((v) => v.id === "devils-sight") && <p className="warning-panel">普通黑暗视觉无法看穿黑暗术。你尚未选择魔鬼视界，也会受到遮蔽影响。</p>}
  </BuilderShell>;
}
