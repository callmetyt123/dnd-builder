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
  return (
    <BuilderShell previous="identity" next="character" nextLabel="创建角色" nextDisabled={!validation.canGenerate}>
      <section className="page-head"><h1>检查你的角色</h1><p>确认数据后即可生成人物卡。建议提示不会阻止合法角色。</p></section>
      <div className="review-hero"><h2>{state.build.identity.name || "（尚未填写姓名）"}</h2><p>{zhCN.species.dwarf} · {zhCN.class[state.build.classId]} 3级 · {zhCN.subclass[state.build.subclassId]}</p><p>{zhCN.background[state.build.backgroundId]}{state.build.identity.alignment ? ` · ${alignmentNames[state.build.identity.alignment]}` : ""}</p></div>
      <div className="stat-strip"><div><span>HP</span><strong>{derived.maxHp}</strong></div><div><span>AC</span><strong>{derived.armorClass}</strong></div><div><span>速度</span><strong>{derived.speed}尺</strong></div><div><span>熟练</span><strong>+{derived.proficiencyBonus}</strong></div></div>
      <div className="ability-cards">{Object.entries(derived.abilities).map(([id, data]) => <div key={id}><span>{abilityNames[id as keyof typeof abilityNames]}</span><strong>{data.score}</strong><small>{data.modifier >= 0 ? "+" : ""}{data.modifier}</small></div>)}</div>
      <section className="section"><h2>检查结果</h2>{validation.messages.length === 0 ? <div className="success-panel">✓ 角色完整、规则合法且当前 V1 支持生成。</div> : <div className="message-list">{validation.messages.map((m) => <div className={`validation ${m.severity}`} key={m.id}><strong>{m.severity === "blocker" ? "需要处理" : m.severity === "warning" ? "建议" : "提示"}</strong><span>{m.message}</span>{m.targetStep && <button className="button secondary" onClick={() => dispatch({ type: "step", step: m.targetStep as BuilderStep })}>前往修改</button>}</div>)}</div>}</section>
      {derived.spellcasting && <section className="success-panel">法术攻击 {signed(derived.spellcasting.attack)} · 豁免 DC {derived.spellcasting.dc} · {state.build.classId === "ranger" ? "职业准备 4 道 + 猎人印记 · 原初行侣" : state.build.classId === "warlock" ? "职业准备 4 道 + 宗主法术 4 道 · 魔能祈唤 3 项" : state.build.classId === "druid" ? "职业准备 6 道 + 始终准备 3 道 · 已知形态 4 种" : `法术书 ${derived.spellcasting.book.length} 道 · 职业准备 ${derived.spellcasting.prepared.length}/6`} · {derived.primalCompanion ? "一环法术位：3 个" : derived.pactMagic ? "契约法术位：2 个，均为二环" : "法术位：一环 4 / 二环 2"}</section>}
      {derived.originMagic && <section className="muted-panel">背景魔法学徒 · {abilityNames[derived.originMagic.ability]}施法 · 攻击 {signed(derived.originMagic.attack)} · DC {derived.originMagic.dc} · 两道戏法与一道一环法术，独立于职业名额。</section>}
      <section className="section"><h2>主要攻击</h2>{derived.attacks.map((attack) => <div className="attack-row" key={attack.weaponId}><strong>{zhCN.weapon[attack.weaponId as keyof typeof zhCN.weapon]}</strong><span>命中 {signed(attack.attackBonus)}</span><span>{damageFormula(attack.damageDice, attack.damageModifier)}</span><span>{attack.mastery?.unlocked ? `精通：${masteryName(attack.mastery.id)}` : ""}</span></div>)}</section>
    </BuilderShell>
  );
}
