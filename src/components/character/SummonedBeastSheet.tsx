import type { CharacterBuild, DerivedCharacter } from "../../rules/types";
import { Header } from "./CharacterSheets";
import { signed } from "../../rules/engine/format";

// 召唤灵魄不同于荒野变形、魔宠与原初行侣；二环数据不继承它们的加值。
export function SummonedBeastSheet({ build, c }: { build: CharacterBuild; c: DerivedCharacter }) {
  if (build.classId !== "druid" || !c.spellcasting?.prepared.includes("summon-beast")) return null;
  return <article className="sheet-page" data-sheet-page><Header build={build} title="野兽召唤术 · 灵魄数据" page="召唤附页" /><p className="casting-strip">二环法术 · 动作 · 90 尺内空位 · 专注至多 1 小时</p><h3>施法前准备</h3><p>需要羽毛、毛皮与鱼尾装在价值至少 200 GP 的镀金橡实内，不消耗；起始装备没有赠送此材料，普通法器不能替代。已准备法术不等于已经持有所需材料。</p><h3>共用数据</h3><p>小型野兽 · 中立 · AC 13 · 熟练加值 +2 · 黑暗视觉 60 尺 · 被动察觉 12；理解你说的语言。</p><p>力量 18（+4） · 敏捷 11（+0） · 体质 16（+3） · 智力 4（−3） · 感知 14（+2） · 魅力 5（−3）。没有全部检定／豁免加熟练的原初联结。</p><table className="sheet-attacks"><thead><tr><th>每次召唤选一种</th><th>HP</th><th>移动</th><th>特性</th></tr></thead><tbody><tr><td>陆地灵魄</td><td>30</td><td>步行 30，攀爬 30 尺</td><td>集群战术</td></tr><tr><td>天空灵魄</td><td>20</td><td>步行 30，飞行 60 尺</td><td>飞掠</td></tr><tr><td>水中灵魄</td><td>30</td><td>步行 30，游泳 30 尺</td><td>集群战术；仅能水下呼吸</td></tr></tbody></table><p>集群战术：目标 5 尺内有灵魄未失能的盟友时，它对目标的攻击检定有优势。飞掠：飞离敌人触及范围时不引发借机攻击。</p><h3>撕裂 · 每次攻击动作一次</h3><p>近战攻击 {signed(c.spellcasting.attack)} · 触及 5 尺 · 命中 1d8+6 挥砍伤害。二环只攻击一次；形态外观不授予其他野兽能力。</p><h3>如何行动</h3><p>使用你的先攻，在你的回合之后立即行动。服从你的口头命令，命令不需要动作。没有命令时执行回避动作，并用移动避开危险。</p><h3>结束与记录</h3><p>当前 HP ______ / 上限 ______ · 形态 ______ · 专注开始时间 ______。HP 降至 0 或法术结束时消失；不使用玩家的 HP、荒野变形次数或伙伴复活规则。</p><footer className="sheet-footer">PHB 2024 · 二环野兽灵魄 · 附页不表示角色已经召唤或持有所需材料</footer></article>;
}
