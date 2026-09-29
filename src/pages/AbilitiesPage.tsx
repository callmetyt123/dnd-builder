import { BuilderShell } from "../components/builder/BuilderShell";
import { ABILITIES, STANDARD_ARRAY } from "../data/core";
import { abilityModifier, addAbilityBoosts } from "../rules/engine/math";
import type { AbilityId } from "../rules/types";
import { abilityNames } from "../translations/zh-CN";
import { useBuilder } from "../store/builder";

import { PROFILES } from "../data/profiles";

export function AbilitiesPage() {
  const { state, dispatch } = useBuilder();
  const wizard = state.build.classId === "wizard";
  const boostOptions = PROFILES[state.build.classId].boostOptions;
  const secondaryAbility = state.build.classId === "ranger" ? "wisdom" : boostOptions.includes("constitution") ? "constitution" : "dexterity";
  const mainAbility = state.build.classId === "ranger" ? "dexterity" : state.build.classId === "warlock" ? "charisma" : wizard ? "intelligence" : state.build.classId === "druid" ? "wisdom" : "strength";
  const boosts = state.build.abilities.backgroundBoosts;
  const plusTwo = (Object.keys(boosts) as AbilityId[]).find((id) => boosts[id] === 2) ?? mainAbility;
  const plusOne = (Object.keys(boosts) as AbilityId[]).find((id) => boosts[id] === 1) ?? secondaryAbility;
  const final = addAbilityBoosts(state.build.abilities.baseAssignment, boosts);
  return (
    <BuilderShell previous="background" next="configuration">
      <section className="page-head"><h1>配置属性</h1><p>推荐配置已按所选职业优化。你可以修改，但标准数组中的每个数值只能使用一次。</p></section>
      <div className="warning-panel"><strong>如果你不理解这些数值的含义及其效果，建议不要修改。</strong><span>推荐配置可以保证当前构筑正常发挥。</span></div>
      <button className="button secondary" onClick={() => dispatch({ type: "abilities-default" })}>恢复推荐属性</button>
      <div className="ability-table">
        {ABILITIES.map((ability) => {
          const base = state.build.abilities.baseAssignment[ability];
          const boost = boosts[ability] ?? 0;
          return <div className="ability-row" key={ability}><div><strong>{abilityNames[ability]}</strong>{ability === mainAbility && <span className="tag">主要属性</span>}</div><select aria-label={`${abilityNames[ability]}基础值`} value={base} onChange={(e) => dispatch({ type: "ability-swap", ability, value: Number(e.target.value) })}>{STANDARD_ARRAY.map((value) => <option value={value} key={value}>{value}</option>)}</select><span className="boost">{boost ? `+${boost}` : "—"}</span><strong className="final-score">{final[ability]} <small>({abilityModifier(final[ability]) >= 0 ? "+" : ""}{abilityModifier(final[ability])})</small></strong></div>;
        })}
      </div>
      <section className="section"><h2>背景属性提升</h2><div className="choice-pills"><button aria-pressed={Object.values(boosts).includes(2)} onClick={() => dispatch({ type: "boosts", plusTwo: mainAbility, plusOne: secondaryAbility })}>两项 +2 / +1</button><button aria-pressed={!Object.values(boosts).includes(2)} onClick={() => dispatch({ type: "boosts-equal" })}>{boostOptions.map((id) => abilityNames[id]).join("、")}各 +1</button></div>{Object.values(boosts).includes(2) && <div className="form-grid"><label>+2<select value={plusTwo} onChange={(e) => dispatch({ type: "boosts", plusTwo: e.target.value as AbilityId, plusOne: plusOne === e.target.value ? boostOptions.find((id) => id !== e.target.value)! : plusOne })}>{boostOptions.map((id) => <option key={id} value={id}>{abilityNames[id]}</option>)}</select></label><label>+1<select value={plusOne} onChange={(e) => dispatch({ type: "boosts", plusTwo: plusTwo === e.target.value ? boostOptions.find((id) => id !== e.target.value)! : plusTwo, plusOne: e.target.value as AbilityId })}>{boostOptions.map((id) => <option key={id} value={id}>{abilityNames[id]}</option>)}</select></label></div>}</section>
    </BuilderShell>
  );
}
