import { BuilderShell } from "../components/builder/BuilderShell";
import { DRUID_CANTRIPS, DRUID_PREPARABLE } from "../data/druidSpells";
import { automaticMagic } from "../data/primalSubclasses";
import { spell } from "../data/spells";
import { useBuilder } from "../store/builder";
import { PrimalSpellChoices } from "./PrimalSpellChoices";

export function DruidSpellsPage() {
  const { state, dispatch } = useBuilder(), b = state.build, d = b.choices.druid!, auto = automaticMagic(b);
  return <BuilderShell previous="configuration" next="identity"><section className="page-head"><h1>准备自然魔法</h1><p>感知施法；三级四个一环、两个二环位，长休恢复。长休可从职业列表重新准备六道法术。</p></section><p className="muted-panel">完整开放 PHB 2024 德鲁伊戏法与一、二环目录。结社和德鲁伊语法术自动获得，不重复占职业自选名额。</p>
    <PrimalSpellChoices build={b} title="职业戏法" ids={DRUID_CANTRIPS.filter((id) => !auto.cantrips.includes(id))} selected={d.cantrips} max={d.order === "magician" ? 3 : 2} set={(cantrips) => dispatch({ type: "druid", patch: { cantrips } })} />
    <PrimalSpellChoices build={b} title="职业准备法术" ids={DRUID_PREPARABLE.filter((id) => !auto.prepared.includes(id))} selected={d.prepared} max={6} set={(prepared) => dispatch({ type: "druid", patch: { prepared } })} />
    <section className="success-panel"><h2>自动获得 · 独立名额</h2><p>{[...auto.cantrips, ...auto.prepared].map((id) => spell(id)!.name).join("、")}</p><p>{b.subclassId === "moon" ? "兽形只可施展三道月亮结社法术，仍须正常成分。" : b.subclassId === "stars" ? "神导术、光导箭须持握星图；星耀形态可以正常施法，普通兽形不能施法。" : "当前结社不能在野兽形态中施法。"} 变形不终止已有专注；已准备的仪式法术可额外花十分钟不耗位施展。</p></section>
  </BuilderShell>;
}
