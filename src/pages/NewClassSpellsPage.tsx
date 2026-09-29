import { BuilderShell } from "../components/builder/BuilderShell";
import { NEW_CLASSES, isNewClass } from "../data/newClasses";
import { spell } from "../data/spells";
import { newChoices, newCantripIds, newCantripCount, newSpellIds } from "../rules/newClasses";
import { useBuilder } from "../store/builder";
import { PrimalSpellChoices } from "./PrimalSpellChoices";

export function NewClassSpellsPage() {
  const {state,dispatch}=useBuilder(), b=state.build;
  if (!isNewClass(b.classId)) return null;
  const d=NEW_CLASSES[b.classId], q=newChoices(b)!, n=newCantripCount(b);
  return <BuilderShell previous="configuration" next="identity"><section className="page-head"><h1>选择{d.name}法术</h1><p>{b.classId === "cleric" ? "感知" : "魅力"}施法 · {b.classId === "paladin" ? "三个一环位" : "四个一环位、两个二环位"}，长休恢复。{b.classId === "cleric" ? "长休可重新选择准备法术。" : b.classId === "paladin" ? "长休可替换一道准备法术。" : "准备列表是当前三级构筑；后续升级时按职业规则替换。"}</p></section>
    <p className="muted-panel">开放当前职业三级可用的 PHB 2024 完整目录。自动授予与起源法术独立计数；法术位是每天可用的施法资源，不等于会多少道法术。</p>
    {n > 0 && <PrimalSpellChoices build={b} title="职业戏法" ids={newCantripIds(b)} selected={q.cantrips} max={n} set={(cantrips)=>dispatch({type:"new-class",patch:{cantrips}})} />}
    <PrimalSpellChoices build={b} title="职业准备法术" ids={newSpellIds(b.classId).filter((v)=>spell(v)!.level>0&&!d.auto.includes(v))} selected={q.prepared} max={d.preparedCount} set={(prepared)=>dispatch({type:"new-class",patch:{prepared}})} />
    {d.auto.length>0 && <section className="success-panel"><h2>自动获得 · 独立名额</h2><p>{d.auto.map((v)=>spell(v)!.name).join("、")}</p><p>{b.classId==="paladin" ? "至圣斩每长休可免费施展一次；免费仍需附赠动作与言语。其他自动法术正常耗位。" : "这些法术始终准备，正常施展仍消耗法术位。"}</p></section>}
  </BuilderShell>;
}
