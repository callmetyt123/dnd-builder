import { OriginSummary } from "./OriginSheets";
import type { CharacterBuild, DerivedCharacter, SkillId } from "../../rules/types";
import type { PlayState } from "../../rules/engine/playState";
import { deriveWarlockPlay, warlockCantrip } from "../../rules/engine/warlock";
import { FIEND_SPELLS, invocation } from "../../data/warlock";
import { PACT_EFFECTS } from "../../data/warlockSpells";
import { spell } from "../../data/spells";
import { features, itemNames, damageNames } from "../../data/characterDetails";
import { ABILITIES, SKILLS } from "../../data/core";
import { abilityNames, skillNames, zhCN } from "../../translations/zh-CN";
import { signed, damageFormula } from "../../rules/engine/format";
import { Header, Stats, Resources } from "./CharacterSheets";

export function WarlockSheets({ build, c: base, play, mode }: { build: CharacterBuild; c: DerivedCharacter; play: PlayState; mode: "quick" | "full" }) {
  const c = deriveWarlockPlay(base, play);
  const pact = c.pactMagic!;
  const casting = c.spellcasting!;
  const full = mode === "full";
  const ids = [...new Set([...casting.cantrips, ...casting.prepared, ...pact.atWill])];
  const spellPages = Array.from({ length: Math.ceil(ids.length / 6) }, (_, i) => ids.slice(i * 6, i * 6 + 6));
  const total = (full ? 3 : 1) + spellPages.length;
  // 屏幕预览和导出共用分页与派生数值；不把祈唤随意施法计入职业准备名额。
  const header = (title: string, page: number) => <Header build={build} title={title} page={`${page} / ${total}`} />;
  const invocationList = <section><h3>已选魔能祈唤</h3>{pact.invocations.map((v, i) => <p key={i}><b>{invocation(v.id)?.name}{v.target ? `（${spell(v.target)?.name}）` : ""}</b> · {invocation(v.id)?.text}</p>)}</section>;
  return <>
    <article className="sheet-page" data-sheet-page>{header(full ? "完整人物卡 · 核心数值" : "契约魔法 · 战斗速查", 1)}<Stats c={c} play={play} /><p className="casting-strip">魅力施法 · 攻击 {signed(casting.attack)} · DC {casting.dc} · 契约法术位均为二环{play.incapacitated ? " · 当前失能" : ""}</p>
      <div className="sheet-abilities">{ABILITIES.map((id) => <div key={id}><small>{abilityNames[id]}</small><b>{c.abilities[id].score}</b><span>{signed(c.abilities[id].modifier)}</span></div>)}</div>
      {full && <div className="sheet-columns"><section><h3>豁免 · ● 熟练</h3><div className="sheet-rolls">{ABILITIES.map((id) => <div key={id}><span>{c.savingThrows[id].proficiency !== "none" ? "●" : "○"} {abilityNames[id]}</span><b>{signed(c.savingThrows[id].modifier)}</b></div>)}</div><p>轻甲训练；简易武器熟练，无武器精通。毒素伤害抗性；避免或结束中毒状态的豁免具有优势。</p><p>黑暗视觉 120 尺 · 被动察觉 {c.passivePerception} · 中型类人生物。</p></section><section><h3>全部技能 · ● 熟练</h3><div className="sheet-rolls">{(Object.keys(SKILLS) as SkillId[]).map((id) => <div key={id}><span>{c.skills[id].proficiency === "proficient" ? "●" : "○"} {skillNames[id]}</span><b>{signed(c.skills[id].modifier)}</b></div>)}</div></section></div>}
      <section><h3>攻击速查</h3>{casting.cantrips.map((id) => { const effect = warlockCantrip(c, id); return effect && <p key={id}><b>{spell(id)?.name}</b> · {effect.attack ? `远程法术攻击 ${signed(casting.attack)}` : `智力豁免 DC ${casting.dc}`} · {effect.damage} · {effect.range} 尺{effect.push ? " · 命中大型或更小生物可推离至多 10 尺" : ""}</p>; })}{c.attacks.map((a) => <p key={a.weaponId}><b>{itemNames[a.weaponId]}</b> · 命中 {signed(a.attackBonus)} · {damageFormula(a.damageDice, a.damageModifier)} {damageNames[a.damageType]}{a.range ? ` · 投掷 ${a.range.join(" / ")} 尺` : " · 近战 5 尺"}</p>)}</section>
      {!full && <><Resources c={c} play={play} /><OriginSummary c={c} /><p><b>黑暗赐福：</b>{pact.darkBlessing} 临时 HP；你使敌人降至 0 HP，或别人使你 10 尺内敌人降至 0 HP 时触发。临时 HP 不叠加。</p></>}
      <p className="sheet-note">维持专注的体质豁免 {signed(c.savingThrows.constitution.modifier)}{pact.concentrationAdvantage ? "，具有优势（魔能意志，仅限维持专注）" : ""}。受伤 DC = max(10, 伤害一半向下取整)，上限 30；临时 HP 吸收伤害仍须检定。失能终止专注。{pact.devilsSight ? "魔鬼视界：120 尺内正常看穿魔法与非魔法的黑暗和微光。" : "普通黑暗视觉不能看穿黑暗术。"}</p>
      <footer className="sheet-footer">三级魔能爆仅一道射线。脆弱诅咒只在攻击检定命中时加伤，不适用于心灵之楔。{play.agathys ? "黯冰狱铠生效：近战命中你的攻击者受 10 寒冷伤害；期限由玩家跟踪。" : "黯冰狱铠未生效。"}</footer>
    </article>
    {full && <article className="sheet-page" data-sheet-page>{header("完整人物卡 · 能力与资源", 2)}<Resources c={c} play={play} /><div className="sheet-features">{c.features.map((id) => <div key={id}><b>{features[id]?.name}</b><small>{features[id]?.timing}</small><p>{features[id]?.text}</p></div>)}</div>{invocationList}<footer className="sheet-footer">黑暗赐福当前提供 {pact.darkBlessing} 临时 HP。三级尚无六级的黑暗强运。</footer></article>}
    {full && <article className="sheet-page" data-sheet-page>{header("完整人物卡 · 装备与身份", 3)}<div className="sheet-columns"><section><h3>起始装备 · 两个包 A 合并</h3><div className="sheet-rolls">{c.equipment.map((e) => <div key={e.id}><span>{itemNames[e.id] ?? e.id}</span><b>× {e.quantity}</b></div>)}</div><p>当前护甲：{c.armorNote}。装备变化和消耗品由玩家另行记录。</p></section><section><h3>语言与工具</h3><p>{c.languages.map((id) => zhCN.language[id as keyof typeof zhCN.language]).join("、")}</p><p>工具熟练：{c.tools.map((id) => itemNames[id] ?? id).join("、")}。</p><h3>施法成分</h3><p>奥术宝珠可以替代无标价且不消耗的材料；神秘学书籍不是法师法术书。言语需能出声，姿势需自由手；兼有姿势与材料时可用持法器的手完成。祈唤随意施法仍需正常成分。</p><h3>学者套组</h3><p>背包、书籍、墨水、墨水笔、油灯、10 瓶油、10 张羊皮纸、火绒盒。</p></section></div><section className="sheet-story"><h3>身份</h3><p>{build.identity.gender || "性别未填写"} · {build.identity.age ?? "—"} 岁 · {build.identity.personalityTraits?.join("、") || "性格未填写"}</p><h4>外貌</h4><p>{build.identity.appearance || "—"}</p><h4>故事</h4><p>{build.identity.description || "—"}</p></section></article>}
    {spellPages.map((spells, i) => <article className="sheet-page" data-sheet-page key={i}>{header("魔契师法术与祈唤", (full ? 4 : 2) + i)}<p className="casting-strip">魅力 · 攻击 {signed(casting.attack)} · DC {casting.dc} · 契约法术使用二环位；祈唤法术不消耗法术位</p>{!full && i === spellPages.length - 1 && invocationList}<div className="spell-card-grid">{spells.map((id) => { const s = spell(id)!; const atWill = pact.atWill.includes(id); const effect = warlockCantrip(c, id); return <section className="spell-card" key={id}><h3>{s.name} <small>{s.level === 0 ? "戏法" : `原 ${s.level} 环`} · {s.school}</small></h3><div className="spell-source">{atWill ? "祈唤 · 一环随意施展" : FIEND_SPELLS.includes(id) ? "宗主 · 始终准备 · 二环施展" : s.level === 0 ? "职业戏法" : "职业准备 · 二环施展"}</div><p><b>{s.time}</b> · {effect ? `${effect.range} 尺` : s.range}<br />{s.components}<br />{s.concentration ? "专注 · " : ""}{id === "hex" ? "4 小时（二环）" : s.duration}</p><p>{s.text}</p>{effect && <p><b>当前祈唤效果：</b>{effect.damage}{effect.push ? "；命中大型或更小生物可沿直线推离至多 10 尺" : ""}。</p>}{!atWill && PACT_EFFECTS[id] && <p><b>实际二环效果：</b>{PACT_EFFECTS[id]}</p>}{id === "false-life" && <p><b>邪魔活力：</b>骰取最大值，获得 12 临时 HP，不与已有临时 HP 叠加。</p>}</section>; })}</div><footer className="sheet-footer">施法按钮扣位；伤害掷骰、目标豁免、专注和持续时间由玩家记录。一回合只能消耗一个法术位施法。</footer></article>)}
  </>;
}
