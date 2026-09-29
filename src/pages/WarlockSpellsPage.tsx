import { BuilderShell } from "../components/builder/BuilderShell";
import { WARLOCK_CANTRIPS, WARLOCK_PREPARABLE } from "../data/warlock";
import { automaticMagic, primalSubclass } from "../data/primalSubclasses";
import { spell } from "../data/spells";
import { useBuilder } from "../store/builder";
import { PrimalSpellChoices } from "./PrimalSpellChoices";

export function WarlockSpellsPage() {
  const { state, dispatch } = useBuilder(), b = state.build, w = b.choices.warlock!, auto = automaticMagic(b);
  return <BuilderShell previous="configuration" next="identity"><section className="page-head"><h1>配置契约魔法</h1><p>两道职业戏法、四道职业准备，宗主额外法术另计。</p></section><p className="muted-panel">完整开放 PHB 2024 魔契师戏法与一、二环目录。两个契约位均为二环，短休全恢复；职业准备仅升级替换，三级至多两道二环职业准备（新增一道、替换一道），宗主名额不受此限制。</p>
    <PrimalSpellChoices build={b} title="职业戏法" ids={WARLOCK_CANTRIPS.filter((id) => !auto.cantrips.includes(id))} selected={w.cantrips} max={2} set={(cantrips) => dispatch({ type: "warlock", patch: { cantrips } })} />
    <PrimalSpellChoices build={b} title="职业准备法术" ids={WARLOCK_PREPARABLE.filter((id) => !auto.prepared.includes(id))} selected={w.prepared} max={4} secondLimit={2} set={(prepared) => dispatch({ type: "warlock", patch: { prepared } })} />
    <section className="success-panel"><h2>{primalSubclass(b)!.name} · 自动获得</h2><p>{[...auto.cantrips, ...auto.prepared].map((id) => spell(id)!.name).join("、")}。不占上方名额；非戏法通常消耗二环契约位，特殊免费施法次数见能力卡。</p></section>
    {w.prepared.includes("darkness") && !w.invocations.some((v) => v.id === "devils-sight") && <p className="warning-panel">普通黑暗视觉无法看穿黑暗术；你与盟友也可能受到遮蔽影响。</p>}
  </BuilderShell>;
}
