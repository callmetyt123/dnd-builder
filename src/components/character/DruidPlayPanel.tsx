import { useState } from "react";
import { useBuilder } from "../../store/builder";
import { beast } from "../../data/beasts";
import { deriveWildShape } from "../../rules/engine/wildShape";
import type { DerivedCharacter } from "../../rules/types";
import type { PlayState } from "../../rules/engine/playState";

export function DruidPlayPanel({ c, play }: { c: DerivedCharacter; play: PlayState }) {
  const { dispatch } = useBuilder();
  const [damage, setDamage] = useState(0);
  const active = deriveWildShape(c, play.formId);
  return <section className="wild-shape-panel no-print" aria-label="荒野变形记录"><div className="panel-heading"><div><div className="eyebrow">月亮结社 · 3 级</div><h2>当前形态：{beast(play.formId ?? "")?.name ?? "原形"}</h2><p>AC {active.armorClass} · 速度 {active.speed} 尺 · HP 共用 {play.hp}/{c.maxHp} · 临时 HP {play.temporaryHp}</p></div><span className="tag">荒野变形 {play.remaining["wild-shape"]}/2</span></div>
    <div className="choice-pills">{c.wildShape!.knownForms.map((id) => <button key={id} disabled={play.remaining["wild-shape"] === 0 || play.hp === 0 || play.incapacitated} onClick={() => dispatch({ type: "play", action: { type: "transform", formId: id } })}>变为{beast(id)!.name}</button>)}<button disabled={!play.formId} onClick={() => dispatch({ type: "play", action: { type: "revert" } })}>恢复原形 / 时间到期</button></div>
    <p>每次变形用一个附赠动作、消耗 1 次，获得 9 临时 HP，与已有值取高。再次变形同样消耗；临时 HP 耗尽不会变回原形。持续至多 1 小时，由玩家跟踪；主动恢复原形需附赠动作。</p>
    <div className="form-grid"><label>实际承受伤害（已结算抗性）<input type="number" min={0} max={9999} value={damage} onChange={(e) => setDamage(Number(e.target.value))} /></label><button className="button secondary" disabled={!Number.isInteger(damage) || damage <= 0 || damage > 9999} onClick={() => { dispatch({ type: "play", action: { type: "damage", amount: damage } }); setDamage(0); }}>应用伤害（先扣临时 HP）</button></div>
    <label className="inline-check"><input type="checkbox" checked={!!play.incapacitated} onChange={(e) => dispatch({ type: "play", action: { type: "incapacitated", value: e.target.checked } })} />失能（立即结束形态；解除后需重新变形）</label>
    <p className="hint">0 HP 按通常昏迷处理并结束形态。手动标记的失能请在其来源解除后取消，长休不自动清除。恢复原形不改变 HP，也不退款；临时 HP 按通常持续规则保留到耗尽或长休，若主持人另有裁定可在冒险记录中修正。</p>
    <details><summary>荒野伙伴 · {play.companion ? "已召唤" : "未召唤"}</summary><p>以魔法动作召唤妖精魔宠，不需材料；完成长休消失。具体魔宠形态和行动由玩家管理，兽形不能施展此法术。</p><div className="choice-pills">{(["wild-shape", "spell-slot-1", "spell-slot-2"] as const).map((resource) => <button key={resource} disabled={!!play.formId || play.hp === 0 || play.incapacitated || play.remaining[resource] === 0} onClick={() => dispatch({ type: "play", action: { type: "companion", resource } })}>消耗{resource === "wild-shape" ? "荒野变形" : resource === "spell-slot-1" ? "一环法术位" : "二环法术位"}召唤</button>)}<button disabled={!play.companion} onClick={() => dispatch({ type: "play", action: { type: "dismiss-companion" } })}>记录魔宠已消失</button></div></details>
  </section>;
}
