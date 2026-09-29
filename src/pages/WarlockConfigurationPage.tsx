import { automaticMagic } from "../data/primalSubclasses";
import { PrimalSubclassChoices } from "./PrimalSubclassChoices";
import { BuilderShell } from "../components/builder/BuilderShell";
import { defaultBuild } from "../rules/defaultBuild";
import { PROFILES } from "../data/profiles";
import { INVOCATIONS, eligibleTarget, invocation } from "../data/warlock";
import { spell } from "../data/spells";
import { skillNames } from "../translations/zh-CN";
import { useBuilder } from "../store/builder";

export function WarlockConfigurationPage() {
  const { state, dispatch } = useBuilder();
  const w = state.build.choices.warlock!;
  const known = [...w.cantrips, ...automaticMagic(state.build).cantrips];
  // 保留失效的戏法绑定供用户修正，不因切换戏法静默替换构筑。
  const replace = (index: number, id: string, target?: string) => dispatch({ type: "warlock", patch: { invocations: w.invocations.map((v, i) => i === index ? { id, ...(target ? { target } : {}) } : v) } });
  return <BuilderShell previous="abilities" next="spells"><section className="page-head"><h1>选择魔能祈唤</h1><p>三级选择 3 项祈唤；本阶段收录 10 种，不含刃之契约、链之契约与书之契约。</p></section>
    <section className="section"><h2>职业技能 · {w.skills.length}/2</h2><div className="choice-pills">{PROFILES.warlock.skills.map((id) => <button key={id} aria-pressed={w.skills.includes(id)} disabled={!w.skills.includes(id) && w.skills.length >= 2} onClick={() => dispatch({ type: "warlock", patch: { skills: w.skills.includes(id) ? w.skills.filter((s) => s !== id) : [...w.skills, id] } })}>{skillNames[id]}</button>)}</div></section>
    <PrimalSubclassChoices />
    <button className="button secondary" onClick={() => dispatch({ type: "warlock", patch: { cantrips: defaultBuild("warlock").choices.warlock!.cantrips, invocations: defaultBuild("warlock").choices.warlock!.invocations } })}>恢复推荐祈唤与绑定戏法</button>
    {w.invocations.map((v, i) => { const option = invocation(v.id); const targets = known.filter((id) => eligibleTarget(v.id, id, known)); return <section className="section" key={i}><div className="form-grid"><label>祈唤 {i + 1}<select value={v.id} onChange={(e) => { const id = e.target.value; replace(i, id, known.find((s) => eligibleTarget(id, s, known))); }}>{INVOCATIONS.map((o) => <option key={o.id} value={o.id}>{o.name} · {o.minLevel} 级起</option>)}</select></label>{option?.target && <label>绑定戏法 {i + 1}<select value={v.target ?? ""} onChange={(e) => replace(i, v.id, e.target.value)}>{!targets.includes(v.target ?? "") && <option value={v.target ?? ""}>请选择符合条件的已知戏法</option>}{targets.map((id) => <option key={id} value={id}>{spell(id)?.name}</option>)}</select></label>}</div><p>{option?.text}</p></section>; })}
    <p className="muted-panel">下一页可调整戏法；绑定失效后需回到此页修正。起始装备：皮甲、镰刀、2 把匕首、奥术宝珠、神秘学书籍、学者套组与 15 GP；再合并所选背景装备。</p>
  </BuilderShell>;
}
