import type { CharacterBuild, DerivedCharacter } from "../../rules/types";
import { Header } from "./CharacterSheets";

// 形态在施法时选择；附上已核对的常用形态及空白记录，不替玩家自动召唤。
export function FamiliarSheet({ build, c }: { build: CharacterBuild; c: DerivedCharacter }) {
  if (!c.innateMagic.some((m) => m.spells.includes("find-familiar"))) return null;
  return <article className="sheet-page" data-sheet-page><Header build={build} title="寻获魔宠 · 随行记录" page="魔宠 1 / 1" />
    <section><h3>施法与形态</h3><p>寻获魔宠需要消耗价值至少 10 GP 的燃烧香料，施法 1 小时（仪式再加 10 分钟），全程需专注。起始装备通常没有该材料；免费次数不免除材料。形态可选蝙蝠、猫、蛙、隼、蜥蜴、章鱼、猫头鹰、鼠、渡鸦、蜘蛛、鼬或其他 CR 0 野兽。下方提供猫的速查，其他形态需使用对应数据卡。</p><p>选择生物类型：□ 天族　□ 妖精　□ 邪魔。形态：________　名字：________。</p></section>
    <section><h3>常用形态 · 猫（MM 2025）</h3><p>微型 · AC 12 · HP 2（1d4）· 先攻 +2 · 步行 40 尺、攀爬 40 尺。</p><table className="sheet-attacks"><thead><tr><th>属性</th><th>数值</th><th>调整值</th><th>豁免</th></tr></thead><tbody>{[["力量",3,-4,-4],["敏捷",15,2,4],["体质",10,0,0],["智力",3,-4,-4],["感知",12,1,1],["魅力",7,-2,-2]].map(([name, value, mod, save]) => <tr key={name}><td>{name}</td><td>{value}</td><td>{mod}</td><td>{save}</td></tr>)}</tbody></table><p>察觉 +3、隐匿 +4；黑暗视觉 60 尺，被动察觉 13。猫跃：使用敏捷而非力量决定跳跃距离。魔宠不能攻击，因此不使用猫的爪挠动作。</p></section>
    <section><h3>独立回合与联系</h3><p>魔宠单独掷先攻、独立行动并服从命令，可移动、帮助、回避等，但不能攻击。100 尺内可心灵交流；用附赠动作借用其视觉和听觉至你下回合开始，并享受其特殊感官。你施展触碰法术时，100 尺内魔宠可用自己的反应传递法术。</p><p>你可以用魔法动作暂时解散到口袋位面，或永久解散。暂时解散后，用魔法动作在你 30 尺内未占据处召回。0 HP 时消失，再施法才能回来；0 HP 消失或进入口袋位面时留下携带物品。只能有一只，已有时重施可更换形态。</p></section>
    <section><h3>桌面记录</h3><p>当前 HP：____ / ____　临时 HP：____　先攻：____　反应：□ 可用。</p><p>当前状态：□ 随行　□ 暂时解散　□ 0 HP 消失　□ 永久解散。</p><p>其他形态 AC：____　速度：____________　感官：____________。</p></section>
    <footer className="sheet-footer">本附页不把魔宠视为已召出 · 其他形态的全部数据仍以对应 MM 2025 卡为准</footer>
  </article>;
}
