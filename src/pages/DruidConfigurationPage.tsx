import { BACKGROUNDS } from "../data/backgrounds";
import { BuilderShell } from "../components/builder/BuilderShell";
import { PROFILES } from "../data/profiles";
import { BEASTS } from "../data/beasts";
import { features } from "../data/characterDetails";
import { skillNames } from "../translations/zh-CN";
import { useBuilder } from "../store/builder";

export function DruidConfigurationPage() {
  const { state, dispatch } = useBuilder();
  const d = state.build.choices.druid!;
  const toggle = (ids: string[], id: string) => ids.includes(id) ? ids.filter((v) => v !== id) : [...ids, id];
  return <BuilderShell previous="abilities" next="spells">
    <section className="page-head"><h1>完善月亮德鲁伊配置</h1><p>背景技能已经计入。选择职业技能、原初职能与 4 种已知野兽形态。</p></section>
    <section className="section"><h2>职业技能 · {d.skills.length}/2</h2><div className="choice-pills">{PROFILES.druid.skills.map((id) => <button key={id} aria-pressed={d.skills.includes(id)} disabled={(!d.skills.includes(id) && d.skills.length >= 2)} onClick={() => dispatch({ type: "druid", patch: { skills: d.skills.includes(id) ? d.skills.filter((s) => s !== id) : [...d.skills, id] } })}>{skillNames[id]}{BACKGROUNDS[state.build.backgroundId].skills.includes(id) ? "（背景）" : ""}</button>)}</div></section>
    <section className="section"><h2>原初职能</h2><div className="class-options">{(["magician", "warden"] as const).map((order) => <button key={order} className={`class-option ${d.order === order ? "selected" : ""}`} aria-pressed={d.order === order} onClick={() => {
      // 卫士没有额外戏法；切回术师时由法术页补齐选择，避免暗中替用户选择。
      dispatch({ type: "druid", patch: { order, cantrips: d.cantrips.slice(0, order === "magician" ? 3 : 2) } });
    }}><h3>{features[order].name}</h3><p>{features[order].text}</p></button>)}</div></section>
    <section className="section"><h2>已知形态 · {d.knownForms.length}/4</h2><p>三级月亮结社：CR ≤ 1、无飞行速度。长休可替换一种已知形态；编辑器允许重配，请按实际休息进度使用。当前仅收录以下六种 MM 2025 野兽。</p><div className="beast-options">{BEASTS.map((b) => <label className={`beast-option ${d.knownForms.includes(b.id) ? "selected" : ""}`} key={b.id}><input type="checkbox" checked={d.knownForms.includes(b.id)} disabled={!d.knownForms.includes(b.id) && d.knownForms.length >= 4} onChange={() => dispatch({ type: "druid", patch: { knownForms: toggle(d.knownForms, b.id) } })} /><span><strong>{b.name}</strong><small>{b.size} · CR {b.cr === 0.25 ? "1/4" : b.cr} · 速度 {b.speed} 尺{b.climb ? ` · 攀爬 ${b.climb}` : ""}{b.burrow ? ` · 掘地 ${b.burrow}` : ""}</small><small>{b.traits[0]}</small></span></label>)}</div></section>
    <section className="muted-panel"><h3>起始装备 · 包 A</h3><p>皮甲、盾牌、镰刀、德鲁伊法器（长棍）、探索者套组、草药工具、9 GP；另加所选背景装备。原形 AC = 11 + 敏捷 + 盾牌 2。兽形默认全部装备融入，不提供装备效果。</p></section>
  </BuilderShell>;
}
