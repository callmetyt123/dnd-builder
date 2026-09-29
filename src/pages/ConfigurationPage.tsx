import { proficientSkills } from "../rules/origins";
import { BACKGROUNDS } from "../data/backgrounds";
import { RangerConfigurationPage } from "./RangerConfigurationPage";
import { WarlockConfigurationPage } from "./WarlockConfigurationPage";
import { DruidConfigurationPage } from "./DruidConfigurationPage";
import { BuilderShell } from "../components/builder/BuilderShell";
import { damageNames } from "../data/characterDetails";
import { FIGHTER } from "../data/classes/fighter";
import { PROFILES, SCHOLAR_SKILLS } from "../data/profiles";
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
  const masteryIds = ["greatsword", "flail", "javelin", "spear", "shortbow"];
  const toggleMastery = (id: string) => {
    const current = state.build.choices.weaponMasteries;
    const next = current.includes(id) ? current.filter((v) => v !== id) : current.length >= 3 ? [current[1], current[2], id] : [...current, id];
    dispatch({ type: "weapon-masteries", ids: next });
  };
  if (state.build.classId === "ranger") return <RangerConfigurationPage />;
  if (state.build.classId === "warlock") return <WarlockConfigurationPage />;
  if (state.build.classId === "druid") return <DruidConfigurationPage />;
  if (state.build.classId === "wizard") {
    const w = state.build.choices.wizard!;
    const proficient = proficientSkills(state.build);
    return <BuilderShell previous="abilities" next="spells"><section className="page-head"><h1>完善法师配置</h1><p>背景技能已自动计入；再选择 2 项职业技能和 1 项学者专精。</p></section>
      <section className="section"><h2>职业技能 · {w.skills.length}/2</h2><div className="choice-pills">{PROFILES.wizard.skills.map((skill) => <button key={skill} aria-pressed={w.skills.includes(skill)} disabled={(!w.skills.includes(skill) && w.skills.length >= 2)} onClick={() => dispatch({ type: "wizard", patch: { skills: w.skills.includes(skill) ? w.skills.filter((id) => id !== skill) : [...w.skills, skill] } })}>{skillNames[skill]}{BACKGROUNDS[state.build.backgroundId].skills.includes(skill) ? "（背景）" : ""}</button>)}</div></section>
      <section className="section"><h2>学者专精</h2><p>所选技能熟练加值翻倍。推荐奥秘，适合研究魔法。</p><label>专精技能<select value={w.scholar} onChange={(e) => dispatch({ type: "wizard", patch: { scholar: e.target.value as SkillId } })}>{SCHOLAR_SKILLS.map((id) => <option value={id} key={id} disabled={!proficient.includes(id)}>{skillNames[id]}{!proficient.includes(id) ? "（尚未熟练）" : ""}</option>)}</select></label></section>
      <section className="section"><h2>起始装备 · 包 A</h2><p>2 把匕首、奥术法器（长棍）、长袍、法术书、学者套组与 5 GP；另加所选背景装备。未穿护甲，基础 AC 为 10 + 敏捷调整值。</p></section>
    </BuilderShell>;
  }
  return (
    <BuilderShell previous="abilities" next="identity">
      <section className="page-head"><h1>完善角色配置</h1><p>新人可以直接保留推荐项；理解规则后也可以修改。</p></section>
      <details open className="choice-section"><summary><span>技能熟练</span><span>{state.build.choices.fighterSkills.length}/2</span></summary><p className="hint">推荐：察觉 + 求生。背景熟练已计入，重复选择不会叠加。</p><div className="choice-pills">{FIGHTER.skillOptions.map((skill) => <button aria-pressed={state.build.choices.fighterSkills.includes(skill)} className={state.build.choices.fighterSkills.includes(skill) ? "selected" : ""} key={skill} onClick={() => toggleSkill(skill)}>{skillNames[skill]}</button>)}</div></details>
      <details open className="choice-section"><summary><span>战斗风格</span><span>已确认</span></summary><div className="selected-option"><strong>防御</strong><p>着装轻甲、中甲或重甲期间，AC +1。</p><span className="badge recommended">推荐 · 无额外资源管理</span></div></details>
      <details open className="choice-section"><summary><span>武器与武器精通</span><span>{state.build.choices.weaponMasteries.length}/3</span></summary><p className="hint">推荐巨剑、连枷和标枪。也可替换为矛或短弓；是否携带取决于所选背景；共选 3 种。</p><div className="weapon-list">{masteryIds.map((id) => { const weapon = WEAPONS[id]; return <button aria-pressed={state.build.choices.weaponMasteries.includes(id)} className={`weapon-row ${state.build.choices.weaponMasteries.includes(id) ? "selected" : ""}`} key={id} onClick={() => toggleMastery(id)}><span><strong>{zhCN.weapon[id as keyof typeof zhCN.weapon]}</strong><small>{weapon.damageDice} · {damageNames[weapon.damageType]}</small></span><span>{masteryName(weapon.mastery)} {state.build.choices.weaponMasteries.includes(id) ? "✓" : ""}</span></button>; })}</div></details>
      <details className="choice-section"><summary><span>起始装备</span><span>包 A</span></summary><p>链甲、巨剑、连枷、8 支标枪、地城探索者套组、4 GP；所选背景另提供其起始装备。V1 暂不支持金币自由购物方案。</p></details>
    </BuilderShell>
  );
}
