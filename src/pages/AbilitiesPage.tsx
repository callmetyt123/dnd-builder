import { BuilderShell } from "../components/builder/BuilderShell";
import { ABILITIES, STANDARD_ARRAY } from "../data/core";
import { abilityModifier, addAbilityBoosts } from "../rules/engine/math";
import type { AbilityId } from "../rules/types";
import { abilityNames } from "../translations/zh-CN";
import { useBuilder } from "../store/builder";

import { BACKGROUNDS } from "../data/backgrounds";
import { ABILITY_PRIORITY } from "../rules/origins";

export function AbilitiesPage() {
  const { state, dispatch } = useBuilder();
  const boostOptions = BACKGROUNDS[state.build.backgroundId].abilities;
  const [recommendedTwo, recommendedOne] = ABILITY_PRIORITY[state.build.classId].filter((id) => boostOptions.includes(id));
  const mainAbility = ABILITY_PRIORITY[state.build.classId][0];
  const boosts = state.build.abilities.backgroundBoosts;
  const plusTwo = (Object.keys(boosts) as AbilityId[]).find((id) => boosts[id] === 2) ?? recommendedTwo;
  const plusOne = (Object.keys(boosts) as AbilityId[]).find((id) => boosts[id] === 1) ?? recommendedOne;
  const final = addAbilityBoosts(state.build.abilities.baseAssignment, boosts);
  return (
    <BuilderShell previous="background" next="configuration">
      <section className="page-head"><h1>配置属性</h1><p>属性决定角色擅长什么。初始配置已有推荐；如果自行调整，选取一个数值会与原来持有该数值的属性交换。</p></section>
      <div className="warning-panel"><strong>怎么看这一行？基础值 + 背景提升 = 最终属性。</strong><span>括号内是掷骰时常用的加值。例如 +3 表示掷 d20 后加 3；背景只能提升列出的三项属性。</span></div>
      <div className="ability-table">
        {ABILITIES.map((ability) => {
          const base = state.build.abilities.baseAssignment[ability];
          const boost = boosts[ability] ?? 0;
          return <div className="ability-row" key={ability}><div><strong>{abilityNames[ability]}</strong>{ability === mainAbility && <span className="tag">主要属性</span>}</div><select aria-label={`${abilityNames[ability]}基础值`} value={base} onChange={(e) => dispatch({ type: "ability-swap", ability, value: Number(e.target.value) })}>{STANDARD_ARRAY.map((value) => <option value={value} key={value}>{value}</option>)}</select><span className="boost">{boost ? `+${boost}` : "—"}</span><strong className="final-score">{final[ability]} <small>({abilityModifier(final[ability]) >= 0 ? "+" : ""}{abilityModifier(final[ability])})</small></strong></div>;
        })}
      </div>
      <section className="section"><h2>背景属性提升</h2><div className="choice-pills"><button aria-pressed={Object.values(boosts).includes(2)} onClick={() => dispatch({ type: "boosts", plusTwo: recommendedTwo, plusOne: recommendedOne })}>两项 +2 / +1</button><button aria-pressed={!Object.values(boosts).includes(2)} onClick={() => dispatch({ type: "boosts-equal" })}>{boostOptions.map((id) => abilityNames[id]).join("、")}各 +1</button></div>{Object.values(boosts).includes(2) && <div className="form-grid"><label>+2<select value={plusTwo} onChange={(e) => dispatch({ type: "boosts", plusTwo: e.target.value as AbilityId, plusOne: plusOne === e.target.value ? boostOptions.find((id) => id !== e.target.value)! : plusOne })}>{boostOptions.map((id) => <option key={id} value={id}>{abilityNames[id]}</option>)}</select></label><label>+1<select value={plusOne} onChange={(e) => dispatch({ type: "boosts", plusTwo: plusTwo === e.target.value ? boostOptions.find((id) => id !== e.target.value)! : plusTwo, plusOne: e.target.value as AbilityId })}>{boostOptions.map((id) => <option key={id} value={id}>{abilityNames[id]}</option>)}</select></label></div>}</section>
    </BuilderShell>
  );
}
