import { BuilderShell } from "../components/builder/BuilderShell";
import { FIGHTER } from "../data/classes/fighter";
import { WEAPONS } from "../data/weapons";
import type { SkillId } from "../rules/types";
import { masteryName, skillNames, zhCN } from "../translations/zh-CN";
import { useBuilder } from "../store/builder";

export function ConfigurationPage() {
  const { state, dispatch } = useBuilder();
  const toggleSkill = (skill: SkillId) => {
    const current = state.build.choices.fighterSkills;
    const next = current.includes(skill) ? current.filter((id) => id !== skill) : current.length >= 2 ? [current[1], skill] : [...current, skill];
    dispatch({ type: "fighter-skills", skills: next });
  };
  const masteryIds = Object.keys(WEAPONS);
  const toggleMastery = (id: string) => {
    const current = state.build.choices.weaponMasteries;
    const next = current.includes(id) ? current.filter((v) => v !== id) : current.length >= 3 ? [current[1], current[2], id] : [...current, id];
    dispatch({ type: "weapon-masteries", ids: next });
  };
  return (
    <BuilderShell previous="abilities" next="identity">
      <section className="page-head"><h1>完善角色配置</h1><p>新人可以直接保留推荐项；理解规则后也可以修改。</p></section>
      <details open className="choice-section"><summary><span>技能熟练</span><span>{state.build.choices.fighterSkills.length}/2</span></summary><p className="hint">推荐：察觉 + 求生。士兵背景已经提供运动和威吓。</p><div className="choice-pills">{FIGHTER.skillOptions.map((skill) => <button className={state.build.choices.fighterSkills.includes(skill) ? "selected" : ""} key={skill} onClick={() => toggleSkill(skill)}>{skillNames[skill]}</button>)}</div></details>
      <details open className="choice-section"><summary><span>战斗风格</span><span>已确认</span></summary><div className="selected-option"><strong>防御</strong><p>着装轻甲、中甲或重甲期间，AC +1。</p><span className="badge recommended">推荐 · 无额外资源管理</span></div></details>
      <details open className="choice-section"><summary><span>武器与武器精通</span><span>{state.build.choices.weaponMasteries.length}/3</span></summary><p className="hint">当前装备包 A 正好提供巨剑、连枷和标枪，因此三种都设为精通武器。</p><div className="weapon-list">{masteryIds.map((id) => { const weapon = WEAPONS[id]; return <button className={`weapon-row ${state.build.choices.weaponMasteries.includes(id) ? "selected" : ""}`} key={id} onClick={() => toggleMastery(id)}><span><strong>{zhCN.weapon[id as keyof typeof zhCN.weapon]}</strong><small>{weapon.damageDice} · {weapon.damageType}</small></span><span>{masteryName(weapon.mastery)} {state.build.choices.weaponMasteries.includes(id) ? "✓" : ""}</span></button>; })}</div></details>
      <details className="choice-section"><summary><span>起始装备</span><span>包 A</span></summary><p>链甲、巨剑、连枷、8 支标枪、地城探索者套组；士兵背景另提供其起始装备。V1 暂不支持金币自由购物方案。</p></details>
    </BuilderShell>
  );
}
