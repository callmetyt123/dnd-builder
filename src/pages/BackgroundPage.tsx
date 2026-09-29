import { BuilderShell } from "../components/builder/BuilderShell";
import { BACKGROUNDS, BACKGROUND_REASON, RECOMMENDED_BACKGROUND } from "../data/backgrounds";
import { GAMING_SETS, features, itemNames } from "../data/characterDetails";
import { SPELL_LIST } from "../data/spells";
import { ABILITY_PRIORITY, classSkills } from "../rules/origins";
import { validateBuild } from "../rules/validator/validateBuild";
import type { BackgroundId, MagicInitiateChoices } from "../rules/types";
import { abilityNames, skillNames } from "../translations/zh-CN";
import { useBuilder } from "../store/builder";

export function BackgroundPage() {
  const { state, dispatch } = useBuilder();
  const build = state.build;
  const background = BACKGROUNDS[build.backgroundId];
  const recommended = RECOMMENDED_BACKGROUND[build.classId];
  const origin = build.choices.origin;
  const magic = origin.magicInitiate;
  const patchMagic = (patch: Partial<MagicInitiateChoices>) => dispatch({ type: "origin", patch: { magicInitiate: { ...magic, ...patch } } });
  const duplicate = classSkills(build).filter((id) => background.skills.includes(id));
  const errors = validateBuild(build).messages.filter((m) => m.severity === "blocker" && (m.targetStep === "background" || m.id === "scholar" || m.id === "ranger-expertise"));
  return <BuilderShell previous="species" next="abilities" nextDisabled={errors.some((m) => m.targetStep === "background")}>
    <section className="page-head"><h1>你的角色以前过着怎样的生活？</h1><p>背景描述过去的经历，也提供属性提升、两项技能、工具和起源专长。所有已开放背景都可用于当前职业。</p></section>
    <div className="muted-panel"><strong>不确定怎么选？</strong><p>{BACKGROUND_REASON[build.classId]}你也可以按角色故事选择其他背景。</p></div>
    <div className="background-grid">{(Object.keys(BACKGROUNDS) as BackgroundId[]).sort((a, b) => Number(b === recommended) - Number(a === recommended)).map((id) => {
      const option = BACKGROUNDS[id];
      return <button type="button" className={`card clickable ${build.backgroundId === id ? "selected" : ""}`} key={id} aria-pressed={build.backgroundId === id} onClick={() => dispatch({ type: "background", id })}>
        <h3>{option.name}{id === recommended && <span className="badge recommended">推荐</span>}</h3><p>{option.description}</p>
        <div className="facts"><span>可提升：{option.abilities.map((a) => abilityNames[a]).join(" / ")}</span><span>技能：{option.skills.map((s) => skillNames[s]).join(" / ")}</span><span>专长：{features[option.feat].name}</span></div>
      </button>;
    })}</div>
    <p className="hint">更换背景会把背景加值调整为当前组合的推荐值，保留基础属性、职业技能与法术。之后仍可自行修改属性加值。</p>
    {!background.abilities.includes(ABILITY_PRIORITY[build.classId][0]) && <p className="validation warning">这个背景不能提升当前职业的主要属性，可能降低命中或法术效果；仍可继续车卡。</p>}
    <section className="section" aria-label="当前背景能力"><h2>{background.name} · 你会获得什么</h2><h3>{features[background.feat].name}</h3><p>{features[background.feat].text}</p><p>工具熟练：{background.tool === "gaming-set" ? "所选游戏套装" : itemNames[background.tool]}</p>
      {build.backgroundId === "hermit" && <p className="hint">此装备包没有医疗包。战地医师需要另行获得医疗包；草药工具不能替代。{build.classId === "druid" && "草药工具熟练与职业重复，不叠加。"}</p>}
      <details><summary>查看背景起始装备 · 包 A</summary><p>{background.equipment.map((item) => `${itemNames[item.id] ?? (item.id === "gaming-set" ? "所选游戏套装" : item.id)} × ${item.quantity}`).join("、")}</p></details>
    </section>
    {(build.backgroundId === "soldier" || build.backgroundId === "wayfarer") && <section className="section"><h2>选择游戏套装</h2><p>{build.backgroundId === "soldier" ? "同时获得工具熟练与一套实物。" : "仅获得赌具实物；背景提供的工具熟练是盗贼工具。"}</p><label>游戏套装<select value={origin.gamingSet} onChange={(e) => dispatch({ type: "origin", patch: { gamingSet: e.target.value } })}>{Object.entries(GAMING_SETS).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label></section>}
    {(duplicate.length > 0 || errors.some((m) => m.targetStep === "configuration")) && <section className="warning-panel" role="status"><strong>有技能选择需要留意</strong>{duplicate.length > 0 && <p>{duplicate.map((id) => skillNames[id]).join("、")}由职业与背景重复提供，熟练不叠加。可保留，或把重复的职业技能换为本职业其他技能。</p>}{errors.filter((m) => m.targetStep === "configuration").map((m) => <p key={m.id}>{m.message}</p>)}<button className="button secondary" onClick={() => dispatch({ type: "skills-recommend" })}>调整重复技能与失效专精</button></section>}
    {build.backgroundId === "sage" && <section className="section"><h2>魔法学徒 · 法师法术</h2><p>已配好实用戏法与防护法术。法师推荐光亮术；其他职业推荐无需材料的魔法伎俩。法师之手可远距操作物件。专长独立于职业准备名额；一环法术每长休免费一次，也可消耗已有法术位。</p><button className="button secondary" onClick={() => dispatch({ type: "origin-magic-default" })}>恢复推荐专长法术</button>
      <p>当前选择：{magic.cantrips.map((id) => SPELL_LIST.find((s) => s.id === id)?.name).join("、")}；{SPELL_LIST.find((s) => s.id === magic.spell)?.name}。使用{abilityNames[magic.ability]}施法。</p><details className="choice-section"><summary>自定义专长法术与施法属性</summary><fieldset className="origin-cantrips"><legend>选择两道专长戏法 · {magic.cantrips.length}/2</legend>{SPELL_LIST.filter((s) => s.level === 0).map((s) => <label key={s.id}><input type="checkbox" checked={magic.cantrips.includes(s.id)} disabled={!magic.cantrips.includes(s.id) && magic.cantrips.length >= 2} onChange={() => patchMagic({ cantrips: magic.cantrips.includes(s.id) ? magic.cantrips.filter((id) => id !== s.id) : [...magic.cantrips, s.id] })} /><span><strong>{s.name}</strong><small>{s.text}</small></span></label>)}</fieldset>
      <div className="form-grid"><label>专长一环法术<select value={magic.spell} onChange={(e) => patchMagic({ spell: e.target.value })}>{SPELL_LIST.filter((s) => s.level === 1).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label><label>专长施法属性<select value={magic.ability} onChange={(e) => patchMagic({ ability: e.target.value as MagicInitiateChoices["ability"] })}>{(["intelligence", "wisdom", "charisma"] as const).map((id) => <option key={id} value={id}>{abilityNames[id]}</option>)}</select></label></div>
      <p>{SPELL_LIST.find((s) => s.id === magic.spell)?.text}</p></details><p className="hint">含材料的专长法术仍需要相应材料。职业法器是否适用，取决于该职业的施法规则；人物卡附页会单独提醒。</p>
    </section>}
    {errors.filter((m) => m.targetStep === "background").map((m) => <p className="validation blocker" role="status" key={m.id}>{m.message}</p>)}
    <p className="hint">目前开放 4 / 16 个 2024 背景，其余背景将随对应专长规则补齐。</p>
  </BuilderShell>;
}
