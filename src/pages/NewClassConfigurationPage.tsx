import { newSubclass, newSkillCount } from "../data/newSubclasses";
import { BuilderShell } from "../components/builder/BuilderShell";
import { NEW_CLASSES, isNewClass } from "../data/newClasses";
import { METAMAGIC, PALADIN_STYLES } from "../data/newClassFeatures";
import { INSTRUMENTS, ARTISAN_TOOLS } from "../data/originOptions";
import { itemNames } from "../data/characterDetails";
import { WEAPONS } from "../data/weapons";
import { newChoices, newMasteryIds } from "../rules/newClasses";
import { proficientSkills } from "../rules/origins";
import { hasSpellStep } from "../data/rogue";
import { skillNames, masteryName } from "../translations/zh-CN";
import type { NewClassChoices, SkillId } from "../rules/types";
import { useBuilder } from "../store/builder";

export function NewClassConfigurationPage() {
  const { state, dispatch } = useBuilder(), b = state.build;
  if (!isNewClass(b.classId)) return null;
  const id = b.classId, d = NEW_CLASSES[id], q = newChoices(b)!;
  const patch = (patch: Partial<NewClassChoices>) => dispatch({ type: "new-class", patch });
  // 满额不替换旧选择，先取消再选；推荐按钮仍可一次填好配置。
  const pills = (ids: string[], selected: string[], max: number, name: (id:string)=>string, set:(ids:string[])=>void) => <div className="choice-pills">{ids.map((v) => <button key={v} className={selected.includes(v) ? "selected" : ""} aria-pressed={selected.includes(v)} disabled={!selected.includes(v) && selected.length >= max} onClick={() => set(selected.includes(v) ? selected.filter((x)=>x!==v) : [...selected,v])}>{name(v)}</button>)}</div>;
  return <BuilderShell previous="abilities" next={hasSpellStep(b) ? "spells" : "identity"}><section className="page-head"><h1>完善{d.name}配置</h1><p>{newSubclass(b).name} · 新人可保留推荐项。{newSubclass(b).reason}</p></section>
    <section className="section"><h2>职业技能 · {q.skills.length}/{newSkillCount(b)}</h2><p>{b.subclassId === "lore" ? "含职业三项和逸闻学院额外三项；另有两项专精。" : id === "barbarian" ? "含原初学识额外一项。" : "背景与种族技能另外计入。"}避免与背景重复；重复不会叠加熟练。</p>{pills(d.skills,q.skills,newSkillCount(b),(v)=>skillNames[v as SkillId],(skills)=>patch({skills:skills as SkillId[]}))}</section>
    {id === "bard" && <><section className="section"><h2>技能专精 · {q.expertise.length}/2</h2><p>只能选择已熟练技能；更换背景后失效的旧项可取消，再重新选择。</p>{pills([...new Set([...proficientSkills(b),...q.expertise])],q.expertise,2,(v)=>skillNames[v as SkillId],(expertise)=>patch({expertise:expertise as SkillId[]}))}</section><section className="section"><h2>乐器熟练 · {q.tools.length}/3</h2>{pills(Object.keys(INSTRUMENTS),q.tools,3,(v)=>itemNames[v] ?? v,(tools)=>patch({tools}))}<label>包 A 携带的乐器<select value={q.instrument} onChange={(e)=>patch({instrument:e.target.value})}>{Object.keys(INSTRUMENTS).map((v)=><option key={v} value={v}>{itemNames[v]}</option>)}</select></label><p>三种熟练不等于携带三件实物；所选乐器可以作为吟游诗人法器。</p></section></>}
    {id === "monk" && <section className="section"><h2>工具熟练与起始工具</h2><label>选择一种工匠工具或乐器<select value={q.tools[0]} onChange={(e)=>patch({tools:[e.target.value]})}>{[...Object.keys(ARTISAN_TOOLS),...Object.keys(INSTRUMENTS)].map((v)=><option key={v} value={v}>{itemNames[v] ?? v}</option>)}</select></label><p>包 A 提供这件工具。徒手、矛与匕首可使用敏捷和 d6 武艺骰；保持无甲无盾以使用武艺与无甲移动。</p></section>}
    {id === "cleric" && <section className="section"><h2>圣职</h2><div className="card-grid two">{[{id:"thaumaturge",name:"奇术使",text:"额外一道牧师戏法；奥秘与宗教检定加感知调整值（至少 +1）。"},{id:"protector",name:"保护者",text:"获得军用武器熟练与重甲训练；包 A 仍提供链甲衫，训练不会自动赠送重甲。"}].map((o)=><button key={o.id} className={`class-option ${q.order===o.id ? "selected" : ""}`} aria-pressed={q.order===o.id} onClick={()=>patch({order:o.id})}><h3>{o.name}</h3><p>{o.text}</p></button>)}</div></section>}
    {id === "paladin" && <section className="section"><h2>战斗风格</h2><p>可选全部十种战斗风格，或受祝福的勇士。推荐防御配合包 A；训练与风格不会赠送额外装备。</p><div className="card-grid two">{Object.entries(PALADIN_STYLES).map(([v,o])=><button key={v} className={`class-option ${q.style===v ? "selected" : ""}`} aria-pressed={q.style===v} onClick={()=>patch({style:v})}><h3>{o.name}</h3><p>{o.text}</p></button>)}</div></section>}
    {id === "sorcerer" && <section className="section"><h2>超魔法 · {q.metamagic.length}/2</h2><p>推荐强效与精妙：前者修正伤害骰，后者减少施法成分。通常一次法术只能用一种超魔，例外见说明。</p><div className="card-grid two">{Object.entries(METAMAGIC).map(([v,o])=><button key={v} className={`class-option ${q.metamagic.includes(v) ? "selected" : ""}`} aria-pressed={q.metamagic.includes(v)} disabled={!q.metamagic.includes(v)&&q.metamagic.length>=2} onClick={()=>patch({metamagic:q.metamagic.includes(v)?q.metamagic.filter(x=>x!==v):[...q.metamagic,v]})}><h3>{o.name} · {o.cost} 术法点</h3><p>{o.text}</p></button>)}</div></section>}
    {(id === "barbarian" || id === "paladin") && <section className="section"><h2>武器精通 · {b.choices.weaponMasteries.length}/2</h2><p>从已录入且符合职业的武器选择两种；精通不会自动赠送武器。</p>{pills(newMasteryIds(id),b.choices.weaponMasteries,2,(v)=>`${itemNames[v]} · ${masteryName(WEAPONS[v].mastery)}`,(ids)=>dispatch({type:"weapon-masteries",ids}))}</section>}
    {b.subclassId === "wild-heart" && <section className="section"><h2>兽性狂暴 · 入门示例</h2><p>每次狂暴仍可重新选择；这里只决定上手卡先介绍哪一种。</p><div className="choice-pills">{Object.entries({bear:"熊：提高耐久",eagle:"鹰：灵活移动",wolf:"狼：协助盟友"}).map(([key,label])=><button key={key} aria-pressed={(q.wildHeart??"bear")===key} className={(q.wildHeart??"bear")===key?"selected":""} onClick={()=>patch({wildHeart:key})}>{label}</button>)}</div></section>}
    {b.subclassId === "clockwork" && <section className="section"><h2>秩序显迹 · 施法外观</h2><select aria-label="秩序显迹" value={q.manifestation ?? "gears"} onChange={e=>patch({manifestation:e.target.value})}>{Object.entries({gears:"身后虚幻齿轮",eyes:"眼中时钟指针",brass:"皮肤黄铜光泽",geometry:"体表几何公式",focus:"法器变成机械",sound:"施法伴随钟声"}).map(([id,name])=><option value={id} key={id}>{name}</option>)}</select><p>仅角色外观，不改变规则数值。</p></section>}
    <section className="section"><h2>起始装备 · 包 A</h2><p>{d.equipment.map((e)=>`${e.id === "class-instrument" ? itemNames[q.instrument] : e.id === "class-tool" ? itemNames[q.tools[0]] : itemNames[e.id] ?? e.id} × ${e.quantity}`).join("、")}；另加背景装备。</p><p>{d.training}</p>{b.subclassId==="dance"&&<p className="hint">推荐将皮甲放在行囊内，不穿护甲、不持盾，才能使用炫目舞步。人物卡按无甲状态计算。</p>}</section>
  </BuilderShell>;
}
