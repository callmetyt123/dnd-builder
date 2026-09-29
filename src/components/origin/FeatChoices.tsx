import { ARTISAN_TOOLS, CRAFTER_TOOLS, INSTRUMENTS, TOOL_OPTIONS } from "../../data/originOptions";
import { features } from "../../data/characterDetails";
import { defaultFeatChoices, defaultMagic, magicOptions } from "../../rules/origins";
import type { ClassId, FeatChoices as Choices, MagicList, OriginFeat } from "../../rules/types";
import { abilityNames, skillNames } from "../../translations/zh-CN";

export const MAGIC_LIST_NAMES = { wizard: "法师", cleric: "牧师", druid: "德鲁伊" };
export function SelectChoices({ title, options, values, count, onChange }: { title: string; options: Record<string, string>; values: string[]; count: number; onChange: (values: string[]) => void }) {
  return <fieldset><legend>{title}</legend><div className="form-grid">{Array.from({ length: count }, (_, i) => <label key={i}>{title} {i + 1}<select value={values[i] ?? ""} onChange={(e) => { const next = [...values]; next[i] = e.target.value; onChange(next); }}><option value="" disabled>请选择</option>{Object.entries(options).map(([id, name]) => <option value={id} key={id} disabled={values.includes(id) && values[i] !== id}>{name}</option>)}</select></label>)}</div></fieldset>;
}
export function FeatChoices({ feat, value, onChange, classId, fixedList, recommended }: { feat: OriginFeat; value: Choices; onChange: (patch: Partial<Choices>) => void; classId: ClassId; fixedList?: MagicList; recommended?: Choices }) {
  const list = fixedList ?? value.magicList, m = value.magicInitiate;
  const options = magicOptions(list);
  return <section className="section"><h3>{features[feat]?.name} · 选择与说明</h3><p>{features[feat]?.text}</p>
    {feat === "skilled" && <><p className="hint">推荐补上队伍常用的知识、医疗和社交技能；也可按人物经历选择工具。熟练不等于随身拥有该工具。</p><SelectChoices title="熟习" options={{ ...skillNames, ...TOOL_OPTIONS }} values={value.skilled} count={3} onChange={(skilled) => onChange({ skilled })} /></>}
    {feat === "crafter" && <><p className="hint">推荐优先补齐能制作冒险用品的工具，并避开已有熟练。木匠可做火把、铁匠可做铁蒺藜、织布可做绳索；只有持有相应工具才能实际制作。</p><SelectChoices title="巧匠工具" options={Object.fromEntries(CRAFTER_TOOLS.map((id) => [id, ARTISAN_TOOLS[id]]))} values={value.crafter} count={3} onChange={(crafter) => onChange({ crafter })} /></>}
    {feat === "musician" && <><p className="hint">三种乐器按你喜欢的形象选择；规则效果相同。背景乐器与专长重复不会叠加，其他乐器需另行获得。</p><SelectChoices title="音乐家乐器" options={INSTRUMENTS} values={value.musician} count={3} onChange={(musician) => onChange({ musician })} /></>}
    {feat === "magic-initiate" && <>
      {!fixedList && <label>魔法学徒法术列表<select value={list} onChange={(e) => { const magicList = e.target.value as MagicList; onChange({ magicList, magicInitiate: defaultMagic(magicList, classId) }); }}>{Object.entries(MAGIC_LIST_NAMES).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>}
      <p>{MAGIC_LIST_NAMES[list]}列表：{m.cantrips.map((id) => options.find((s) => s.id === id)?.name ?? "未选").join("、")}；{options.find((s) => s.id === m.spell)?.name ?? "未选"}。使用{abilityNames[m.ability]}施法。</p>
      <p className="hint">{list === "wizard" ? "推荐防护法术和探索戏法，减少需要判断的进攻选项。" : "推荐神导术帮助技能检定，治愈真言可远距扶起倒下的伙伴。"}这些选择不占职业名额；材料与专注要求仍需满足。</p>
      <button type="button" className="button secondary" onClick={() => onChange({ magicInitiate: defaultMagic(list, classId) })}>恢复推荐专长法术</button>
      <details className="choice-section"><summary>自定义专长法术与施法属性</summary><SelectChoices title="专长戏法" options={Object.fromEntries(options.filter((s) => s.level === 0).map((s) => [s.id, s.name]))} values={m.cantrips} count={2} onChange={(cantrips) => onChange({ magicInitiate: { ...m, cantrips } })} />
        <div className="form-grid"><label>专长一环法术<select value={m.spell} onChange={(e) => onChange({ magicInitiate: { ...m, spell: e.target.value } })}>{options.filter((s) => s.level === 1).map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}</select></label><label>专长施法属性<select value={m.ability} onChange={(e) => onChange({ magicInitiate: { ...m, ability: e.target.value as typeof m.ability } })}>{(["intelligence", "wisdom", "charisma"] as const).map((id) => <option value={id} key={id}>{abilityNames[id]}</option>)}</select></label></div>
      </details><div className="origin-spell-details">{[...m.cantrips, m.spell].map((id, index) => { const s = options.find((o) => o.id === id); return s && <details key={`${id}-${index}`}><summary>{s.name} · {s.time}{s.concentration ? " · 专注" : ""}</summary><p>{s.range} · {s.components} · {s.duration}</p><p>{s.text.replace(/感知调整值/g, "所选施法属性调整值")}</p></details>; })}</div>
    </>}
    {["skilled", "crafter", "musician"].includes(feat) && <button type="button" className="button secondary" onClick={() => { const defaults = recommended ?? defaultFeatChoices(classId); onChange(feat === "skilled" ? { skilled: defaults.skilled } : feat === "crafter" ? { crafter: defaults.crafter } : { musician: defaults.musician }); }}>恢复推荐专长选择</button>}
  </section>;
}
