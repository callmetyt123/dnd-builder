import { BuilderShell } from "../components/builder/BuilderShell";
import { Card } from "../components/common/Card";

export function ClassPage() {
  return (
    <BuilderShell previous="playstyle" next="species">
      <section className="page-head"><h1>选择职业与子职</h1><p>当前 Vertical Slice 先实现战士与勇士；数据结构已经按 12 职业 / 48 子职设计。</p></section>
      <h2>职业</h2>
      <Card selected recommended><div className="card-title-row"><h3>战士</h3><span className="tag">近战</span><span className="tag">耐打</span><span className="tag">简单</span></div><p>可靠的武器战斗专家，能够在关键时刻爆发额外行动。</p><div className="complexity">车卡 ★★☆ · 战斗 ★☆☆</div><div className="reason">因为你选择了正面战斗，并偏好较简单的操作。</div></Card>
      <h2 className="section-title">子职</h2>
      <Card selected recommended><h3>勇士</h3><p>专注于稳定而直接的武器战斗，几乎不会增加额外资源管理。</p><div className="complexity">车卡 ★☆☆ · 战斗 ★☆☆</div></Card>
      <div className="muted-panel">其余职业与 47 个子职会在规则引擎压力测试完成后批量接入。</div>
    </BuilderShell>
  );
}
