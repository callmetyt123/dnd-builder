import { DRUID_SUBCLASSES, WARLOCK_SUBCLASSES, RANGER_SUBCLASSES } from "../data/primalSubclasses";
import type { PrimalSubclassId } from "../rules/types";
import { FIGHTER_SUBCLASSES, WIZARD_SUBCLASSES } from "../data/expandedSubclasses";
import type { FighterSubclass, WizardSubclass } from "../rules/types";
import { recommendClasses } from "../rules/guides/onboarding";
import { ROGUE_SUBCLASSES } from "../data/rogue";
import type { RogueSubclass } from "../rules/types";
import { BACKGROUNDS, RECOMMENDED_BACKGROUND } from "../data/backgrounds";
import { BuilderShell } from "../components/builder/BuilderShell";
import { useBuilder } from "../store/builder";
import { PROFILES } from "../data/profiles";

export function ClassPage() {
  const { state, dispatch } = useBuilder();
  // 推荐方向保留职业级排序，子职说明只展示当前职业的实际选择。
  const ranked = recommendClasses(state.build.playstyle);
  return <BuilderShell previous="playstyle" next="species">
    <section className="page-head"><h1>选择职业与子职</h1><p>从六个职业、二十四条三级子职路线开始；每个职业均开放四个子职。切换职业会保留各自的车卡配置。</p></section>
    <section className="class-recommendations" aria-label="根据偏好推荐"><h2>从这两个方向开始看</h2><p>按你的玩法偏好和复杂度排序。选择职业后，后续页面已有可用的初始配置；以前编辑过的职业会恢复原配置。</p><div className="card-grid two">{ranked.slice(0, 2).map((r, i) => <article className="recommendation-card" key={r.id}><span className="badge recommended">{i === 0 ? "优先推荐" : "也可以考虑"}</span><h3>{PROFILES[r.id].name}</h3><p>{r.reason}</p><p><b>需要记住的事：</b>{r.effort}</p><button className="button secondary" aria-pressed={state.build.classId === r.id} onClick={() => dispatch({ type: "class", id: r.id })}>{state.build.classId === r.id ? `已选择${PROFILES[r.id].name}` : `选择${PROFILES[r.id].name}`}</button></article>)}</div></section>
    <h2>全部已开放职业</h2>
    <div className="class-options">{(["fighter", "wizard", "druid", "warlock", "ranger", "rogue"] as const).map((id) => <button key={id} className={`class-option ${state.build.classId === id ? "selected" : ""}`} aria-pressed={state.build.classId === id} onClick={() => dispatch({ type: "class", id })}>
      <span className="eyebrow">{id === "rogue" ? "灵巧与偷袭 · 技能专家" : id === "ranger" ? "武器与自然 · 追猎探索" : id === "warlock" ? "契约与祈唤 · 短休恢复法术位" : id === "fighter" ? "武器与防护 · 操作简单" : id === "druid" ? "自然与变形 · 兼顾施法和近战" : "奥术与策略 · 需要管理法术"}</span><h2>{PROFILES[id].name} / {"四个子职"}</h2>
      <p>{id === "rogue" ? "以熟练与专精解决探索问题，利用优势或盟友配合触发偷袭。推荐从盗贼开始。" : id === "ranger" ? "使用武器、猎人印记与自然法术追猎探索。推荐从猎人开始。" : id === "warlock" ? "选择宗主授予的额外魔法，以三项魔能祈唤定制能力。推荐从邪魔宗主开始。" : id === "fighter" ? "用武器和护甲作战，以回气与动作如潮应对关键时刻。推荐从勇士开始。" : id === "druid" ? "使用自然魔法、荒野变形与结社能力帮助队伍。推荐从大地结社开始。" : "通过法术书应对攻击、防护与探索，长休可更换准备法术。推荐从塑能师开始。"}</p>
      <span>{BACKGROUNDS[RECOMMENDED_BACKGROUND[id]].name}为推荐背景 · 可在后续更换</span>
    </button>)}</div>
    {state.build.classId === "rogue" && <section className="section"><h2>游荡者子职</h2><p>四种都包含偷袭、灵巧动作和稳定瞄准。切换子职保留起源、属性和技能，专属能力按当前选择更新。</p><div className="card-grid two">{(Object.entries(ROGUE_SUBCLASSES) as [RogueSubclass, typeof ROGUE_SUBCLASSES[RogueSubclass]][]).map(([id, s]) => <button className={`class-option ${state.build.subclassId === id ? "selected" : ""}`} key={id} aria-pressed={state.build.subclassId === id} onClick={() => dispatch({ type: "rogue-subclass", id })}><span className="eyebrow">{s.complexity}</span><h3>{s.name}</h3><p>{s.reason}</p></button>)}</div></section>}
    {(state.build.classId === "fighter" || state.build.classId === "wizard") && <section className="section"><h2>{PROFILES[state.build.classId].name}子职</h2><p>切换保留起源、属性和技能。{state.build.classId === "wizard" ? "调整不符合新学派的额外抄录及关联准备项；幻术师额外习得次级幻象，已知晓时另选戏法。" : "共同能力相同，专属战技、法术和灵能按所选子职开放。"}</p><div className="card-grid two">{Object.entries(state.build.classId === "fighter" ? FIGHTER_SUBCLASSES : WIZARD_SUBCLASSES).map(([id, s]) => <button className={`class-option ${state.build.subclassId === id ? "selected" : ""}`} key={id} aria-pressed={state.build.subclassId === id} onClick={() => dispatch({ type: "expanded-subclass", id: id as FighterSubclass | WizardSubclass })}><span className="eyebrow">{s.complexity}</span><h3>{s.name}</h3><p>{s.reason}</p></button>)}</div>{state.build.classId === "fighter" && ["eldritch-knight", "psi-warrior"].includes(state.build.subclassId) && <p className="hint">这个子职也需要智力。在属性页采用推荐属性，可兼顾力量、智力与体质。</p>}</section>}
    {["druid", "warlock", "ranger"].includes(state.build.classId) && <section className="section"><h2>{PROFILES[state.build.classId].name}子职</h2><p>切换保留起源、属性和技能；自动更新专属法术，并调整与新子职冲突的法术与兽形名额。</p><div className="card-grid two">{Object.entries(state.build.classId === "druid" ? DRUID_SUBCLASSES : state.build.classId === "warlock" ? WARLOCK_SUBCLASSES : RANGER_SUBCLASSES).map(([id, s]) => <button className={`class-option ${state.build.subclassId === id ? "selected" : ""}`} key={id} aria-pressed={state.build.subclassId === id} onClick={() => dispatch({ type: "primal-subclass", id: id as PrimalSubclassId })}><span className="eyebrow">{s.complexity}</span><h3>{s.name}</h3><p>{s.reason}</p></button>)}</div></section>}
    <p className="muted-panel">所有已开放路线均可自由搭配十种种族和十六种背景。{state.build.classId === "wizard" && "塑能师的法术塑形在 6 级获得，三级范围法术仍需避开盟友。"}</p>
  </BuilderShell>;
}
