import { recommendClasses } from "../rules/guides/onboarding";
import { ROGUE_SUBCLASSES } from "../data/rogue";
import type { RogueSubclass } from "../rules/types";
import { BACKGROUNDS, RECOMMENDED_BACKGROUND } from "../data/backgrounds";
import { BuilderShell } from "../components/builder/BuilderShell";
import { useBuilder } from "../store/builder";
import { PROFILES } from "../data/profiles";

export function ClassPage() {
  const { state, dispatch } = useBuilder();
  const ranked = recommendClasses(state.build.playstyle);
  return <BuilderShell previous="playstyle" next="species">
    <section className="page-head"><h1>选择职业与子职</h1><p>从六个职业开始；游荡者已开放四个三级子职。切换职业会保留各自的车卡配置。</p></section>
    <section className="class-recommendations" aria-label="根据偏好推荐"><h2>从这两个方向开始看</h2><p>按你的玩法偏好和复杂度排序。选择职业后，后续页面已有可用的初始配置；以前编辑过的职业会恢复原配置。</p><div className="card-grid two">{ranked.slice(0, 2).map((r, i) => <article className="recommendation-card" key={r.id}><span className="badge recommended">{i === 0 ? "优先推荐" : "也可以考虑"}</span><h3>{PROFILES[r.id].name}</h3><p>{r.reason}</p><p><b>需要记住的事：</b>{r.effort}</p><button className="button secondary" aria-pressed={state.build.classId === r.id} onClick={() => dispatch({ type: "class", id: r.id })}>{state.build.classId === r.id ? `已选择${PROFILES[r.id].name}` : `选择${PROFILES[r.id].name}`}</button></article>)}</div></section>
    <h2>全部已开放职业</h2>
    <div className="class-options">{(["fighter", "wizard", "druid", "warlock", "ranger", "rogue"] as const).map((id) => <button key={id} className={`class-option ${state.build.classId === id ? "selected" : ""}`} aria-pressed={state.build.classId === id} onClick={() => dispatch({ type: "class", id })}>
      <span className="eyebrow">{id === "rogue" ? "灵巧与偷袭 · 技能专家" : id === "ranger" ? "弓箭与伙伴 · 协同作战" : id === "warlock" ? "契约与祈唤 · 短休恢复法术位" : id === "fighter" ? "武器与防护 · 操作简单" : id === "druid" ? "自然与变形 · 兼顾施法和近战" : "奥术与策略 · 需要管理法术"}</span><h2>{PROFILES[id].name} / {id === "rogue" ? "四个子职" : PROFILES[id].subclass}</h2>
      <p>{id === "rogue" ? "以熟练与专精解决探索问题，利用优势或盟友配合触发偷袭。推荐从盗贼开始。" : id === "ranger" ? "驯兽师与原初行侣共同作战，管理伙伴行动、猎人印记与一环法术。" : id === "warlock" ? "邪魔宗主授予额外法术；以三项魔能祈唤定制戏法、防护与感官。" : id === "fighter" ? "勇士依靠稳定的武器攻击作战，以回气与动作如潮应对关键时刻。" : id === "druid" ? "月亮结社化身野兽，以临时生命值保护自身，并在兽形施展结社法术。" : "塑能师研习元素法术；强力戏法让未命中的伤害戏法也能造成半伤。"}</p>
      <span>{BACKGROUNDS[RECOMMENDED_BACKGROUND[id]].name}为推荐背景 · 可在后续更换</span>
    </button>)}</div>
    {state.build.classId === "rogue" && <section className="section"><h2>游荡者子职</h2><p>四种都包含偷袭、灵巧动作和稳定瞄准。切换子职保留起源、属性和技能，专属能力按当前选择更新。</p><div className="card-grid two">{(Object.entries(ROGUE_SUBCLASSES) as [RogueSubclass, typeof ROGUE_SUBCLASSES[RogueSubclass]][]).map(([id, s]) => <button className={`class-option ${state.build.subclassId === id ? "selected" : ""}`} key={id} aria-pressed={state.build.subclassId === id} onClick={() => dispatch({ type: "rogue-subclass", id })}><span className="eyebrow">{s.complexity}</span><h3>{s.name}</h3><p>{s.reason}</p></button>)}</div></section>}
    <p className="muted-panel">所有已开放路线均可自由搭配十种种族和十六种背景。塑能师的法术塑形在 6 级获得，三级范围法术仍需避开盟友。</p>
  </BuilderShell>;
}
