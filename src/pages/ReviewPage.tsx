import { STEP_NAMES } from "../rules/guides/onboarding";
import { itemNames } from "../data/characterDetails";
import { SPECIES } from "../data/species";
import { BuilderShell } from "../components/builder/BuilderShell";
import { deriveCharacter } from "../rules/engine/deriveCharacter";
import { validateBuild } from "../rules/validator/validateBuild";
import { abilityNames, alignmentNames, masteryName, zhCN } from "../translations/zh-CN";
import { signed, damageFormula } from "../rules/engine/format";
import { useBuilder, type BuilderStep } from "../store/builder";

export function ReviewPage() {
  const { state, dispatch } = useBuilder();
  const derived = deriveCharacter(state.build);
  const validation = validateBuild(state.build);
  const required = validation.messages.filter((m) => m.severity === "blocker");
  const optional = validation.messages.filter((m) => m.severity !== "blocker");
  const messages = (items: typeof validation.messages) => <div className="message-list">{items.map((m) => <div className={`validation ${m.severity}`} key={m.id}><span>{m.message}</span>{m.targetStep && <button className="button secondary" onClick={() => dispatch({ type: "step", step: m.targetStep as BuilderStep })}>去{STEP_NAMES[m.targetStep] ?? m.targetStep}页修改</button>}</div>)}</div>;
  return (
    <BuilderShell previous="identity" next="character" nextLabel="创建角色" nextDisabled={!validation.canGenerate}>
      <section className="page-head"><h1>检查你的角色</h1><p>确认数据后即可生成人物卡。建议提示不会阻止合法角色。</p></section>
      <div className="review-hero"><h2>{state.build.identity.name || "（尚未填写姓名）"}</h2><p>{SPECIES[state.build.speciesId].name} · {zhCN.class[state.build.classId]} 3级 · {zhCN.subclass[state.build.subclassId]}</p><p>{zhCN.background[state.build.backgroundId]}{state.build.identity.alignment ? ` · ${alignmentNames[state.build.identity.alignment]}` : ""}</p></div>
      <div className="stat-strip"><div><span>HP</span><strong>{derived.maxHp}</strong></div><div><span>AC</span><strong>{derived.armorClass}</strong></div><div><span>速度</span><strong>{derived.speed}尺</strong></div><div><span>熟练</span><strong>+{derived.proficiencyBonus}</strong></div></div>
      <div className="ability-cards">{Object.entries(derived.abilities).map(([id, data]) => <div key={id}><span>{abilityNames[id as keyof typeof abilityNames]}</span><strong>{data.score}</strong><small>{data.modifier >= 0 ? "+" : ""}{data.modifier}</small></div>)}</div>
      <section className="section" aria-label="必须完成"><h2>必须完成 · {required.length} 项</h2>{required.length ? <><p>逐项补齐后即可创建。修改后可用页面底部的「查看检查清单」回到这里。</p>{messages(required)}</> : <div className="success-panel">✓ 必填项齐全，符合当前已支持的三级规则，可以创建角色。</div>}</section>
      <section className="section" aria-label="可选建议"><h2>可选建议 · {optional.length} 项</h2><p>这些建议不影响创建。你可以保留喜欢的合法搭配。</p>{optional.length > 0 && messages(optional)}</section>
      {derived.spellcasting && <section className="success-panel">法术攻击 {signed(derived.spellcasting.attack)} · 豁免 DC {derived.spellcasting.dc} · {state.build.classId === "rogue" ? "诡术师 · 3 道戏法 / 3 道一环准备法术" : state.build.classId === "ranger" ? "职业准备 4 道 + 猎人印记 · 原初行侣" : state.build.classId === "warlock" ? "职业准备 4 道 + 宗主法术 4 道 · 魔能祈唤 3 项" : state.build.classId === "druid" ? "职业准备 6 道 + 始终准备 3 道 · 已知形态 4 种" : `法术书 ${derived.spellcasting.book.length} 道 · 职业准备 ${derived.spellcasting.prepared.length}/6`} · {derived.rogue ? "一环法术位：2 个" : derived.primalCompanion ? "一环法术位：3 个" : derived.pactMagic ? "契约法术位：2 个，均为二环" : "法术位：一环 4 / 二环 2"}</section>}
      {derived.innateMagic.map((magic) => <section className="muted-panel" key={magic.source}>{magic.source} · {abilityNames[magic.ability]}施法 · 攻击 {signed(magic.attack)} · DC {magic.dc} · {magic.cantrips.length} 道戏法{magic.spells.length ? `，一道一环法术、每长休免费 ${magic.freeUses} 次` : ""}，独立于职业名额。</section>)}
      <section className="section"><h2>主要攻击</h2>{derived.attacks.map((attack) => <div className="attack-row" key={attack.weaponId}><strong>{itemNames[attack.weaponId] ?? attack.weaponId}</strong><span>命中 {signed(attack.attackBonus)}</span><span>{damageFormula(attack.damageDice, attack.damageModifier)}</span><span>{attack.mastery?.unlocked ? `精通：${masteryName(attack.mastery.id)}` : ""}</span></div>)}</section>
    </BuilderShell>
  );
}
