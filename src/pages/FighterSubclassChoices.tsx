import { useBuilder } from "../store/builder";
import { defaultFighterChoices } from "../rules/expandedSubclasses";
import { MANEUVERS } from "../data/expandedSubclasses";
import { ARTISAN_TOOLS } from "../data/originOptions";
import { PROFILES } from "../data/profiles";
import { skillNames } from "../translations/zh-CN";
import { itemNames } from "../data/characterDetails";
import type { SkillId } from "../rules/types";

export function FighterSubclassChoices() {
  const { state, dispatch } = useBuilder(), b = state.build, f = b.choices.fighter ?? defaultFighterChoices();
  if (b.subclassId === "battle-master") return <section className="section"><h2>战斗大师 · 三项战技</h2><p>推荐精准攻击、摔绊攻击和格挡；四枚 d8 卓越骰共用，短休或长休全部恢复。每次攻击只能应用一种战技。</p><div className="form-stack">{[0, 1, 2].map((i) => <label key={i}>战技 {i + 1}<select value={f.maneuvers[i] ?? ""} onChange={(e) => { const maneuvers = [...f.maneuvers]; maneuvers[i] = e.target.value; dispatch({ type: "fighter", patch: { maneuvers } }); }}><option disabled value="">请选择</option>{Object.entries(MANEUVERS).map(([id, m]) => <option value={id} key={id} disabled={f.maneuvers.some((v, n) => n !== i && v === id)}>{m.name} · {m.timing}</option>)}</select>{f.maneuvers[i] && <small>{MANEUVERS[f.maneuvers[i]]?.text}</small>}</label>)}<h3>战争学者 · 额外熟练</h3><label>额外技能<select value={f.studentSkill} onChange={(e) => dispatch({ type: "fighter", patch: { studentSkill: e.target.value as SkillId } })}>{PROFILES.fighter.skills.map((id) => <option key={id} value={id}>{skillNames[id]}{b.choices.fighterSkills.includes(id) ? "（职业已选）" : ""}</option>)}</select></label><label>工匠工具<select value={f.artisanTool} onChange={(e) => dispatch({ type: "fighter", patch: { artisanTool: e.target.value } })}>{Object.entries(ARTISAN_TOOLS).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label><p className="hint">获得工具熟练不等于获得工具实物。</p></div></section>;
  if (b.subclassId === "eldritch-knight") return <section className="section"><h2>战争联结 · 出发准备</h2><p>可选择起始包中的至多两把武器，完成一小时仪式后生效；也可留空。未失能时不会被缴械，同位面可用附赠动作召回一把。</p><div className="choice-pills">{["greatsword", "flail", "javelin"].map((id) => <button key={id} aria-pressed={f.bondedWeapons.includes(id)} disabled={!f.bondedWeapons.includes(id) && f.bondedWeapons.length >= 2} onClick={() => dispatch({ type: "fighter", patch: { bondedWeapons: f.bondedWeapons.includes(id) ? f.bondedWeapons.filter((v) => v !== id) : [...f.bondedWeapons, id] } })}>{itemNames[id]}</button>)}</div><p className="hint">标枪为其中一支；联结武器不会自动成为法器。下一步选择法术。</p></section>;
  if (b.subclassId === "psi-warrior") return <section className="section"><h2>灵能武士 · 四枚 d6</h2><p>短休恢复一枚，长休全部恢复。庇护力场用反应减伤；灵能打击在武器命中后加伤；念力控物移动同伴或物件。它们的完整条件会列入人物卡。</p><p className="hint">智力影响减伤和追加伤害，属性页的推荐配置会兼顾智力。</p></section>;
  return null;
}
