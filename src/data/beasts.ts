import type { AbilityId, SkillId } from "../rules/types";

export interface Beast {
  id: string; name: string; size: string; cr: number; armorClass: number;
  physical: { strength: number; dexterity: number; constitution: number };
  speed: number; climb?: number; burrow?: number; fly?: number; darkvision: number;
  skills: Partial<Record<SkillId, number>>; saves?: Partial<Record<AbilityId, number>>;
  resistances?: string[]; traits: string[];
  attacks: { name: string; bonus: number; damage: string; effect?: string }[];
}
// MM 2025 数据；故意不保存野兽 HP，荒野变形使用角色原有 HP 和生命骰。
export const BEASTS: Beast[] = [
  { id: "brown-bear", name: "棕熊", size: "大型", cr: 1, armorClass: 11, physical: { strength: 17, dexterity: 12, constitution: 15 }, speed: 40, climb: 30, darkvision: 60, skills: { perception: 3 }, traits: ["多重攻击：一个动作各进行一次啮咬和爪击。"], attacks: [{ name: "啮咬", bonus: 5, damage: "1d8+3 穿刺" }, { name: "爪击", bonus: 5, damage: "1d4+3 挥砍", effect: "大型或更小的目标倒地，无豁免。" }] },
  { id: "dire-wolf", name: "恐狼", size: "大型", cr: 1, armorClass: 14, physical: { strength: 17, dexterity: 14, constitution: 15 }, speed: 50, darkvision: 60, skills: { perception: 5, stealth: 4 }, traits: ["集群战术：目标 5 尺内有你未失能的盟友时，你对目标的攻击具有优势。"], attacks: [{ name: "啮咬", bonus: 5, damage: "1d10+3 穿刺", effect: "大型或更小的目标倒地，无豁免。" }] },
  { id: "wolf", name: "狼", size: "中型", cr: 0.25, armorClass: 12, physical: { strength: 14, dexterity: 15, constitution: 12 }, speed: 40, darkvision: 60, skills: { perception: 5, stealth: 4 }, traits: ["集群战术：目标 5 尺内有你未失能的盟友时，你对目标的攻击具有优势。"], attacks: [{ name: "啮咬", bonus: 4, damage: "1d6+2 穿刺", effect: "中型或更小的目标倒地，无豁免。" }] },
  { id: "cat", name: "猫", size: "微型", cr: 0, armorClass: 12, physical: { strength: 3, dexterity: 15, constitution: 10 }, speed: 40, climb: 40, darkvision: 60, skills: { perception: 3, stealth: 4 }, saves: { dexterity: 4 }, traits: ["跳跃者：计算跳跃距离时使用敏捷而非力量。"], attacks: [{ name: "抓挠", bonus: 4, damage: "1 挥砍（固定）" }] },
  { id: "badger", name: "獾", size: "微型", cr: 0, armorClass: 11, physical: { strength: 10, dexterity: 11, constitution: 16 }, speed: 20, burrow: 5, darkvision: 30, skills: { perception: 3 }, resistances: ["poison"], traits: ["毒素伤害抗性；没有避免中毒状态的额外豁免优势。"], attacks: [{ name: "啮咬", bonus: 2, damage: "1 穿刺（固定）" }] },
  { id: "panther", name: "豹", size: "中型", cr: 0.25, armorClass: 13, physical: { strength: 14, dexterity: 16, constitution: 10 }, speed: 50, climb: 40, darkvision: 60, skills: { perception: 4, stealth: 7 }, traits: ["灵巧逃脱：以附赠动作撤离或躲藏。"], attacks: [{ name: "撕裂", bonus: 5, damage: "1d6+3 挥砍" }] },
];
export const beast = (id: string) => BEASTS.find((b) => b.id === id);
export const legalMoonForm = (id: string) => { const b = beast(id); return !!b && b.cr <= 1 && !b.fly; };

// 普通三级变形上限为 CR 1/4，只有月亮结社提高至 CR 1。
export const legalDruidForm = (id: string, moon: boolean) => { const b = beast(id); return !!b && b.cr <= (moon ? 1 : 0.25) && !b.fly; };
