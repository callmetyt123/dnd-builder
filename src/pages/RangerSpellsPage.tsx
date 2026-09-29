import { BuilderShell } from "../components/builder/BuilderShell";
import { RANGER_PREPARABLE } from "../data/ranger";
import { automaticMagic } from "../data/primalSubclasses";
import { spell } from "../data/spells";
import { useBuilder } from "../store/builder";
import { PrimalSpellChoices } from "./PrimalSpellChoices";

export function RangerSpellsPage() {
  const { state, dispatch } = useBuilder(), b = state.build, r = b.choices.ranger!, auto = automaticMagic(b);
  // 保留独立的宿敌与子职来源，普通准备名额不重复选择它们。
  return <BuilderShell previous="configuration" next="identity"><section className="page-head"><h1>准备游侠法术</h1><p>四道职业准备，另加猎人印记与所选子职法术。三级有三个一环位，没有二环位。</p></section><p className="muted-panel">完整开放 PHB 2024 一环游侠目录。长休恢复法术位，每次长休只能替换一道准备法术；编辑构筑不代表完成休息。</p>
    <PrimalSpellChoices build={b} title="职业准备法术" ids={RANGER_PREPARABLE.filter((id) => !auto.prepared.includes(id))} selected={r.prepared} max={4} set={(prepared) => dispatch({ type: "ranger", patch: { prepared } })} />
    <section className="success-panel"><h2>始终准备 · 独立名额</h2><p>{auto.prepared.map((id) => spell(id)!.name).join("、")}</p><p>{spell("hunters-mark")!.text}</p><p>猎人印记每长休两次免费施展，仍需附赠动作与专注；其他子职法术不免费。{b.subclassId === "beast-master" && "指挥伙伴与施展或转移印记争用附赠动作。"}</p></section>
  </BuilderShell>;
}
