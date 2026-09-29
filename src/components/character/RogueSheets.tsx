import type { CharacterBuild, DerivedCharacter, SkillId } from "../../rules/types";
import type { PlayState } from "../../rules/engine/playState";
import { Header, Stats, Resources } from "./CharacterSheets";
import { SpeciesSummary, OriginSummary } from "./OriginSheets";
import { ABILITIES, SKILLS } from "../../data/core";
import { ROGUE_SUBCLASSES, rogueSpellText } from "../../data/rogue";
import { WEAPONS } from "../../data/weapons";
import { features, itemNames, damageNames, masteryDescriptions } from "../../data/characterDetails";
import { abilityNames, skillNames, masteryName, zhCN } from "../../translations/zh-CN";
import { signed, damageFormula } from "../../rules/engine/format";
import { spell } from "../../data/spells";

// 每种视图使用相同规则数据；条件偷袭与灵能攻击另列，不混进普通武器伤害。
export function RogueSheets({ build, c, play, mode }: { build: CharacterBuild; c: DerivedCharacter; play: PlayState; mode: "quick" | "full" }) {
  const full = mode === "full", r = c.rogue!, soul = r.subclass === "soulknife";
  const ids = ["sneak-attack", "cunning-action", "steady-aim", ...ROGUE_SUBCLASSES[r.subclass].features];
  const spells = c.spellcasting ? [...c.spellcasting.cantrips, ...c.spellcasting.prepared] : [];
  const total = (full ? 4 : 2) + (spells.length ? 1 : 0);
  const head = (title: string, n: number) => <Header build={build} title={title} page={`${n} / ${total}`} />;
  const roll = (value: typeof c.initiative) => <b>{signed(value.modifier)}{value.state === "advantage" ? " 优势" : value.state === "disadvantage" ? " 劣势" : ""}</b>;
  const psiMod = Math.max(c.abilities.dexterity.modifier, c.abilities.strength.modifier);
  return <>
    <article className="sheet-page" data-sheet-page>{head("游荡者 · 行动速查", 1)}<Stats c={c} play={play} />
      <section><h3>一回合怎么做</h3><p>移动 → 一个动作（通常用武器攻击一次）→ 一个附赠动作。远程攻击旁有能看见你且未失能的敌人（5 尺内）时有劣势；超过正常射程也有劣势。</p><p><b>附赠动作选其一：</b>疾走／撤离／躲藏、稳定瞄准、轻型武器额外攻击{r.subclass === "thief" ? "、快手" : soul ? "、第二把念刃" : r.subclass === "arcane-trickster" ? "、施展或控制法师之手" : ""}。另有反应，借机攻击按触发使用。疾走增加本回合可移动距离，撤离让本回合移动不触发借机攻击。</p></section>
      <section><h3>武器攻击 · 尚未计入偷袭</h3><table className="sheet-attacks"><thead><tr><th>武器 / 属性</th><th>命中</th><th>伤害</th><th>精通</th></tr></thead><tbody>{c.attacks.map((a) => <tr key={a.weaponId}><td><b>{itemNames[a.weaponId]}</b><small>{WEAPONS[a.weaponId].properties ?? "近战 5 尺"}{a.range ? ` · ${a.range.join("/")} 尺` : ""}</small>{a.disadvantage && <small>{a.disadvantage}</small>}</td><td>{signed(a.attackBonus)}</td><td>{damageFormula(a.damageDice, a.damageModifier)} {damageNames[a.damageType]}</td><td>{a.mastery?.unlocked ? masteryName(a.mastery.id) : "未解锁"}</td></tr>)}{soul && <tr><td><b>念刃 / 第二把念刃</b><small>灵巧 · 投掷 60/120 尺 · 空手</small></td><td>{signed(psiMod + c.proficiencyBonus)}</td><td>{damageFormula("1d6", psiMod)} / {damageFormula("1d4", psiMod)} 心灵</td><td>侵扰（额外）</td></tr>}</tbody></table></section>
      <section><h3>偷袭 · 2d6</h3><p>{features["sneak-attack"].text}</p><p>重击时武器和偷袭的伤害骰均翻倍，固定加值不翻倍。{r.subclass === "assassin" && "刺客战斗首轮偷袭另加 3 点同类型伤害；不会自动重击。"}</p></section>
      <OriginSummary c={c} /><SpeciesSummary c={c} />{r.climb && <p>梁上君子：攀爬速度 {r.climb} 尺，跳跃可用敏捷替代力量。</p>}
      <footer className="sheet-footer">行动与资源细节见下一页 · 完整技能、装备和故事见完整人物卡</footer>
    </article>
    <article className="sheet-page" data-sheet-page>{head("游荡者 · 能力与资源", 2)}<Resources c={c} play={play} />
      <div className="sheet-features">{ids.filter((id) => id !== "sneak-attack").map((id) => <div key={id}><h3>{features[id].name}</h3><small>{features[id].timing}</small><p>{features[id].text}</p></div>)}</div>
      <section><h3>躲藏速查</h3><p>须在重度遮蔽或四分之三／全身掩护后，且不在任何敌人视线内，以敏捷（隐匿）通过 DC 15。成功时处于躲藏带来的隐形状态；记下检定总值，作为敌人察觉你的 DC。发出高于低语的声音、被敌人发现、作攻击检定或施展有言语成分的法术都会结束躲藏。</p></section><section><h3>精通与轻型武器</h3>{[...new Set([...build.choices.weaponMasteries.map((id) => WEAPONS[id].mastery), ...(soul ? ["vex"] : [])])].map((id) => <p key={id}><b>{masteryName(id)}</b> · {masteryDescriptions[id]}</p>)}<p>轻型额外攻击：用轻型武器执行攻击动作后，同回合以另一把轻型武器附赠攻击一次；伤害不加正的属性调整值。迅击将这次攻击移入攻击动作，每回合限一次，并不再赠送一次附赠攻击。念刃没有轻型词条，其第二击是独立的子职能力。</p></section>
      <footer className="sheet-footer">三级没有诡诈打击、直觉闪避、反射闪避或可靠才能 · 条件、持续时间由玩家记录</footer>
    </article>
    {full && <>
      <article className="sheet-page" data-sheet-page>{head("游荡者 · 属性与技能", 3)}<div className="sheet-abilities">{ABILITIES.map((id) => <div key={id}><small>{abilityNames[id]}</small><b>{c.abilities[id].score}</b><span>{signed(c.abilities[id].modifier)}</span></div>)}</div><div className="sheet-columns"><section><h3>豁免</h3><div className="sheet-rolls">{ABILITIES.map((id) => <div key={id}><span>{c.savingThrows[id].proficiency === "proficient" ? "●" : "○"} {abilityNames[id]}</span>{roll(c.savingThrows[id])}</div>)}</div><h3>护甲、武器与工具</h3><p>轻甲受训；简易武器及带灵巧或轻型词条的军用武器熟练。</p><p>工具熟练：{c.tools.map((id) => itemNames[id] ?? id).join("、")}。工具检定属性按用途确定，熟练加值 +2；适用的技能和工具同时熟练时，按规则可获得优势，不重复加两次熟练。</p><h3>语言</h3><p>{c.languages.map((id) => zhCN.language[id as keyof typeof zhCN.language]).join("、")}</p><SpeciesSummary c={c} /></section><section><h3>全部技能 · ◆ 专精 / ● 熟练</h3><div className="sheet-rolls">{(Object.keys(SKILLS) as SkillId[]).map((id) => <div key={id}><span>{c.skills[id].proficiency === "expertise" ? "◆" : c.skills[id].proficiency === "proficient" ? "●" : "○"} {skillNames[id]}</span>{roll(c.skills[id])}</div>)}</div></section></div><footer className="sheet-footer">专精选自已熟练技能；重复熟练不自动变为专精 · 种族条件豁免见起源附页</footer></article>
      <article className="sheet-page" data-sheet-page>{head("游荡者 · 装备与身份", 4)}<div className="sheet-columns"><section><h3>起始装备与金币</h3><div className="sheet-rolls">{c.equipment.map((e) => <div key={e.id}><span>{itemNames[e.id] ?? e.id}</span><b>× {e.quantity}</b></div>)}</div><p>皮甲已着装。消耗品使用、弹药回收与后续购物由玩家记录。</p></section><section><h3>窃贼套组</h3><p>背包、滚珠、铃铛、10 支蜡烛、撬棍、附盖提灯、7 瓶油、5 日口粮、绳索、火绒盒、水袋。</p><h3>技能与动作</h3><p>开锁／解除陷阱需要可用的盗贼工具。具体 DC、是否存在陷阱及能否尝试，由主持人判定。工具不自动提供毒药或消耗材料。</p>{c.spellcasting && <><h3>施法准备</h3><p>起始包不赠送法器或材料包。奥术法器可替代未标价且不消耗的材料；其他材料须准备实物。轻甲已受训，可施法；持武器时留意姿势与材料所需的手。</p></>}</section></div><section className="sheet-story"><h3>角色身份</h3><p>{build.identity.gender || "性别未填写"} · {build.identity.age ?? "—"} 岁 · {build.identity.personalityTraits?.join("、") || "性格未填写"}</p><h4>外貌</h4><p>{build.identity.appearance || "—"}</p><h4>故事</h4><p>{build.identity.description || "—"}</p></section><footer className="sheet-footer">起源法术和能力另附 · 未自动赠送当前装备表之外的物品</footer></article>
    </>}
    {!!spells.length && <article className="sheet-page" data-sheet-page>{head("诡术师 · 职业法术", total)}<p className="casting-strip">智力施法 · 攻击 {signed(c.spellcasting!.attack)} · DC {c.spellcasting!.dc} · 一环法术位 {play.remaining["spell-slot-1"]} / 2</p><div className="spell-card-grid">{spells.map((id) => { const s = spell(id)!; return <section className="spell-card" key={id}><h3>{s.name} <small>{s.level ? "一环" : "戏法"} · {s.school}</small></h3><p><b>{id === "mage-hand" ? "附赠动作（也可用动作）" : s.time}</b> · {s.range}<br />{s.components}<br />{s.concentration ? "专注 · " : ""}{s.duration}{s.ritual ? " · 可仪式" : ""}</p><p>{rogueSpellText(s)}</p></section>; })}</div><footer className="sheet-footer">仪式额外耗时 10 分钟且不耗法术位；仍需准备与成分。一次只维持一个专注；受伤时体质豁免 DC 为 10 与伤害一半向下取整取高值，上限 30。一个回合最多消耗一个法术位施法。</footer></article>}
  </>;
}
