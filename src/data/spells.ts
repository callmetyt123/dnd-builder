import { WARLOCK_SPELLS } from "./warlockSpells";
import { DRUID_SPELLS } from "./druidSpells";
export interface Spell {
  id: string; name: string; level: 0 | 1 | 2; school: string;
  time: string; range: string; components: string; duration: string;
  concentration?: boolean; ritual?: boolean; text: string;
}
// 仅收录本次核对过的 2024 法师法术；摘要保留触发、豁免和持续条件。
const entries: Spell[] = [
  { id: "fire-bolt", name: "火焰箭", level: 0, school: "塑能", time: "动作", range: "120 尺", components: "V、S", duration: "立即", text: "对生物或物件作远程法术攻击；命中造成 1d10 火焰伤害。未被携带或着装的易燃物件会被点燃。" },
  { id: "ray-of-frost", name: "冷冻射线", level: 0, school: "塑能", time: "动作", range: "60 尺", components: "V、S", duration: "立即", text: "对生物作远程法术攻击；命中造成 1d8 寒冷伤害，并使速度 −10 尺，至你的下回合开始。" },
  { id: "shocking-grasp", name: "电爪", level: 0, school: "塑能", time: "动作", range: "触碰", components: "V、S", duration: "立即", text: "对生物作近战法术攻击；命中造成 1d8 闪电伤害。目标至其下回合开始不能进行借机攻击。" },
  { id: "light", name: "光亮术", level: 0, school: "塑能", time: "动作", range: "触碰", components: "V、M（萤火虫或磷光苔藓）", duration: "1 小时", text: "触碰至多大型、未被他人携带或着装的物件，使其发出 20 尺明亮光照和额外 20 尺微光。不透明遮挡物能挡住光；再次施法结束旧效果。" },
  { id: "mage-hand", name: "法师之手", level: 0, school: "咒法", time: "动作", range: "30 尺", components: "V、S", duration: "1 分钟", text: "召出幽灵手并操控物件、开未锁容器或取放物品；以后用魔法动作操控并移动至多 30 尺。承重至多 10 磅，不能攻击或激活魔法物品。离你超过 30 尺或再次施法即消失。" },
  { id: "prestidigitation", name: "魔法伎俩", level: 0, school: "变化", time: "动作", range: "10 尺", components: "V、S", duration: "至多 1 小时", text: "创造无害感官效果；点熄蜡烛、火把或小篝火；清洁或弄脏至多 1 立方尺物件；为同体积非活物调温调味或留下标记（1 小时）；造手掌大小的无价值小饰品或幻影至下回合结束。至多维持 3 个非即时效果。" },
  { id: "alarm", name: "警报术", level: 1, school: "防护", time: "1 分钟", range: "30 尺", components: "V、S、M（铃铛和银线）", duration: "8 小时", ritual: true, text: "为门、窗或至多 20 尺立方区域设警报，指定可豁免者。微型或更大生物触碰或进入时触发。选精神警报（1 英里内通知你并唤醒），或响铃（60 尺内可闻，持续 10 秒）。" },
  { id: "detect-magic", name: "侦测魔法", level: 1, school: "预言", time: "动作", range: "自身（30 尺）", components: "V、S", duration: "至多 10 分钟", ritual: true, concentration: true, text: "感知范围内魔法效应；用魔法动作查看可见生物或物件上的灵光，并辨识法术学派。1 尺石、土或木，1 寸金属，或薄铅层会阻挡侦测。" },
  { id: "feather-fall", name: "羽落术", level: 1, school: "变化", time: "反应：你或 60 尺内可见生物坠落", range: "60 尺", components: "V、M（小羽毛或羽绒）", duration: "1 分钟", text: "选择至多 5 名坠落生物，使其每轮下降 60 尺。期间落地不受坠落伤害，随后该目标的效果结束。" },
  { id: "grease", name: "油腻术", level: 1, school: "咒法", time: "动作", range: "60 尺", components: "V、S、M（猪皮或黄油）", duration: "1 分钟", text: "10 尺方形地面成为困难地形。出现时区域内生物，以及以后进入或在内结束回合的生物，敏捷豁免失败则倒地。油脂不可燃。" },
  { id: "magic-missile", name: "魔法飞弹", level: 1, school: "塑能", time: "动作", range: "120 尺", components: "V、S", duration: "立即", text: "3 枚飞弹同时击中你指定的可见生物，可分配目标；每枚造成 1d4+1 力场伤害，无需攻击检定。二环施展为 4 枚。" },
  { id: "shield", name: "护盾术", level: 1, school: "防护", time: "反应：被攻击命中或成为魔法飞弹目标", range: "自身", components: "V、S", duration: "至你的下回合开始", text: "AC +5，包含触发这次施法的攻击；期间不受魔法飞弹伤害。此加值未计入常驻 AC。" },
  { id: "sleep", name: "睡眠术", level: 1, school: "惑控", time: "动作", range: "60 尺", components: "V、S、M（细沙或玫瑰花瓣）", duration: "至多 1 分钟", concentration: true, text: "选择 5 尺半径球内的生物：感知豁免失败则失能，至其下回合结束；届时再豁免，失败则昏迷至法术结束。伤害或 5 尺内生物用动作摇醒可结束效果。不需睡眠或免疫力竭者自动成功。" },
  { id: "thunderwave", name: "雷鸣波", level: 1, school: "塑能", time: "动作", range: "自身（15 尺立方）", components: "V、S", duration: "立即", text: "区域内生物体质豁免，失败受 2d8 雷鸣伤害并被推离 10 尺；成功半伤且不推开。未固定物件也被推开，300 尺内可闻巨响。二环伤害 3d8。" },
  { id: "mage-armor", name: "法师护甲", level: 1, school: "防护", time: "动作", range: "触碰", components: "V、S、M（鞣制皮革）", duration: "8 小时", text: "自愿且未穿护甲的生物基础 AC 变为 13 + 敏捷调整值；穿甲后提前结束。需实际施展后才能使用该 AC。" },
  { id: "burning-hands", name: "燃烧之手", level: 1, school: "塑能", time: "动作", range: "自身（15 尺锥形）", components: "V、S", duration: "立即", text: "范围内生物敏捷豁免：失败受 3d6 火焰伤害，成功半伤。点燃未被携带或着装的易燃物件。二环伤害 4d6。" },
  { id: "misty-step", name: "迷踪步", level: 2, school: "咒法", time: "附赠动作", range: "自身", components: "V", duration: "立即", text: "传送到至多 30 尺内可见、未被占据的空间。此回合已消耗法术位后，不能再消耗另一个法术位施法。" },
  { id: "web", name: "蛛网术", level: 2, school: "咒法", time: "动作", range: "60 尺", components: "V、S、M（少量蛛网）", duration: "至多 1 小时", concentration: true, text: "20 尺立方蛛网造成困难地形和轻度遮蔽；需固体支撑，否则下回合开始塌落。回合首次进入或在内开始回合时作敏捷豁免，失败束缚；用动作作力量（运动）对抗法术 DC 可挣脱，离网亦解除。5 尺立方蛛网遇火在一轮内烧尽，在火中开始回合者受 2d4 火焰伤害。" },
  { id: "scorching-ray", name: "灼热射线", level: 2, school: "塑能", time: "动作", range: "120 尺", components: "V、S", duration: "立即", text: "发射 3 条射线，可分配给不同目标。每条各作一次远程法术攻击，命中造成 2d6 火焰伤害。强力戏法不适用于此法术。" },
  { id: "shatter", name: "粉碎音波", level: 2, school: "塑能", time: "动作", range: "60 尺（10 尺半径球）", components: "V、S、M（云母片）", duration: "立即", text: "区域内生物体质豁免：失败受 3d8 雷鸣伤害，成功半伤；构装生物豁免有劣势。未被携带或着装的非魔法物件同样受伤害。会伤及范围内盟友。" },
];
export const SPELLS: Record<string, Spell> = Object.fromEntries([...entries, ...DRUID_SPELLS, ...WARLOCK_SPELLS].map((s) => [s.id, s]));
export const SPELL_LIST = entries;
export const spell = (id: string): Spell | undefined => Object.prototype.hasOwnProperty.call(SPELLS, id) ? SPELLS[id] : undefined;
export const spellSource = (level: number) => `https://5echm.kagangtuya.top/topics/玩家手册2024/法术详述/${level}环.htm`;
