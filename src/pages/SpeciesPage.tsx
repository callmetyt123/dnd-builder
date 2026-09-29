import { spell } from "../data/spells";
import { BuilderShell } from "../components/builder/BuilderShell";
import { FeatChoices } from "../components/origin/FeatChoices";
import { STANDARD_LANGUAGE_IDS } from "../data/core";
import { SPECIES, GIANT_GIFTS, DAMAGE_NAMES } from "../data/species";
import { ORIGIN_FEATS } from "../data/originOptions";
import { features } from "../data/characterDetails";
import { magicOptions, recommendedFeatChoices } from "../rules/origins";
import { deriveCharacter } from "../rules/engine/deriveCharacter";
import { validateBuild } from "../rules/validator/validateBuild";
import type { SpeciesId, SpeciesChoices, SkillId, OriginFeat } from "../rules/types";
import { abilityNames, skillNames, zhCN } from "../translations/zh-CN";
import { useBuilder } from "../store/builder";

export function SpeciesPage() {
  const { state, dispatch } = useBuilder();
  const build = state.build, sc = build.choices.species, species = SPECIES[build.speciesId];
  const patch = (patch: Partial<SpeciesChoices>) => dispatch({ type: "species-choices", patch });
  const c = deriveCharacter(build);
  const errors = validateBuild(build).messages.filter((m) => m.targetStep === "species" && m.severity === "blocker");
  const options = STANDARD_LANGUAGE_IDS.filter((id) => id !== "common");
  return <BuilderShell previous="class" next="background" nextDisabled={errors.length > 0}>
    <section className="page-head"><h1>选择你喜欢的种族形象</h1><p>十种 2024 种族均可用于当前职业。属性提升来自背景，这里优先选择你想扮演的形象。</p></section>
    <p className="muted-panel">想少记主动能力，可看矮人或半身人；喜欢魔法，可看精灵、侏儒或提夫林。其他种族同样能顺利开卡，推荐不会锁定选择。</p>
    <div className="background-grid">{(Object.entries(SPECIES) as [SpeciesId, typeof species][]).map(([id, option]) => <button type="button" key={id} className={`card clickable ${build.speciesId === id ? "selected" : ""}`} aria-pressed={build.speciesId === id} onClick={() => dispatch({ type: "species", id })}><h3>{option.name}</h3><p>{option.description}</p><div className="facts"><span>速度 {option.speed} 尺</span><span>寿命约 {option.lifespan} 年</span></div></button>)}</div>
    <section className="section"><h2>{species.name} · 三级种族选择</h2><div className="form-grid">
      {species.lineages && <label>血系／先祖<select value={sc.lineage} onChange={(e) => patch({ lineage: e.target.value })}>{Object.entries(species.lineages).map(([id, name]) => <option value={id} key={id}>{name}</option>)}</select></label>}
      <label>体型<select value={sc.size} onChange={(e) => patch({ size: e.target.value as SpeciesChoices["size"] })}>{species.sizes.map((id) => <option value={id} key={id}>{id === "small" ? "小型" : "中型"}</option>)}</select></label>
      {["elf", "gnome", "tiefling"].includes(build.speciesId) && <label>种族施法属性<select value={sc.ability} onChange={(e) => patch({ ability: e.target.value as SpeciesChoices["ability"] })}>{(["intelligence", "wisdom", "charisma"] as const).map((id) => <option value={id} key={id}>{abilityNames[id]}</option>)}</select></label>}
      {["elf", "human"].includes(build.speciesId) && <label>种族技能<select value={sc.skill} onChange={(e) => patch({ skill: e.target.value as SkillId })}>{Object.entries(skillNames).filter(([id]) => build.speciesId === "human" || ["insight", "perception", "survival"].includes(id)).map(([id, name]) => <option value={id} key={id}>{name}</option>)}</select></label>}
      {build.speciesId === "elf" && sc.lineage === "high" && <label>高等精灵戏法（长休可换）<select value={sc.cantrip} onChange={(e) => patch({ cantrip: e.target.value })}>{magicOptions("wizard").filter((s) => s.level === 0).map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}</select></label>}
    </div>
      <p>当前速度 {c.speed} 尺 · {c.senses.darkvision ? `黑暗视觉 ${c.senses.darkvision} 尺` : "普通视觉"} · {c.resistances.length ? c.resistances.map((id) => DAMAGE_NAMES[id]).join("、") + "伤害抗性" : "无种族伤害抗性"}。</p>
      {c.innateMagic.filter((m) => m.source === "种族法术").map((m) => <section key={m.source}><h3>当前种族法术</h3><p>使用{abilityNames[m.ability]}施法；戏法不耗法术位{m.freeUses ? `，一环法术每长休免费 ${m.freeUses} 次，也可用已有法术位` : ""}。这些法术不占职业名额。</p>{[...m.cantrips, ...m.spells].map((id) => { const s = spell(id)!; return <details key={id}><summary>{s.name} · {s.level ? "一环" : "戏法"}{s.concentration ? " · 专注" : ""}</summary><p>{s.time} · {s.range} · {s.components} · {s.duration}</p><p>{s.text}</p></details>; })}</section>)}
      {build.speciesId === "goliath" && <p>{GIANT_GIFTS[sc.lineage]}每长休两次。</p>}
      {build.speciesId === "human" && <><label>人类额外起源专长<select value={sc.humanFeat} onChange={(e) => patch({ humanFeat: e.target.value as OriginFeat })}>{ORIGIN_FEATS.map((id) => <option value={id} key={id}>{features[id].name}</option>)}</select></label><p className="hint">推荐熟习，方便扮演多面手；想减少选择也可以选健壮，直接增加 6 HP。背景与人类不能重复取得非复选专长。</p><FeatChoices feat={sc.humanFeat} value={sc.feat} recommended={recommendedFeatChoices(build, "human")} classId={build.classId} onChange={(change) => patch({ feat: { ...sc.feat, ...change } })} /></>}
      <details><summary>查看当前种族能力</summary>{c.speciesFeatures.map((id) => <p key={id}><strong>{features[id].name}：</strong>{features[id].text}</p>)}<p>感官：{c.senses.darkvision ? `黑暗视觉 ${c.senses.darkvision} 尺` : "普通视觉"}。种族法术的成分、使用次数和 DC 将写入人物卡附页。</p></details>
    </section>
    <section className="section"><h2>语言</h2><p className="hint">自动掌握通用语，再选两种不同的标准语言。选择语言不受种族限制。</p><div className="form-grid">{[0, 1].map((i) => <label key={i}>额外语言 {i + 1}<select value={build.choices.languages[i]} onChange={(e) => { const languages = [...build.choices.languages]; languages[i] = e.target.value; dispatch({ type: "languages", languages }); }}>{options.map((id) => <option key={id} value={id}>{zhCN.language[id as keyof typeof zhCN.language]}</option>)}</select></label>)}</div></section>
  </BuilderShell>;
}
