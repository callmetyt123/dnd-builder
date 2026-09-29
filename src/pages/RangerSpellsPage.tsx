import { BuilderShell } from "../components/builder/BuilderShell";
import { RANGER_PREPARABLE } from "../data/ranger";
import { spell } from "../data/spells";
import { defaultBuild } from "../rules/defaultBuild";
import { validateRanger } from "../rules/validator/validateRanger";
import { useBuilder } from "../store/builder";

export function RangerSpellsPage() {
  const { state, dispatch } = useBuilder(); const r = state.build.choices.ranger!;
  const errors = validateRanger(state.build).filter((m) => m.targetStep === "spells");
  // 准备列表是最终构筑；冒险中的替换频率在提示中限制，不把编辑器当长休操作。
  return <BuilderShell previous="configuration" next="identity" nextDisabled={errors.length > 0}><section className="page-head"><h1>准备游侠法术</h1><p>4 道职业法术 + 始终准备的猎人印记。三级有 3 个一环法术位，没有二环位或职业戏法。</p></section><p className="muted-panel">长休恢复法术位，每次长休只能替换一道准备法术。以下为已核对的精选子集；编辑构筑不代表已完成长休。</p><button className="button secondary" onClick={() => dispatch({ type: "ranger", patch: { prepared: defaultBuild("ranger").choices.ranger!.prepared } })}>恢复推荐游侠法术</button>{errors.map((m) => <p key={m.id} className="validation blocker">{m.message}</p>)}
    <section className="section"><h2>职业准备 · {r.prepared.length}/4</h2><div className="spell-choices">{RANGER_PREPARABLE.map((id) => { const s = spell(id)!; const selected = r.prepared.includes(id); return <div className={`spell-choice ${selected ? "selected" : ""}`} key={id}><label><input type="checkbox" checked={selected} disabled={!selected && r.prepared.length >= 4} onChange={() => dispatch({ type: "ranger", patch: { prepared: selected ? r.prepared.filter((v) => v !== id) : [...r.prepared,id] } })} /><span><b>{s.name}</b><small>{s.time}{s.concentration ? " · 专注" : ""}{s.ritual ? " · 仪式" : ""}</small></span></label><details><summary>法术说明</summary><p>{s.range} · {s.components} · {s.duration}</p><p>{id === "cure-wounds" ? "触碰一名生物，恢复 2d8 + 感知调整值 HP。游侠没有医疗师的治疗骰重掷。" : s.text}</p></details></div>; })}</div></section><section className="section"><h2>宿敌 · 猎人印记</h2><p>{spell("hunters-mark")!.text}</p><p>每长休两次免费施展，仍需附赠动作与专注；也可用法术位施展。指挥伙伴、施展或转移印记会争用同一个附赠动作。</p></section></BuilderShell>;
}
