import { BuilderShell } from "../components/builder/BuilderShell";
import { deriveCharacter } from "../rules/engine/deriveCharacter";
import { validateBuild } from "../rules/validator/validateBuild";
import { abilityNames, alignmentNames, zhCN } from "../translations/zh-CN";
import { useBuilder } from "../store/builder";

export function ReviewPage() {
  const { state } = useBuilder();
  const derived = deriveCharacter(state.build);
  const validation = validateBuild(state.build);
  return (
    <BuilderShell previous="identity" next="character" nextLabel="创建角色" nextDisabled={!validation.canGenerate}>
      <section className="page-head"><h1>检查你的角色</h1><p>确认数据后即可生成人物卡。Warning 不会阻止合法角色。</p></section>
      <div className="review-hero"><h2>{state.build.identity.name || "（尚未填写姓名）"}</h2><p>{zhCN.species.dwarf} · {zhCN.class.fighter} 3级 · {zhCN.subclass.champion}</p><p>{zhCN.background.soldier}{state.build.identity.alignment ? ` · ${alignmentNames[state.build.identity.alignment]}` : ""}</p></div>
      <div className="stat-strip"><div><span>HP</span><strong>{derived.maxHp}</strong></div><div><span>AC</span><strong>{derived.armorClass}</strong></div><div><span>速度</span><strong>{derived.speed}尺</strong></div><div><span>熟练</span><strong>+{derived.proficiencyBonus}</strong></div></div>
      <div className="ability-cards">{Object.entries(derived.abilities).map(([id, data]) => <div key={id}><span>{abilityNames[id as keyof typeof abilityNames]}</span><strong>{data.score}</strong><small>{data.modifier >= 0 ? "+" : ""}{data.modifier}</small></div>)}</div>
      <section className="section"><h2>检查结果</h2>{validation.messages.length === 0 ? <div className="success-panel">✓ 角色完整、规则合法且当前 V1 支持生成。</div> : <div className="message-list">{validation.messages.map((m) => <div className={`validation ${m.severity}`} key={m.id}><strong>{m.severity === "blocker" ? "需要处理" : m.severity === "warning" ? "建议" : "提示"}</strong><span>{m.message}</span></div>)}</div>}</section>
      <section className="section"><h2>主要攻击</h2>{derived.attacks.map((attack) => <div className="attack-row" key={attack.weaponId}><strong>{zhCN.weapon[attack.weaponId as keyof typeof zhCN.weapon]}</strong><span>命中 +{attack.attackBonus}</span><span>{attack.damageDice}+{attack.damageModifier}</span><span>{attack.mastery?.unlocked ? `精通：${zhCN.mastery[attack.mastery.id as keyof typeof zhCN.mastery]}` : ""}</span></div>)}</section>
    </BuilderShell>
  );
}
