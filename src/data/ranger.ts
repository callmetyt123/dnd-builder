import type { Spell } from "./spells";
import type { AbilityScores } from "../rules/types";

export type PrimalFormId = "land" | "sea" | "sky";
export type BeastDamage = "piercing" | "slashing" | "bludgeoning";
export interface PrimalChoice { form: PrimalFormId; damage: BeastDamage; appearance: string }
export interface PrimalForm { id: PrimalFormId; name: string; size: string; hp: number; hitDie: number; speed: string; darkvision: number; abilities: AbilityScores; dice: string; damageBonus: number; damageTypes: BeastDamage[]; effect: string }
// 固定三级数据；感知相关数值与原初联结加值由角色派生，不能套用普通野兽卡。
export const PRIMAL_FORMS: PrimalForm[] = [
  { id: "land", name: "大地野兽", size: "中型", hp: 20, hitDie: 8, speed: "步行 40 尺／攀爬 40 尺", darkvision: 60, abilities: { strength: 14, dexterity: 14, constitution: 15, intelligence: 8, wisdom: 14, charisma: 11 }, dice: "1d8", damageBonus: 2, damageTypes: ["piercing", "slashing", "bludgeoning"], effect: "攻击前立即向目标直线移动至少 20 尺：命中额外造成 1d6 同类型伤害，且大型或更小目标倒地，无豁免。" },
  { id: "sea", name: "海洋野兽", size: "中型", hp: 20, hitDie: 8, speed: "步行 5 尺／游泳 60 尺", darkvision: 90, abilities: { strength: 14, dexterity: 14, constitution: 15, intelligence: 8, wisdom: 14, charisma: 11 }, dice: "1d6", damageBonus: 2, damageTypes: ["bludgeoning", "piercing"], effect: "水陆两栖；命中使目标受擒，逃脱 DC 等于你的法术豁免 DC。具体受擒与放开由玩家记录。" },
  { id: "sky", name: "天空野兽", size: "小型", hp: 16, hitDie: 6, speed: "步行 10 尺／飞行 60 尺", darkvision: 60, abilities: { strength: 6, dexterity: 16, constitution: 13, intelligence: 8, wisdom: 14, charisma: 11 }, dice: "1d4", damageBonus: 3, damageTypes: ["slashing"], effect: "飞掠：飞行离开敌人触及时不引发借机攻击。没有悬浮；失能或速度归零时按飞行坠落规则处理。" },
];
export const primalForm = (id: string) => PRIMAL_FORMS.find((f) => f.id === id);
export const RANGER_PREPARABLE = ["cure-wounds", "ensnaring-strike", "goodberry", "longstrider", "speak-with-animals", "detect-magic", "entangle", "alarm"];
export const RANGER_MASTERIES = ["longbow", "shortsword", "scimitar", "dagger"];
export const RANGER_STYLES = { archery: "箭术", defense: "防御" } as const;
// 共享法术卡保留基本规则；职业专属免费次数不写进通用法术效果。
export const RANGER_SPELLS: Spell[] = [
  { id: "hunters-mark", name: "猎人印记", level: 1, school: "预言", time: "附赠动作", range: "90 尺", components: "V", duration: "至多 1 小时", concentration: true, text: "标记可见生物。你以攻击检定命中它时额外造成 1d6 力场伤害；寻找它的感知（察觉或求生）检定有优势。目标降至 0 HP 后，可用附赠动作转移到范围内另一可见生物，不重新扣位。三级伙伴的攻击不享受此加伤。" },
  { id: "goodberry", name: "神莓术", level: 1, school: "咒法", time: "动作", range: "自身", components: "V、S、M（槲寄生）", duration: "24 小时", text: "创造 10 颗魔法浆果；生物用附赠动作吃一颗，恢复 1 HP 并满足一天营养需求。到期未食用的浆果消失；数量与治疗另行记录。" },
  { id: "longstrider", name: "大步奔行", level: 1, school: "变化", time: "动作", range: "触碰", components: "V、S、M（一撮泥土）", duration: "1 小时", text: "触碰一名生物，其速度增加 10 尺；可用于角色或伙伴。期限与当前速度由玩家另行记录。二环施展时可再指定一名目标。" },
  { id: "ensnaring-strike", name: "捕获打击", level: 1, school: "咒法", time: "附赠动作：用武器命中生物后立即施展", range: "自身", components: "V", duration: "至多 1 分钟", concentration: true, text: "命中的生物作力量豁免，大型或更大生物具有优势。失败则被魔法藤蔓束缚，且每次其回合开始受 1d6 穿刺伤害；成功则藤蔓消失。目标或其触及内生物可用动作作对抗法术 DC 的力量（运动）检定，成功结束效果。会结束你原有的专注。" },
];
