import type { Spell } from "./spells";

// 结社和德鲁伊语提供的法术不占六个准备名额；兽形例外仅来自结社。
export const MOON_SPELLS = ["starry-wisp", "cure-wounds", "moonbeam"];
export const DRUID_ALWAYS = ["speak-with-animals", "cure-wounds", "moonbeam"];
export const DRUID_CANTRIPS = ["guidance", "druidcraft", "thorn-whip"];
export const DRUID_PREPARABLE = ["healing-word", "entangle", "faerie-fire", "detect-magic", "thunderwave", "goodberry", "lesser-restoration", "spike-growth"];
export const DRUID_SPELLS: Spell[] = [
  { id: "guidance", name: "神导术", level: 0, school: "预言", time: "动作", range: "触碰", components: "V、S", duration: "至多 1 分钟", concentration: true, text: "触碰自愿生物并选择一项技能；持续期间该技能的属性检定获得 1d4 加值。" },
  { id: "druidcraft", name: "德鲁伊伎俩", level: 0, school: "变化", time: "动作", range: "30 尺", components: "V、S", duration: "立即", text: "选择一项：用持续一轮的感官效应预报当地未来 24 小时天气；让花、种子或叶蕾开放；创造 5 尺立方内无害的感官效应；点熄蜡烛、火把或小篝火。" },
  { id: "thorn-whip", name: "荆棘之鞭", level: 0, school: "变化", time: "动作", range: "30 尺", components: "V、S、M（带刺植物茎）", duration: "立即", text: "对生物作近战法术攻击，命中造成 1d6 穿刺伤害；可将大型或更小的目标朝自己拉近至多 10 尺。" },
  { id: "starry-wisp", name: "点点星芒", level: 0, school: "塑能", time: "动作", range: "60 尺", components: "V、S", duration: "立即", text: "对生物或物件作远程法术攻击，命中造成 1d8 光耀伤害。目标至你的下回合结束散发 10 尺微光，且无法受益于隐形状态。" },
  { id: "cure-wounds", name: "疗伤术", level: 1, school: "防护", time: "动作", range: "触碰", components: "V、S", duration: "立即", text: "触碰生物恢复 2d8 + 感知调整值 HP。二环施展恢复 4d8 + 感知调整值。医疗师可重掷治疗骰中的 1，必须使用新结果。" },
  { id: "healing-word", name: "治愈真言", level: 1, school: "防护", time: "附赠动作", range: "60 尺", components: "V", duration: "立即", text: "一名可见生物恢复 2d4 + 感知调整值 HP；二环施展为 4d4 + 感知调整值。医疗师可重掷治疗骰中的 1，必须使用新结果。" },
  { id: "entangle", name: "纠缠术", level: 1, school: "咒法", time: "动作", range: "90 尺", components: "V、S", duration: "至多 1 分钟", concentration: true, text: "20 尺方形地面长出植物，成为困难地形。出现时区域内生物力量豁免失败则束缚至法术结束。被束缚者用动作作力量（运动）检定对抗法术 DC，成功挣脱。" },
  { id: "faerie-fire", name: "妖火", level: 1, school: "塑能", time: "动作", range: "60 尺", components: "V", duration: "至多 1 分钟", concentration: true, text: "20 尺立方内物件及敏捷豁免失败的生物被光勾勒，散发 10 尺微光。能看见受影响目标时，对它的攻击具有优势；它无法受益于隐形状态。" },
  { id: "speak-with-animals", name: "动物交谈", level: 1, school: "预言", time: "动作", range: "自身", components: "V、S", duration: "10 分钟", ritual: true, text: "理解野兽并用语言与其沟通，可对它们使用交涉动作的任意技能选项。野兽通常只了解生存、伙伴和近期周边见闻。仪式施展额外花费 10 分钟，不消耗法术位。" },
  { id: "goodberry", name: "神莓术", level: 1, school: "咒法", time: "动作", range: "自身", components: "V、S、M（槲寄生）", duration: "24 小时", text: "手中出现 10 颗浆果。生物用附赠动作吃一颗恢复 1 HP，并满足一天营养需求。未食用的浆果在法术结束时消失。" },
  { id: "lesser-restoration", name: "次等复原术", level: 2, school: "防护", time: "附赠动作", range: "触碰", components: "V、S", duration: "立即", text: "终止被触碰生物的一种状态：目盲、耳聋、麻痹或中毒。" },
  { id: "spike-growth", name: "荆棘丛生", level: 2, school: "变化", time: "动作", range: "150 尺", components: "V、S、M（七根棘刺）", duration: "至多 10 分钟", concentration: true, text: "20 尺半径区域的地面成为困难地形。进入或在其中移动，每 5 尺受到 2d4 穿刺伤害。未目睹施法者须用搜索动作通过对抗法术 DC 的感知（察觉或求生）检定，才能在进入前发现伪装的棘刺。" },
  { id: "moonbeam", name: "月华之光", level: 2, school: "塑能", time: "动作", range: "120 尺", components: "V、S、M（月籽藤叶）", duration: "至多 1 分钟", concentration: true, text: "5 尺半径、40 尺高光柱出现时，区域内生物体质豁免，失败受 2d10 光耀伤害，成功半伤。失败的变形生物恢复原形且在离开光柱前不能变形。光柱进入生物空间、生物进入或在内结束回合时也触发，每名生物每回合至多一次。后续回合用魔法动作移动光柱至多 60 尺。" },
];
