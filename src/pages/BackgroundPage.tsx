import { BuilderShell } from "../components/builder/BuilderShell";
import { BACKGROUNDS, RECOMMENDED_BACKGROUND } from "../data/backgrounds";
import { GAMING_SETS, features, itemNames } from "../data/characterDetails";
import { FeatChoices } from "../components/origin/FeatChoices";
import { ARTISAN_TOOLS, INSTRUMENTS } from "../data/originOptions";
import { ABILITY_PRIORITY, classSkills, backgroundTool, recommendedFeatChoices } from "../rules/origins";
import { validateBuild } from "../rules/validator/validateBuild";
import type { BackgroundId, OriginFeat } from "../rules/types";
import { abilityNames, skillNames } from "../translations/zh-CN";
import { useBuilder } from "../store/builder";

export function BackgroundPage() {
  const { state, dispatch } = useBuilder();
  const build = state.build;
  const background = BACKGROUNDS[build.backgroundId];
  const recommended = RECOMMENDED_BACKGROUND[build.classId];
  const origin = build.choices.origin;
  const duplicate = classSkills(build).filter((id) => background.skills.includes(id));
  const errors = validateBuild(build).messages.filter((m) => m.severity === "blocker" && (m.targetStep === "background" || m.id === "scholar" || m.id === "ranger-expertise"));
  return <BuilderShell previous="species" next="abilities" nextDisabled={errors.some((m) => m.targetStep === "background")}>
    <section className="page-head"><h1>你的角色以前过着怎样的生活？</h1><p>背景描述过去的经历，也提供属性提升、两项技能、工具和起源专长。所有已开放背景都可用于当前职业。</p></section>
    <div className="background-grid">{(Object.keys(BACKGROUNDS) as BackgroundId[]).sort((a, b) => Number(b === recommended) - Number(a === recommended)).map((id) => {
      const option = BACKGROUNDS[id];
      return <button type="button" className={`card clickable ${build.backgroundId === id ? "selected" : ""}`} key={id} aria-pressed={build.backgroundId === id} onClick={() => dispatch({ type: "background", id })}>
        <h3>{option.name}{id === recommended && <span className="badge recommended">推荐</span>}</h3><p>{option.description}</p>
        <div className="facts"><span>可提升：{option.abilities.map((a) => abilityNames[a]).join(" / ")}</span><span>技能：{option.skills.map((s) => skillNames[s]).join(" / ")}</span><span>专长：{features[option.feat].name}</span></div>
      </button>;
    })}</div>
    <p className="hint">更换背景会把背景加值调整为当前组合的推荐值，保留基础属性、职业技能与法术。之后仍可自行修改属性加值。</p>
    {!background.abilities.includes(ABILITY_PRIORITY[build.classId][0]) && <p className="validation warning">这个背景不能提升当前职业的主要属性，可能降低命中或法术效果；仍可继续车卡。</p>}
    <section className="section" aria-label="当前背景能力"><h2>{background.name} · 你会获得什么</h2><p>起源专长：{features[background.feat].name}，选择与用法见下方。</p><p>工具熟练：{itemNames[backgroundTool(build)]}</p>
      {build.backgroundId === "hermit" && <p className="hint">此装备包没有医疗包。战地医师需要另行获得医疗包；草药工具不能替代。{build.classId === "druid" && "草药工具熟练与职业重复，不叠加。"}</p>}
      <details><summary>查看背景起始装备 · 包 A</summary><p>{background.equipment.map((item) => `${itemNames[item.id] ?? (item.id === "gaming-set" ? itemNames[origin.gamingSet] : ["artisan-tool", "instrument"].includes(item.id) ? itemNames[backgroundTool(build)] : item.id)} × ${item.quantity}`).join("、")}</p></details>
    </section>
    {background.equipment.some((item) => item.id === "gaming-set") && <section className="section"><h2>选择游戏套装</h2><p>{background.tool === "gaming-set" ? "同时获得工具熟练与一套实物。" : "仅获得赌具实物；背景提供的工具熟练是盗贼工具。"}</p><label>游戏套装<select value={origin.gamingSet} onChange={(e) => dispatch({ type: "origin", patch: { gamingSet: e.target.value } })}>{Object.entries(GAMING_SETS).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label></section>}
    {(duplicate.length > 0 || errors.some((m) => m.targetStep === "configuration")) && <section className="warning-panel" role="status"><strong>有技能选择需要留意</strong>{duplicate.length > 0 && <p>{duplicate.map((id) => skillNames[id]).join("、")}由职业与背景重复提供，熟练不叠加。可保留，或把重复的职业技能换为本职业其他技能。</p>}{errors.filter((m) => m.targetStep === "configuration").map((m) => <p key={m.id}>{m.message}</p>)}<button className="button secondary" onClick={() => dispatch({ type: "skills-recommend" })}>调整重复技能与失效专精</button></section>}
    {(["artisan-tool", "instrument"].includes(background.tool)) && <label>背景工具<select value={background.tool === "artisan-tool" ? origin.artisanTool : origin.instrument} onChange={(e) => dispatch({ type: "origin", patch: background.tool === "artisan-tool" ? { artisanTool: e.target.value } : { instrument: e.target.value } })}>{Object.entries(background.tool === "artisan-tool" ? ARTISAN_TOOLS : INSTRUMENTS).map(([id, name]) => <option value={id} key={id}>{name}</option>)}</select></label>}
    <FeatChoices feat={background.feat as OriginFeat} value={origin} recommended={recommendedFeatChoices(build, "background")} fixedList={background.magicList} classId={build.classId} onChange={(patch) => dispatch({ type: "origin", patch })} />
    <p className="hint">已开放全部 16 个 2024 背景与 10 种起源专长；起始装备使用各背景包 A。</p>
  </BuilderShell>;
}
