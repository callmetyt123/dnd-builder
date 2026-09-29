import { SOLDIER } from "./backgrounds/soldier";
import type { AbilityId, BackgroundId, ClassId, SkillId } from "../rules/types";

export interface BackgroundDefinition {
  name: string;
  description: string;
  abilities: readonly AbilityId[];
  skills: readonly SkillId[];
  tool: string;
  feat: string;
  equipment: readonly { id: string; quantity: number }[];
}

// 背景独立提供属性、熟练、专长和装备；职业方案只保留推荐背景的 ID。
export const BACKGROUNDS: Record<BackgroundId, BackgroundDefinition> = {
  soldier: { name: "士兵", description: "曾接受战斗训练，也见识过战场。适合想用武器解决问题的角色。", abilities: SOLDIER.abilityOptions, skills: SOLDIER.skillProficiencies, tool: "gaming-set", feat: "savage-attacker", equipment: SOLDIER.equipmentPackages["soldier-a"] },
  sage: { name: "贤者", description: "从书卷和研究中积累知识，并学会一些魔法。需要额外选择和记住三道法术。", abilities: ["constitution", "intelligence", "wisdom"], skills: ["arcana", "history"], tool: "calligraphers-supplies", feat: "magic-initiate", equipment: [{ id: "quarterstaff", quantity: 1 }, { id: "calligraphers-supplies", quantity: 1 }, { id: "history-book", quantity: 1 }, { id: "parchment", quantity: 8 }, { id: "robe", quantity: 1 }, { id: "gp", quantity: 8 }] },
  hermit: { name: "隐士", description: "曾在远离人群的地方生活，思考世界并学习疗愈。适合愿意照顾同伴的角色。", abilities: ["constitution", "wisdom", "charisma"], skills: ["medicine", "religion"], tool: "herbalism-kit", feat: "healer", equipment: [{ id: "quarterstaff", quantity: 1 }, { id: "herbalism-kit", quantity: 1 }, { id: "bedroll", quantity: 1 }, { id: "philosophy-book", quantity: 1 }, { id: "lamp", quantity: 1 }, { id: "oil", quantity: 3 }, { id: "travelers-clothes", quantity: 1 }, { id: "gp", quantity: 16 }] },
  wayfarer: { name: "流浪者", description: "在街巷与旅途中学会观察、隐匿与把握机遇。幸运点需要你判断何时使用。", abilities: ["dexterity", "wisdom", "charisma"], skills: ["insight", "stealth"], tool: "thieves-tools", feat: "lucky", equipment: [{ id: "dagger", quantity: 2 }, { id: "thieves-tools", quantity: 1 }, { id: "gaming-set", quantity: 1 }, { id: "bedroll", quantity: 1 }, { id: "pouch", quantity: 2 }, { id: "travelers-clothes", quantity: 1 }, { id: "gp", quantity: 16 }] },
};
export const RECOMMENDED_BACKGROUND: Record<ClassId, BackgroundId> = { fighter: "soldier", wizard: "sage", druid: "hermit", warlock: "wayfarer", ranger: "wayfarer" };
export const BACKGROUND_REASON: Record<ClassId, string> = {
  fighter: "士兵可以提升力量和体质；凶蛮打手直接帮助武器伤害，不增加每日资源。",
  wizard: "贤者可以提升智力和体质，提供知识技能与额外法师法术。",
  druid: "隐士可以提升感知和体质，医疗师帮助你改善治疗法术的结果。",
  warlock: "流浪者可以提升魅力和敏捷，幸运在关键检定或被攻击时提供帮助。",
  ranger: "流浪者可以提升敏捷和感知，洞悉和隐匿适合观察与探索。",
};
