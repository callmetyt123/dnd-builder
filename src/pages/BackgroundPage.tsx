import { BuilderShell } from "../components/builder/BuilderShell";
import { Card } from "../components/common/Card";

export function BackgroundPage() {
  return (
    <BuilderShell previous="species" next="abilities">
      <section className="page-head"><h1>你的角色以前过着怎样的生活？</h1><p>背景决定属性提升范围、技能、工具、起源专长与一部分起始装备。</p></section>
      <Card selected recommended><h3>士兵</h3><p>你曾接受正式的战斗训练，并有实际战场经验。</p><div className="facts"><span>属性：力量 / 敏捷 / 体质</span><span>技能：运动 / 威吓</span><span>起源专长：已自动加入</span><span>工具：一种游戏套装</span></div></Card>
      <div className="muted-panel">完整 V1 会开放 PHB 2024 全部背景；不匹配当前构筑的背景只提示，不禁用。</div>
    </BuilderShell>
  );
}
