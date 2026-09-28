import { deriveCharacter } from "../rules/engine/deriveCharacter";
import { skillNames, zhCN } from "../translations/zh-CN";
import { useBuilder } from "../store/builder";

export function CharacterPage() {
  const { state, dispatch } = useBuilder();
  const c = deriveCharacter(state.build);
  const main = c.attacks.find((a) => a.weaponId === "greatsword")!;
  return (
    <div className="character-page">
      <header className="character-header"><button className="button secondary" onClick={() => dispatch({ type: "step", step: "review" })}>← 返回检查</button><span>D&D 5R 角色创建器</span></header>
      <section className="character-hero"><div className="eyebrow">你的冒险者</div><h1>{state.build.identity.name}</h1><p>{zhCN.species.dwarf} · {zhCN.class.fighter} 3级 · {zhCN.subclass.champion}</p></section>
      <div className="quick-card">
        <div className="stat-strip"><div><span>HP</span><strong>{c.maxHp}</strong></div><div><span>AC</span><strong>{c.armorClass}</strong></div><div><span>速度</span><strong>{c.speed}尺</strong></div><div><span>先攻</span><strong>+{c.initiative.modifier}</strong><small>优势</small></div></div>
        <section><h2>你最常做什么？</h2><ol className="turn-guide"><li>移动到合适的位置。</li><li>用{zhCN.weapon.greatsword}攻击：<strong>+{main.attackBonus}</strong> 命中，伤害 <strong>{main.damageDice}+{main.damageModifier}</strong>。</li><li>受伤后可用「{zhCN.feature["second-wind"]}」；需要爆发时使用「{zhCN.feature["action-surge"]}」。</li></ol></section>
        <section><h2>关键能力</h2><div className="feature-grid"><div><strong>{zhCN.feature["second-wind"]} ×2</strong><span>附赠动作；三级恢复 1d10+3 HP。</span></div><div><strong>{zhCN.feature["action-surge"]} ×1</strong><span>关键回合获得一个额外动作。</span></div><div><strong>{zhCN.feature["improved-critical"]}</strong><span>武器攻击与徒手打击在 19–20 时重击。</span></div><div><strong>{zhCN.feature["remarkable-athlete"]}</strong><span>先攻与{skillNames.athletics}具有优势。</span></div></div></section>
        <section><h2>武器精通</h2>{c.attacks.map((attack) => <div className="attack-row" key={attack.weaponId}><strong>{zhCN.weapon[attack.weaponId as keyof typeof zhCN.weapon]}</strong><span>+{attack.attackBonus}</span><span>{attack.damageDice}+{attack.damageModifier}</span><span>{zhCN.mastery[attack.mastery!.id as keyof typeof zhCN.mastery]}</span></div>)}</section>
      </div>
      <div className="export-panel"><strong>下一开发节点</strong><span>完整人物卡布局 + 浏览器端 PDF / PNG 导出。</span></div>
    </div>
  );
}
