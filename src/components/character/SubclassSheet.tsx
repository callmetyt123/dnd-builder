import type { CharacterBuild, DerivedCharacter } from "../../rules/types";
import { subclassFeatures } from "../../rules/expandedSubclasses";
import { MANEUVERS } from "../../data/expandedSubclasses";
import { features, itemNames } from "../../data/characterDetails";
import { skillNames } from "../../translations/zh-CN";
import { signed } from "../../rules/engine/format";
import { Header } from "./CharacterSheets";

// 子职详细操作独立分页，避免新增战技挤占核心数值和共同职业能力。
export function SubclassSheet({ build, c, total }: { build: CharacterBuild; c: DerivedCharacter; total: number }) {
  const f = build.choices.fighter;
  return <article className="sheet-page subclass-reference" data-sheet-page><Header build={build} title="完整人物卡 · 子职能力" page={`04 / ${total}`} /><div className="sheet-features">{subclassFeatures(build).map((id) => <section key={id}><h3>{features[id].name}</h3><small>{features[id].timing}</small><p>{features[id].text}</p></section>)}</div>
    {build.subclassId === "battle-master" && f && <><p className="casting-strip">战技豁免 DC {10 + Math.max(c.abilities.strength.modifier, c.abilities.dexterity.modifier)} · 按力量或敏捷较高者推荐；每次攻击仅一项战技</p><p>战争学者：{skillNames[f.studentSkill]} · {itemNames[f.artisanTool]}熟练</p><div className="sheet-features">{f.maneuvers.map((id) => <section key={id}><h3>{MANEUVERS[id].name}</h3><small>{MANEUVERS[id].timing} · 消耗 1 枚 d8</small><p>{MANEUVERS[id].text}</p></section>)}</div></>}
    {build.subclassId === "eldritch-knight" && f && <><h3>计划联结武器</h3><p>{f.bondedWeapons.map((id) => itemNames[id] + (id === "javelin" ? "（其中一支）" : "")).join("、") || "尚未选择，获得武器后可在线下联结"} · 完成仪式：□</p><h3>施法准备</h3><p>起始包不赠送法器。奥术法器仅可替代无标价且不消耗的材料；其他材料须备实物。联结武器不是法器。言语需能出声，姿势需空手；双手武器可暂松开一只手施法。</p><p>法术攻击 {signed(c.spellcasting!.attack)} · DC {c.spellcasting!.dc}。同一时间只维持一个专注；受伤需作维持专注的体质豁免。已准备的仪式法术可额外花十分钟不耗位施展。一回合至多消耗一个法术位施法；动作如潮不能执行魔法动作。</p></>}
    {build.subclassId === "psi-warrior" && <p className="casting-strip">庇护减伤：max(1, 1d6{signed(c.abilities.intelligence.modifier)})<br />灵能打击追加力场伤害：1d6{signed(c.abilities.intelligence.modifier)}</p>}
    {build.subclassId === "abjurer" && <><h3>守御记录</h3><p className="casting-strip">HP 上限 {6 + c.abilities.intelligence.modifier} · 当前守御 HP ______</p><p>今日已创建：□　长休后旧结界结束；需再次耗位施展防护法术才能创建。守御与临时 HP 分开记录，不是临时 HP。</p></>}
    {build.subclassId === "diviner" && <><h3>长休后的预见骰</h3><p className="casting-strip">结果一：______　已使用 □<br />结果二：______　已使用 □</p><p>这里记录真实掷出的 d20 点数；替换检定用骰后仍按该检定的修正值与规则结算。</p></>}
    {build.subclassId === "illusionist" && <><h3>描述你的幻象</h3><p>说清位置、声音、外观和目的，让主持人判断互动。次级幻象只能产生声音或静止物件影像（强化后可同时），不能制造真实掩护、光照或伤害。对应法术卡已列出实际距离、成分和施法时间。</p></>}
    <footer className="sheet-footer">PHB 2024 · 仅列三级能力 · 按实际选择生成，供线下查阅</footer></article>;
}
