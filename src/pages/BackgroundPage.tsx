import { BuilderShell } from "../components/builder/BuilderShell";
import { Card } from "../components/common/Card";

import { useBuilder } from "../store/builder";
import { GAMING_SETS } from "../data/characterDetails";

export function BackgroundPage() {
  const { state, dispatch } = useBuilder();
  if (state.build.classId === "wizard") return <BuilderShell previous="species" next="abilities"><section className="page-head"><h1>你曾是一名贤者</h1><p>你在书卷与研究中积累了奥术知识。</p></section><Card selected><h3>贤者</h3><div className="facts"><span>属性：体质 / 智力 / 感知</span><span>技能：奥秘 / 历史</span><span>工具：书法工具</span><span>起源专长：魔法学徒（法师）</span></div><p>额外获得 2 道戏法和 1 道始终准备的一环法术；在后面的法术页配置。</p></Card><p className="muted-panel">背景装备：长棍、书法工具、历史书、8 张羊皮纸、长袍、8 GP。</p></BuilderShell>;
  return (
    <BuilderShell previous="species" next="abilities">
      <section className="page-head"><h1>你的角色以前过着怎样的生活？</h1><p>背景决定属性提升范围、技能、工具、起源专长与一部分起始装备。</p></section>
      <Card selected recommended><h3>士兵</h3><p>你曾接受正式的战斗训练，并有实际战场经验。</p><div className="facts"><span>属性：力量 / 敏捷 / 体质</span><span>技能：运动 / 威吓</span><span>起源专长：凶蛮打手</span><span>工具：一种游戏套装</span></div></Card>
      <section className="section"><h2>选择一种游戏套装</h2><p>同时获得该工具的熟练与一套实物。</p><label>游戏套装<select value={state.build.choices.soldierGamingSet ?? ""} onChange={(e) => dispatch({ type: "gaming-set", id: e.target.value })}><option value="" disabled>请选择</option>{Object.entries(GAMING_SETS).map(([id, name]) => <option value={id} key={id}>{name}</option>)}</select></label></section>
    </BuilderShell>
  );
}
