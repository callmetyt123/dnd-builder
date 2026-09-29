import { PrimalSubclassChoices } from "./PrimalSubclassChoices";
import { proficientSkills } from "../rules/origins";
import { BACKGROUNDS } from "../data/backgrounds";
import { BuilderShell } from "../components/builder/BuilderShell";
import { PROFILES } from "../data/profiles";
import { STANDARD_LANGUAGE_IDS } from "../data/core";
import { PRIMAL_FORMS, RANGER_MASTERIES, RANGER_STYLES, primalForm } from "../data/ranger";
import { damageNames, itemNames } from "../data/characterDetails";
import { WEAPONS } from "../data/weapons";
import type { RangerChoices, SkillId } from "../rules/types";
import { useBuilder } from "../store/builder";
import { masteryName, skillNames, zhCN } from "../translations/zh-CN";

export function RangerConfigurationPage() {
  const { state, dispatch } = useBuilder(); const r = state.build.choices.ranger!;
  const patch = (value: Partial<RangerChoices>) => dispatch({ type: "ranger", patch: value });
  const proficient = proficientSkills(state.build);
  const form = primalForm(r.primal.form);
  // 伙伴选择写入构筑和离线人物卡，不管理游玩中的临时状态。
  return <BuilderShell previous="abilities" next="spells"><section className="page-head"><h1>完善游侠配置</h1><p>选择技能、战斗风格与子职能力。箭术提高远程武器命中，自然法术使用感知。</p></section>
    <section className="section"><h2>职业技能 · {r.skills.length}/3</h2><div className="choice-pills">{PROFILES.ranger.skills.map((id) => <button key={id} aria-pressed={r.skills.includes(id)} disabled={(!r.skills.includes(id) && r.skills.length >= 3)} onClick={() => patch({ skills: r.skills.includes(id) ? r.skills.filter((s) => s !== id) : [...r.skills, id] })}>{skillNames[id]}{BACKGROUNDS[state.build.backgroundId].skills.includes(id) ? "（背景）" : ""}</button>)}</div><label>熟练探险家专精<select value={r.expertise} onChange={(e) => patch({ expertise: e.target.value as SkillId })}>{[...new Set([...proficient, r.expertise])].map((id) => <option key={id} value={id} disabled={!proficient.includes(id)}>{skillNames[id]}{!proficient.includes(id) ? "（已失去熟练）" : ""}</option>)}</select></label></section>
    <section className="section"><h2>熟练探险家 · 两门额外语言</h2><p>与种族页的语言分别获得；本阶段开放标准语言子集。</p><div className="form-grid">{[0,1].map((i) => <label key={i}>探险家语言 {i+1}<select value={r.extraLanguages[i] ?? ""} onChange={(e) => patch({ extraLanguages: [0,1].map((j) => i === j ? e.target.value : r.extraLanguages[j] ?? "") })}><option value="" disabled>请选择</option>{STANDARD_LANGUAGE_IDS.filter((id) => id !== "common").map((id) => <option key={id} value={id} disabled={state.build.choices.languages.includes(id) || r.extraLanguages[1-i] === id}>{zhCN.language[id]}</option>)}</select></label>)}</div></section>
    <PrimalSubclassChoices />
    <section className="section"><h2>战斗风格</h2><label>战斗风格<select value={r.style} onChange={(e) => patch({ style: e.target.value as RangerChoices["style"] })}>{Object.entries(RANGER_STYLES).map(([id,name]) => <option key={id} value={id}>{name}</option>)}</select></label><p>本阶段提供箭术（远程武器命中 +2）与防御（穿甲时 AC +1）。不含德鲁伊教战士及其他风格。</p></section>
    <section className="section"><h2>武器精通 · {state.build.choices.weaponMasteries.length}/2</h2><div className="choice-pills">{RANGER_MASTERIES.map((id) => { const selected = state.build.choices.weaponMasteries.includes(id); return <button key={id} aria-pressed={selected} disabled={!selected && state.build.choices.weaponMasteries.length >= 2} onClick={() => dispatch({ type: "weapon-masteries", ids: selected ? state.build.choices.weaponMasteries.filter((v) => v !== id) : [...state.build.choices.weaponMasteries, id] })}>{itemNames[id]} · {masteryName(WEAPONS[id].mastery)}</button>; })}</div></section>
    {state.build.subclassId === "beast-master" && <section className="section"><h2>初始原初行侣</h2><p>选择开卡时的伙伴形态和外形；游玩中的替换与恢复规则见完整人物卡。</p><div className="form-grid"><label>初始伙伴类型<select value={r.primal.form} onChange={(e) => { const f = primalForm(e.target.value)!; patch({ primal: { ...r.primal, form: f.id, damage: f.damageTypes[0] } }); }}>{PRIMAL_FORMS.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select></label><label>初始伤害类型<select value={r.primal.damage} onChange={(e) => patch({ primal: { ...r.primal, damage: e.target.value as RangerChoices["primal"]["damage"] } })}>{form?.damageTypes.map((id) => <option key={id} value={id}>{damageNames[id]}</option>)}</select></label><label>初始伙伴外形<input maxLength={40} value={r.primal.appearance} onChange={(e) => patch({ primal: { ...r.primal, appearance: e.target.value } })} /></label></div><p>{form?.size} · HP {form?.hp} · {form?.speed}。外形不额外授予普通野兽能力。</p></section>}
  </BuilderShell>;
}
