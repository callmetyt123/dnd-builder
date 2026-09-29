import { WARLOCK_SPELL_IDS } from "./primalSpells";
import type { InvocationChoice } from "../rules/types";

export const FIEND_SPELLS = ["burning-hands", "command", "scorching-ray", "suggestion"];
export const WARLOCK_CANTRIPS = WARLOCK_SPELL_IDS.slice(0, 12);
export const WARLOCK_PREPARABLE = WARLOCK_SPELL_IDS.slice(12);
export const CANTRIP_DAMAGE: Record<string, { dice: string; damage: string; range: number; attack: boolean; save?: string; melee?: boolean; rangeLabel?: string; note?: string }> = {
  "eldritch-blast": { dice: "1d10", damage: "力场", range: 120, attack: true },
  "mind-sliver": { dice: "1d6", damage: "心灵", range: 60, attack: false, save: "智力" },
  "chill-touch": { dice: "1d10", damage: "暗蚀", range: 0, rangeLabel: "触碰", attack: true, melee: true },
  "poison-spray": { dice: "1d12", damage: "毒素", range: 30, attack: true },
  "thunderclap": { dice: "1d6", damage: "雷鸣", range: 0, rangeLabel: "自身 5 尺光环", attack: false, save: "体质", note: "每名其他生物分别豁免，会波及盟友。" },
  "toll-the-dead": { dice: "1d8", damage: "暗蚀", range: 60, attack: false, save: "感知", note: "目标已损失 HP 时，伤害骰改为 1d12。" },
  "sacred-flame": { dice: "1d8", damage: "光耀", range: 60, attack: false, save: "敏捷", note: "目标不能因半身或四分之三掩护在此豁免获得增益。" },
  "true-strike": { dice: "武器伤害骰", damage: "光耀或武器原类型", range: 0, rangeLabel: "所用武器范围", attack: true, note: "用价值至少 1 CP 的熟练武器施法；攻击与伤害用魅力。魔法动作，不触发要求攻击动作的效果。" },
};
export interface Invocation {
  id: string; name: string; minLevel: number; target?: "damage" | "attack" | "range"; text: string; spell?: string;
}
// 本阶段收录可完整应用的十种祈唤；复选项以祈唤和目标戏法组成唯一键。
export const INVOCATIONS: Invocation[] = [
  { id: "mask-of-many-faces", name: "千面之颜", minLevel: 2, spell: "disguise-self", text: "不耗法术位施展一环易容术；仍需正常成分。" },
  { id: "misty-visions", name: "幻象迷踪", minLevel: 2, spell: "silent-image", text: "不耗法术位施展一环无声幻影；仍需正常成分与专注。" },
  { id: "otherworldly-leap", name: "超凡跳跃", minLevel: 2, spell: "jump", text: "对自己不耗法术位施展一环跳跃术；仍需正常成分。" },
  { id: "agonizing-blast", name: "苦痛魔爆", minLevel: 2, target: "damage", text: "选择一道已知伤害戏法，其伤害掷骰加魅力调整值。可复选，但每次须选不同戏法。" },
  { id: "repelling-blast", name: "斥力魔爆", minLevel: 2, target: "attack", text: "选择一道以攻击检定造成伤害的已知戏法；命中大型或更小生物时，可将其沿直线推离至多 10 尺。可对不同戏法复选。" },
  { id: "eldritch-spear", name: "魔能长枪", minLevel: 2, target: "range", text: "选择一道射程至少 10 尺的已知伤害戏法；三级增加 90 尺射程。可对不同戏法复选。" },
  { id: "eldritch-mind", name: "魔能意志", minLevel: 1, text: "维持专注的体质豁免具有优势；不适用于其他体质豁免。" },
  { id: "devils-sight", name: "魔鬼视界", minLevel: 2, text: "120 尺内正常看穿魔法与非魔法的黑暗和微光；不会让盟友获得同样视野。" },
  { id: "fiendish-vigor", name: "邪魔活力", minLevel: 2, spell: "false-life", text: "对自己不耗法术位施展一环虚假生命，临时生命值骰取最大值，获得 12 临时 HP；不能叠加已有临时 HP。" },
  { id: "armor-of-shadows", name: "幽影护甲", minLevel: 1, spell: "mage-armor", text: "对自己不耗法术位施展法师护甲；必须未穿护甲，AC 为 13 + 敏捷。不会与皮甲叠加。" },
];
export const invocation = (id: string) => INVOCATIONS.find((v) => v.id === id);
export const invocationKey = (v: InvocationChoice) => `${v.id}:${v.target ?? ""}`;
export function eligibleTarget(id: string, spellId: string, known: string[]): boolean {
  const option = invocation(id);
  const data = Object.prototype.hasOwnProperty.call(CANTRIP_DAMAGE, spellId) ? CANTRIP_DAMAGE[spellId] : undefined;
  return !!option?.target && known.includes(spellId) && !!data
    && (option.target !== "attack" || data.attack) && (option.target !== "range" || data.range >= 10);
}
