import { BuilderShell } from "../components/builder/BuilderShell";
import { useBuilder } from "../store/builder";
import { defaultFighterChoices, wizardSpell } from "../rules/expandedSubclasses";
import { SPELL_LIST } from "../data/spells";

// 奥法骑士与法师共用目录，但独立记录准备名额，不授予法术书或学派限制。
export function KnightSpellsPage() {
  const { state, dispatch } = useBuilder(), f = state.build.choices.fighter ?? defaultFighterChoices();
  return <BuilderShell previous="configuration" next="identity"><section className="page-head"><h1>选择奥法骑士法术</h1><p>智力施法；两道戏法、三道一环准备法术、两个一环法术位，长休恢复法术位。</p></section><p className="muted-panel">5R 不限制学派；准备法术只能在升级时替换一道，长休不能重选。三级还不能在攻击动作中穿插戏法；动作如潮不能用于魔法动作。</p>{(["cantrips", "prepared"] as const).map((field) => <section className="section" key={field}><h2>{field === "cantrips" ? "法师戏法 · 两道" : "一环准备法术 · 三道"}</h2><div className="form-stack">{Array.from({ length: field === "cantrips" ? 2 : 3 }, (_, i) => <label key={i}>{field === "cantrips" ? "戏法" : "准备法术"} {i + 1}<select value={f[field][i] ?? ""} onChange={(e) => { const ids = [...f[field]]; ids[i] = e.target.value; dispatch({ type: "fighter", patch: { [field]: ids } }); }}><option value="" disabled>请选择</option>{SPELL_LIST.filter((s) => s.level === (field === "cantrips" ? 0 : 1)).map((s) => <option value={s.id} key={s.id} disabled={f[field].some((id, n) => n !== i && id === s.id)}>{s.name} · {s.school}</option>)}</select></label>)}</div></section>)}<section className="section"><h2>已选法术速读</h2><div className="spell-card-grid">{[...f.cantrips, ...f.prepared].map((id) => { const s = wizardSpell(state.build, id); return s && <section className="spell-card" key={id}><h3>{s.name}</h3><p>{s.time} · {s.range}<br />{s.components} · {s.concentration ? "专注 · " : ""}{s.duration}{s.ritual ? " · 可仪式" : ""}</p><p>{s.text}</p></section>; })}</div></section><p className="muted-panel">起始包没有施法法器。材料法术需备实物，或用奥术法器代替无标价且不消耗的材料；姿势需要空手，双手武器可暂松开一只手施法。专注只能维持一个；已准备的仪式法术可额外花十分钟不耗法术位施展。</p></BuilderShell>;
}
