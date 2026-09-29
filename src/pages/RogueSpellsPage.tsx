import { rogueSpellText } from "../data/rogue";
import { BuilderShell } from "../components/builder/BuilderShell";
import { useBuilder } from "../store/builder";
import { magicOptions } from "../rules/origins";
import { validateRogue } from "../rules/validator/validateRogue";
import { spell } from "../data/spells";

// 与魔法学徒共享法师目录，名额与法术位保持职业来源独立。
export function RogueSpellsPage() {
  const { state, dispatch } = useBuilder(), r = state.build.choices.rogue!;
  const issues = validateRogue(state.build).filter((m) => m.targetStep === "spells");
  const list = magicOptions("wizard");
  return <BuilderShell previous="configuration" next="identity" nextDisabled={issues.some((m) => m.severity === "blocker")}>
    <section className="page-head"><h1>选择诡术师法术</h1><p>智力施法；法师之手自动习得，另选两道戏法与三道一环法术。拥有两个一环法术位，长休恢复。</p></section>
    <div className="muted-panel"><strong>新人推荐</strong><p>心灵之楔削弱目标下一次豁免，次级幻象辅助探索；魅惑类人、易容术与云雾术提供社交和潜行手段。法术不能替代偷袭所需的武器攻击。</p><button className="button secondary" onClick={() => dispatch({ type: "rogue", patch: { cantrips: ["mind-sliver", "minor-illusion"], prepared: ["charm-person", "disguise-self", "fog-cloud"] } })}>恢复推荐法术</button></div>
    <p className="hint">5R 不限制学派。准备法术只能在升级时替换一道，长休不重选；这里只编辑初始三级构筑。</p>
    {(["cantrips", "prepared"] as const).map((field) => <section className="section" key={field}><h2>{field === "cantrips" ? "额外戏法（法师之手不占以下两格）" : "一环准备法术"}</h2><div className="form-stack">{Array.from({ length: field === "cantrips" ? 2 : 3 }, (_, i) => <label key={i}>{field === "cantrips" ? "戏法" : "准备法术"} {i + 1}<select value={r[field][i] ?? ""} onChange={(e) => { const next = [...r[field]]; next[i] = e.target.value; dispatch({ type: "rogue", patch: { [field]: next } }); }}><option value="" disabled>请选择</option>{list.filter((s) => s.level === (field === "cantrips" ? 0 : 1) && (field !== "cantrips" || s.id !== "mage-hand")).map((s) => <option key={s.id} value={s.id} disabled={r[field].some((id, j) => j !== i && id === s.id)}>{s.name} · {s.school}{s.concentration ? " · 专注" : ""}</option>)}</select></label>)}</div></section>)}
    <section className="section"><h2>已选法术速读</h2><div className="spell-card-grid">{["mage-hand", ...r.cantrips, ...r.prepared].map((id) => { const s = spell(id); return s && <section className="spell-card" key={id}><h3>{s.name}</h3><p>{id === "mage-hand" ? "附赠动作施展或控制，可令手隐形并作敏捷（巧手）检定。" : s.time} · {s.range}</p><p>{s.components} · {s.concentration ? "专注 · " : ""}{s.duration}{s.ritual ? " · 可仪式（额外 10 分钟）" : ""}</p><p>{rogueSpellText(s)}</p></section>; })}</div></section>
    <p className="muted-panel">材料 M：可用奥术法器替代未标价且不消耗的材料；标价或消耗的材料仍需实物。起始包不赠送法器。言语需要能出声，姿势需要空手；专注同一时间只能维持一个法术。</p>
    {issues.map((m) => <p className={`validation ${m.severity}`} key={m.id}>{m.message}</p>)}
  </BuilderShell>;
}
