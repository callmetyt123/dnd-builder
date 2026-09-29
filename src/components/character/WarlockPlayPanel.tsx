import { useState } from "react";
import type { DerivedCharacter } from "../../rules/types";
import type { PlayState, PlayAction } from "../../rules/engine/playState";
import { deriveWarlockPlay } from "../../rules/engine/warlock";
import { spell } from "../../data/spells";
import { useBuilder } from "../../store/builder";

export function WarlockPlayPanel({ c, play }: { c: DerivedCharacter; play: PlayState }) {
  const { dispatch } = useBuilder();
  const [selected, setSelected] = useState(c.spellcasting!.prepared[0]);
  const [damage, setDamage] = useState(0);
  const update = (action: PlayAction) => dispatch({ type: "play", action });
  const canAct = play.hp > 0 && !play.incapacitated;
  const atWill = c.pactMagic!.atWill;
  // 构筑编辑后退回仍在准备列表中的法术，防止旧选择扣位。
  const spellId = c.spellcasting!.prepared.includes(selected) ? selected : c.spellcasting!.prepared[0];
  return <section className="play-panel no-print" aria-label="契约魔法操作"><div className="panel-heading"><div><h2>契约魔法与祈唤</h2><p>施法按钮会扣除 1 个二环法术位；目标、成分、时机和专注由玩家确认。</p></div></div><div className="form-grid"><label>施展契约法术<select value={spellId} onChange={(e) => setSelected(e.target.value)}>{c.spellcasting!.prepared.map((id) => <option key={id} value={id}>{spell(id)?.name}</option>)}</select></label><button className="button primary" disabled={!canAct || play.remaining["pact-slot"] === 0} onClick={() => update({ type: "cast-pact", spellId })}>施展并消耗二环法术位</button></div>
    <div className="rest-actions"><button className="button secondary" disabled={!canAct || play.remaining["pact-slot"] === 2 || play.remaining["magical-cunning"] === 0} onClick={() => update({ type: "magical-cunning" })}>完成一分钟秘法回流</button><button className="button secondary" onClick={() => update({ type: "dark-blessing" })}>触发黑暗赐福 · {c.pactMagic!.darkBlessing} 临时 HP</button>{atWill.includes("false-life") && <button className="button secondary" disabled={!canAct} onClick={() => update({ type: "fiendish-vigor" })}>邪魔活力 · 12 临时 HP</button>}</div><p className="hint">黑暗赐福：你使敌人降至 0 HP，或别人使你 10 尺内敌人降至 0 HP 后再点击。临时 HP 取较高值，不相加。秘法回流恢复 1 个契约法术位，每长休一次。</p>
    <p><b>当前 AC {deriveWarlockPlay(c, play).armorClass}</b> · {deriveWarlockPlay(c, play).armorNote}</p><div className="rest-actions">{play.warlockArmor !== "leather" && <button className="button secondary" disabled={!canAct} onClick={() => update({ type: "warlock-armor", value: "leather" })}>已穿回皮甲</button>}{play.warlockArmor !== "unarmored" && <button className="button secondary" disabled={!canAct} onClick={() => update({ type: "warlock-armor", value: "unarmored" })}>{play.warlockArmor === "mage-armor" ? "法师护甲结束（保持无甲）" : "已脱下皮甲"}</button>}{atWill.includes("mage-armor") && <button className="button secondary" disabled={!canAct || play.warlockArmor === "mage-armor"} onClick={() => update({ type: "warlock-armor", value: "mage-armor" })}>已脱甲并施展法师护甲</button>}</div>{atWill.includes("mage-armor") && <p className="hint">脱皮甲需 1 分钟；法师护甲需动作与正常成分，不消耗法术位，持续 8 小时。到期请手动结束；长休后自动结束。</p>}
    {play.agathys && <p>黯冰狱铠生效：临时 HP 尚存时，被近战攻击命中，攻击者受到 10 寒冷伤害；最后一次耗尽临时 HP 的命中也需处理反伤。持续 1 小时。<button className="button secondary" onClick={() => update({ type: "end-agathys" })}>黯冰狱铠到期</button></p>}
    <div className="form-grid"><label>本次承受伤害<input type="number" min={0} value={damage} onChange={(e) => setDamage(Number(e.target.value))} /></label><button className="button secondary" onClick={() => { update({ type: "damage", amount: damage }); setDamage(0); }}>记录伤害（先扣临时 HP）</button></div><label><input type="checkbox" checked={!!play.incapacitated} onChange={(e) => update({ type: "incapacitated", value: e.target.checked })} />失能（阻止施法；专注应结束）</label>
  </section>;
}
