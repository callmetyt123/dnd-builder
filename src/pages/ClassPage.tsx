import { NEW_SUBCLASSES } from "../data/newSubclasses";
import { useRef } from "react";
import type { NewSubclassId } from "../rules/types";
import { NEW_CLASSES, NEW_CLASS_IDS, isNewClass } from "../data/newClasses";
import { DRUID_SUBCLASSES, WARLOCK_SUBCLASSES, RANGER_SUBCLASSES } from "../data/primalSubclasses";
import type { PrimalSubclassId } from "../rules/types";
import { FIGHTER_SUBCLASSES, WIZARD_SUBCLASSES } from "../data/expandedSubclasses";
import type { FighterSubclass, WizardSubclass } from "../rules/types";
import { recommendClasses } from "../rules/guides/onboarding";
import { ROGUE_SUBCLASSES } from "../data/rogue";
import type { RogueSubclass } from "../rules/types";
import { BACKGROUNDS, RECOMMENDED_BACKGROUND } from "../data/backgrounds";
import { subclassOptions, currentSubclassOption, recommendedSubclassId, type AnySubclassId } from "../data/subclassRegistry";
import { BuilderShell } from "../components/builder/BuilderShell";
import { useBuilder } from "../store/builder";
import { PROFILES } from "../data/profiles";

export function ClassPage() {
  const { state, dispatch } = useBuilder();
  const subclassSection = useRef<HTMLElement>(null);
  // 推荐方向保留职业级排序，子职说明只展示当前职业的实际选择。
  const ranked = recommendClasses(state.build.playstyle);
  const options = subclassOptions(state.build.classId);
  const current = currentSubclassOption(state.build.classId, state.build.subclassId);
  const recommended = recommendedSubclassId(state.build.classId);
  const changeSubclass = (id: AnySubclassId) => {
    if (isNewClass(state.build.classId)) dispatch({ type: "new-subclass", id: id as NewSubclassId });
    else if (state.build.classId === "rogue") dispatch({ type: "rogue-subclass", id: id as RogueSubclass });
    else if (["fighter", "wizard"].includes(state.build.classId)) dispatch({ type: "expanded-subclass", id: id as FighterSubclass | WizardSubclass });
    else dispatch({ type: "primal-subclass", id: id as PrimalSubclassId });
  };
  const scrollToSubclasses = () => subclassSection.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  return <BuilderShell previous="playstyle" next="species">
    <section className="page-head"><h1>选择职业与子职</h1><p>从十二个职业、四十八条三级子职路线开始；每个职业都有四个子职与入门推荐。切换职业会保留各自的车卡配置。</p></section>
    <section className="class-recommendations" aria-label="根据偏好推荐"><h2>从这两个方向开始看</h2><p>按你的玩法偏好和复杂度排序。选择职业后，后续页面已有可用的初始配置；以前编辑过的职业会恢复原配置。</p><div className="card-grid two">{ranked.slice(0, 2).map((r, i) => <article className="recommendation-card" key={r.id}><span className="badge recommended">{i === 0 ? "优先推荐" : "也可以考虑"}</span><h3>{PROFILES[r.id].name}</h3><p>{r.reason}</p><p><b>需要记住的事：</b>{r.effort}</p><button className="button secondary" aria-pressed={state.build.classId === r.id} onClick={() => dispatch({ type: "class", id: r.id })}>{state.build.classId === r.id ? `已选择${PROFILES[r.id].name}` : `选择${PROFILES[r.id].name}`}</button></article>)}</div></section>
    {/* 选职业后立即显示子职维度：这四十八个子职不是必填，但必须先让人知道还能再选。 */}
    <section className="subclass-status" aria-label="当前职业与子职">
      <div className="subclass-status-head">
        <span className="eyebrow">当前职业</span>
        <h2>{PROFILES[state.build.classId].name} · 已选子职：{current?.name}</h2>
        <p>{options.length} 个子职都已开放，可任选其一；不选也可以直接用推荐继续。切换子职会保留起源、属性和仍然合法的选择。</p>
      </div>
      <div className="subclass-chips" role="group" aria-label="切换子职">
        {options.map((option) => <button key={option.id} type="button" className={`subclass-chip ${option.id === state.build.subclassId ? "selected" : ""}`} aria-pressed={option.id === state.build.subclassId} onClick={() => changeSubclass(option.id)}>
          <b>{option.name}</b>
          <small>{option.complexity.split(" · ")[0]}{option.recommended ? " · 入门推荐" : ""}</small>
        </button>)}
      </div>
      {state.build.subclassId !== recommended && <p className="subclass-hint">当前不是该职业的入门推荐（{options.find((option) => option.id === recommended)?.name}）。自定义子职同样合法，可在下方查看代价与说明。</p>}
      <button className="button secondary subclass-jump" type="button" onClick={scrollToSubclasses}>查看全部四个子职的说明 ↓</button>
    </section>
    <h2>全部已开放职业</h2>
    <div className="class-options">{(["fighter", "wizard", "druid", "warlock", "ranger", "rogue", ...NEW_CLASS_IDS] as const).map((id) => <button key={id} className={`class-option ${state.build.classId === id ? "selected" : ""}`} aria-pressed={state.build.classId === id} onClick={() => { dispatch({ type: "class", id }); scrollToSubclasses(); }}>
      <span className="eyebrow">{isNewClass(id) ? NEW_CLASSES[id].effort : id === "rogue" ? "灵巧与偷袭 · 技能专家" : id === "ranger" ? "武器与自然 · 追猎探索" : id === "warlock" ? "契约与祈唤 · 短休恢复法术位" : id === "fighter" ? "武器与防护 · 操作简单" : id === "druid" ? "自然与变形 · 兼顾施法和近战" : "奥术与策略 · 需要管理法术"}</span><h2>{PROFILES[id].name} / 四个子职</h2>
      <p>{isNewClass(id) ? NEW_CLASSES[id].reason : id === "rogue" ? "以熟练与专精解决探索问题，利用优势或盟友配合触发偷袭。推荐从盗贼开始。" : id === "ranger" ? "使用武器、猎人印记与自然法术追猎探索。推荐从猎人开始。" : id === "warlock" ? "选择宗主授予的额外魔法，以三项魔能祈唤定制能力。推荐从邪魔宗主开始。" : id === "fighter" ? "用武器和护甲作战，以回气与动作如潮应对关键时刻。推荐从勇士开始。" : id === "druid" ? "使用自然魔法、荒野变形与结社能力帮助队伍。推荐从大地结社开始。" : "通过法术书应对攻击、防护与探索，长休可更换准备法术。推荐从塑能师开始。"}</p>
      <span>{BACKGROUNDS[RECOMMENDED_BACKGROUND[id]].name}为推荐背景 · 可在后续更换</span>
    </button>)}</div>
    <section className="section" ref={subclassSection} id="subclass-options">{state.build.classId === "fighter" || state.build.classId === "wizard" ? <h2>{PROFILES[state.build.classId].name}子职</h2> : <h2>{PROFILES[state.build.classId].name}子职</h2>}
      <p>切换保留起源、属性和技能。{state.build.classId === "rogue" ? "四种都包含偷袭、灵巧动作和稳定瞄准，专属能力按当前选择更新。" : state.build.classId === "wizard" ? "调整不符合新学派的额外抄录及关联准备项；幻术师额外习得次级幻象，已知晓时另选戏法。" : state.build.classId === "fighter" ? "共同能力相同，专属战技、法术和灵能按所选子职开放。" : ["druid", "warlock", "ranger"].includes(state.build.classId) ? "自动更新专属法术，并调整与新子职冲突的法术与兽形名额。" : "失效法术或缩减的技能名额会移除；缺少的项目请在配置、法术页补选或采用推荐。"}</p>
      <div className="card-grid two">
        {state.build.classId === "rogue" ? (Object.entries(ROGUE_SUBCLASSES) as [RogueSubclass, typeof ROGUE_SUBCLASSES[RogueSubclass]][]).map(([id, s]) => <button className={`class-option ${state.build.subclassId === id ? "selected" : ""}`} key={id} aria-pressed={state.build.subclassId === id} onClick={() => dispatch({ type: "rogue-subclass", id })}><span className="eyebrow">{s.complexity}{id === "thief" ? " · 入门推荐" : ""}</span><h3>{s.name}</h3><p>{s.reason}</p></button>)
          : state.build.classId === "fighter" || state.build.classId === "wizard" ? Object.entries(state.build.classId === "fighter" ? FIGHTER_SUBCLASSES : WIZARD_SUBCLASSES).map(([id, s]) => <button className={`class-option ${state.build.subclassId === id ? "selected" : ""}`} key={id} aria-pressed={state.build.subclassId === id} onClick={() => dispatch({ type: "expanded-subclass", id: id as FighterSubclass | WizardSubclass })}><span className="eyebrow">{s.complexity}{(state.build.classId === "fighter" ? "champion" : "evoker") === id ? " · 入门推荐" : ""}</span><h3>{s.name}</h3><p>{s.reason}</p></button>)
            : ["druid", "warlock", "ranger"].includes(state.build.classId) ? Object.entries(state.build.classId === "druid" ? DRUID_SUBCLASSES : state.build.classId === "warlock" ? WARLOCK_SUBCLASSES : RANGER_SUBCLASSES).map(([id, s]) => <button className={`class-option ${state.build.subclassId === id ? "selected" : ""}`} key={id} aria-pressed={state.build.subclassId === id} onClick={() => dispatch({ type: "primal-subclass", id: id as PrimalSubclassId })}><span className="eyebrow">{s.complexity}{(state.build.classId === "druid" ? "moon" : state.build.classId === "warlock" ? "fiend" : "hunter") === id ? " · 入门推荐" : ""}</span><h3>{s.name}</h3><p>{s.reason}</p></button>)
              : Object.entries(NEW_SUBCLASSES).filter(([, s]) => s.classId === state.build.classId).map(([id, s]) => <button key={id} className={`class-option ${state.build.subclassId === id ? "selected" : ""}`} aria-pressed={state.build.subclassId === id} onClick={() => dispatch({ type: "new-subclass", id: id as NewSubclassId })}><span className="eyebrow">{s.complexity}{id === NEW_CLASSES[s.classId].subclassId ? " · 入门推荐" : ""}</span><h3>{s.name}</h3><p>{s.reason}</p><small>{s.effort}</small></button>)}
      </div>
      {state.build.classId === "fighter" && ["eldritch-knight", "psi-warrior"].includes(state.build.subclassId) && <p className="hint">这个子职也需要智力。在属性页采用推荐属性，可兼顾力量、智力与体质。</p>}
    </section>
    <p className="muted-panel">所有已开放路线均可自由搭配十种种族和十六种背景。{state.build.classId === "wizard" && "塑能师的法术塑形在 6 级获得，三级范围法术仍需避开盟友。"}</p>
  </BuilderShell>;
}
