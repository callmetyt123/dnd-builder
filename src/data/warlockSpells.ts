import type { Spell } from "./spells";

// 一环正文保留原环阶；二环契约施法的实际效果在展示层明确覆盖。
export const WARLOCK_SPELLS: Spell[] = [
  { id: "eldritch-blast", name: "魔能爆", level: 0, school: "塑能", time: "动作", range: "120 尺", components: "V、S", duration: "立即", text: "对生物或物件作一次远程法术攻击，命中造成 1d10 力场伤害。三级只有一束射线；祈唤加值见本构筑效果。" },
  { id: "mind-sliver", name: "心灵之楔", level: 0, school: "惑控", time: "动作", range: "60 尺", components: "V", duration: "1 轮", text: "一名可见生物作智力豁免，失败受 1d6 心灵伤害，且在你的下回合结束前的下一次豁免减 1d4。此法术不用攻击检定，不能触发斥力魔爆或脆弱诅咒的命中伤害。" },
  { id: "hex", name: "脆弱诅咒", level: 1, school: "惑控", time: "附赠动作", range: "90 尺", components: "V、S、M（风干的蝾螈眼）", duration: "至多 1 小时", concentration: true, text: "诅咒可见生物；攻击检定命中它时额外造成 1d6 暗蚀伤害。选一种属性，目标该属性的属性检定有劣势，不影响豁免。目标降至 0 HP 后，可在之后回合用附赠动作转移诅咒。二环专注可持续至多 4 小时。" },
  { id: "armor-of-agathys", name: "黯冰狱铠", level: 1, school: "防护", time: "附赠动作", range: "自身", components: "V、S、M（蓝色玻璃碎片）", duration: "1 小时", text: "获得 5 临时 HP。持续期间，生物用近战攻击检定命中你时，它受到 5 寒冷伤害。你不再具有任何临时 HP 时法术提前结束。二环临时 HP 与寒冷伤害均为 10。" },
  { id: "hellish-rebuke", name: "炼狱叱喝", level: 1, school: "塑能", time: "反应：受到 60 尺内可见生物的伤害", range: "60 尺", components: "V、S", duration: "立即", text: "伤害你的生物作敏捷豁免，失败受 2d10 火焰伤害，成功半伤。二环伤害 3d10。" },
  { id: "charm-person", name: "魅惑类人", level: 1, school: "惑控", time: "动作", range: "30 尺", components: "V、S", duration: "1 小时", text: "可见类人生物作感知豁免；若你或同伴正与它战斗则有优势。失败则被魅惑并对你友好，直到法术结束或你／同伴伤害它；结束后知道曾被魅惑。二环可选两名目标。" },
  { id: "command", name: "命令术", level: 1, school: "惑控", time: "动作", range: "60 尺", components: "V", duration: "立即", text: "可见生物感知豁免失败，下回合服从命令：过来（最短路到你 5 尺内并结束回合）、放下（放下持握物并结束回合）、走开（全回合最快远离）、趴下（倒地并结束回合）、立定（不移动、不用动作和附赠动作）。二环可选两名目标。" },
  { id: "darkness", name: "黑暗术", level: 2, school: "塑能", time: "动作", range: "60 尺", components: "V、S、M（蝙蝠毛与煤块）", duration: "至多 10 分钟", concentration: true, text: "15 尺半径球内充满魔法黑暗，普通黑暗视觉不能看穿，非魔法光不能照亮。可施展于未被着装或携带的物件，产生随物件移动的 15 尺光环；不透明遮盖可阻隔。重叠区域中的二环或以下造光法术被解除。" },
  { id: "invisibility", name: "隐形术", level: 2, school: "幻术", time: "动作", range: "触碰", components: "V、S、M（包裹在阿拉伯胶中的睫毛）", duration: "至多 1 小时", concentration: true, text: "触碰的生物隐形，直到法术结束。目标进行攻击检定、造成伤害或施展法术时提前结束。" },
  { id: "hold-person", name: "定身类人", level: 2, school: "惑控", time: "动作", range: "60 尺", components: "V、S、M（直的小铁片）", duration: "至多 1 分钟", concentration: true, text: "可见类人生物作感知豁免，失败则麻痹。目标每回合结束可再豁免，成功结束效果。" },
  { id: "suggestion", name: "暗示术", level: 2, school: "惑控", time: "动作", range: "30 尺", components: "V、M（蜂蜜）", duration: "至多 8 小时", concentration: true, text: "向能听到并理解你的可见生物提出至多 25 个词的可行行动，不得明显伤害它或盟友。目标感知豁免失败则被魅惑并尽力执行；完成行动、法术结束，或你／盟友伤害它时结束。" },
  { id: "false-life", name: "虚假生命", level: 1, school: "死灵", time: "动作", range: "自身", components: "V、S、M（酒精）", duration: "立即", text: "获得 2d4+4 临时 HP，二环额外 +5。临时 HP 不叠加。若通过邪魔活力祈唤施展，另按该祈唤取最大值 12，不耗位。" },
];
export const PACT_EFFECTS: Record<string, string> = {
  "burning-hands": "二环契约施法：15 尺锥形内生物敏捷豁免，失败受 4d6 火焰伤害，成功半伤；点燃未被携带或着装的易燃物。会伤及盟友。",
  "armor-of-agathys": "二环契约施法：获得 10 临时 HP，近战攻击命中你的生物受 10 寒冷伤害。持续 1 小时；没有临时 HP 时提前结束。临时 HP 被其他来源替换为正值不会提前结束，但不能叠加。",
  "hellish-rebuke": "二环契约施法：触发伤害你的生物作敏捷豁免，失败受 3d10 火焰伤害，成功半伤。",
  "charm-person": "二环契约施法可选择两名类人生物，其余条件不变。",
  command: "二环契约施法可选择两名可见生物，其余条件不变。",
  hex: "二环契约施法：专注至多 4 小时；命中额外伤害仍为 1d6。",
};
