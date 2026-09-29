import { SOLDIER } from "./backgrounds/soldier";
import type { AbilityId, BackgroundId, ClassId, SkillId } from "../rules/types";

export interface BackgroundDefinition {
  name: string;
  description: string;
  abilities: readonly AbilityId[];
  skills: readonly SkillId[];
  tool: string;
  feat: string;
  magicList?: "cleric" | "druid" | "wizard";
  equipment: readonly { id: string; quantity: number }[];
}

// 背景独立提供属性、熟练、专长和装备；职业方案只保留推荐背景的 ID。
export const BACKGROUNDS: Record<BackgroundId, BackgroundDefinition> = {
  scribe: {"name": "抄写员", "description": "细致观察、记录知识，熟习让你扩展三项熟练。", "abilities": ["dexterity", "intelligence", "wisdom"], "skills": ["investigation", "perception"], "tool": "calligraphers-supplies", "feat": "skilled", "equipment": [{"id": "calligraphers-supplies", "quantity": 1}, {"id": "fine-clothes", "quantity": 1}, {"id": "lamp", "quantity": 1}, {"id": "oil", "quantity": 3}, {"id": "parchment", "quantity": 12}, {"id": "gp", "quantity": 23}]},
  sailor: {"name": "水手", "description": "熟悉海上生活，也擅长徒手和临时武器战斗。", "abilities": ["strength", "dexterity", "wisdom"], "skills": ["acrobatics", "perception"], "tool": "navigators-tools", "feat": "tavern-brawler", "equipment": [{"id": "dagger", "quantity": 1}, {"id": "navigators-tools", "quantity": 1}, {"id": "rope", "quantity": 1}, {"id": "travelers-clothes", "quantity": 1}, {"id": "gp", "quantity": 20}]},
  noble: {"name": "贵族", "description": "接受过广泛教育，可选择技能与工具体现你的经历。", "abilities": ["strength", "intelligence", "charisma"], "skills": ["history", "persuasion"], "tool": "gaming-set", "feat": "skilled", "equipment": [{"id": "gaming-set", "quantity": 1}, {"id": "fine-clothes", "quantity": 1}, {"id": "perfume", "quantity": 1}, {"id": "gp", "quantity": 29}]},
  merchant: {"name": "商人", "description": "熟悉交易和旅途，幸运点留给关键时刻。", "abilities": ["constitution", "intelligence", "charisma"], "skills": ["animal-handling", "persuasion"], "tool": "navigators-tools", "feat": "lucky", "equipment": [{"id": "navigators-tools", "quantity": 1}, {"id": "pouch", "quantity": 2}, {"id": "travelers-clothes", "quantity": 1}, {"id": "gp", "quantity": 22}]},
  guide: {"name": "向导", "description": "熟悉荒野道路并掌握少量自然魔法；多三道法术要记。", "abilities": ["dexterity", "constitution", "wisdom"], "skills": ["stealth", "survival"], "tool": "cartographers-tools", "feat": "magic-initiate", "equipment": [{"id": "shortbow", "quantity": 1}, {"id": "arrow", "quantity": 20}, {"id": "cartographers-tools", "quantity": 1}, {"id": "bedroll", "quantity": 1}, {"id": "quiver", "quantity": 1}, {"id": "tent", "quantity": 1}, {"id": "travelers-clothes", "quantity": 1}, {"id": "gp", "quantity": 3}], "magicList": "druid"},
  guard: {"name": "警卫", "description": "习惯观察和守望，警戒可以帮助伙伴调整先攻。", "abilities": ["strength", "intelligence", "wisdom"], "skills": ["athletics", "perception"], "tool": "gaming-set", "feat": "alert", "equipment": [{"id": "spear", "quantity": 1}, {"id": "light-crossbow", "quantity": 1}, {"id": "bolt", "quantity": 20}, {"id": "gaming-set", "quantity": 1}, {"id": "hooded-lantern", "quantity": 1}, {"id": "manacles", "quantity": 1}, {"id": "quiver", "quantity": 1}, {"id": "travelers-clothes", "quantity": 1}, {"id": "gp", "quantity": 12}]},
  farmer: {"name": "农民", "description": "照料土地与牲畜，健壮直接提高生命值，容易上手。", "abilities": ["strength", "constitution", "wisdom"], "skills": ["animal-handling", "nature"], "tool": "carpenters-tools", "feat": "tough", "equipment": [{"id": "sickle", "quantity": 1}, {"id": "carpenters-tools", "quantity": 1}, {"id": "healers-kit", "quantity": 1}, {"id": "iron-pot", "quantity": 1}, {"id": "shovel", "quantity": 1}, {"id": "travelers-clothes", "quantity": 1}, {"id": "gp", "quantity": 30}]},
  entertainer: {"name": "艺人", "description": "通过表演鼓舞伙伴；记得携带熟练的乐器。", "abilities": ["strength", "dexterity", "charisma"], "skills": ["acrobatics", "performance"], "tool": "instrument", "feat": "musician", "equipment": [{"id": "instrument", "quantity": 1}, {"id": "costume", "quantity": 2}, {"id": "mirror", "quantity": 1}, {"id": "perfume", "quantity": 1}, {"id": "travelers-clothes", "quantity": 1}, {"id": "gp", "quantity": 11}]},
  criminal: {"name": "罪犯", "description": "熟悉街巷与潜入，警戒帮助你抢占先机。", "abilities": ["dexterity", "constitution", "intelligence"], "skills": ["sleight-of-hand", "stealth"], "tool": "thieves-tools", "feat": "alert", "equipment": [{"id": "dagger", "quantity": 2}, {"id": "thieves-tools", "quantity": 1}, {"id": "crowbar", "quantity": 1}, {"id": "pouch", "quantity": 2}, {"id": "travelers-clothes", "quantity": 1}, {"id": "gp", "quantity": 16}]},
  charlatan: {"name": "骗子", "description": "善于伪装经历与随机应变，可扩展三项熟练。", "abilities": ["dexterity", "constitution", "charisma"], "skills": ["deception", "sleight-of-hand"], "tool": "forgery-kit", "feat": "skilled", "equipment": [{"id": "forgery-kit", "quantity": 1}, {"id": "costume", "quantity": 1}, {"id": "fine-clothes", "quantity": 1}, {"id": "gp", "quantity": 15}]},
  artisan: {"name": "工匠", "description": "熟悉手艺和制作；需要选择工具，并准备对应实物。", "abilities": ["strength", "dexterity", "intelligence"], "skills": ["investigation", "persuasion"], "tool": "artisan-tool", "feat": "crafter", "equipment": [{"id": "artisan-tool", "quantity": 1}, {"id": "pouch", "quantity": 2}, {"id": "travelers-clothes", "quantity": 1}, {"id": "gp", "quantity": 32}]},
  acolyte: {"name": "侍僧", "description": "祈祷、仪式与神圣魔法；适合有信仰故事的角色。", "abilities": ["intelligence", "wisdom", "charisma"], "skills": ["insight", "religion"], "tool": "calligraphers-supplies", "feat": "magic-initiate", "equipment": [{"id": "calligraphers-supplies", "quantity": 1}, {"id": "prayer-book", "quantity": 1}, {"id": "holy-symbol", "quantity": 1}, {"id": "parchment", "quantity": 10}, {"id": "robe", "quantity": 1}, {"id": "gp", "quantity": 8}], "magicList": "cleric"},
  soldier: { name: "士兵", description: "曾接受战斗训练，也见识过战场。适合想用武器解决问题的角色。", abilities: SOLDIER.abilityOptions, skills: SOLDIER.skillProficiencies, tool: "gaming-set", feat: "savage-attacker", equipment: SOLDIER.equipmentPackages["soldier-a"] },
  sage: { magicList: "wizard", name: "智者", description: "从书卷和研究中积累知识，并学会一些魔法。需要额外选择和记住三道法术。", abilities: ["constitution", "intelligence", "wisdom"], skills: ["arcana", "history"], tool: "calligraphers-supplies", feat: "magic-initiate", equipment: [{ id: "quarterstaff", quantity: 1 }, { id: "calligraphers-supplies", quantity: 1 }, { id: "history-book", quantity: 1 }, { id: "parchment", quantity: 8 }, { id: "robe", quantity: 1 }, { id: "gp", quantity: 8 }] },
  hermit: { name: "隐士", description: "曾在远离人群的地方生活，思考世界并学习疗愈。适合愿意照顾同伴的角色。", abilities: ["constitution", "wisdom", "charisma"], skills: ["medicine", "religion"], tool: "herbalism-kit", feat: "healer", equipment: [{ id: "quarterstaff", quantity: 1 }, { id: "herbalism-kit", quantity: 1 }, { id: "bedroll", quantity: 1 }, { id: "philosophy-book", quantity: 1 }, { id: "lamp", quantity: 1 }, { id: "oil", quantity: 3 }, { id: "travelers-clothes", quantity: 1 }, { id: "gp", quantity: 16 }] },
  wayfarer: { name: "流浪者", description: "在街巷与旅途中学会观察、隐匿与把握机遇。幸运点需要你判断何时使用。", abilities: ["dexterity", "wisdom", "charisma"], skills: ["insight", "stealth"], tool: "thieves-tools", feat: "lucky", equipment: [{ id: "dagger", quantity: 2 }, { id: "thieves-tools", quantity: 1 }, { id: "gaming-set", quantity: 1 }, { id: "bedroll", quantity: 1 }, { id: "pouch", quantity: 2 }, { id: "travelers-clothes", quantity: 1 }, { id: "gp", quantity: 16 }] },
};
export const RECOMMENDED_BACKGROUND: Record<ClassId, BackgroundId> = { rogue: "criminal", fighter: "soldier", wizard: "sage", druid: "hermit", warlock: "wayfarer", ranger: "wayfarer" };
export const BACKGROUND_REASON: Record<ClassId, string> = { rogue: "罪犯提升敏捷与体质，提供巧手、隐匿和警戒；与推荐职业技能互补。重复盗贼工具熟练不叠加，实物仍保留。",
  fighter: "士兵可以提升力量和体质；凶蛮打手直接帮助武器伤害，不增加每日资源。",
  wizard: "智者可以提升智力和体质，提供知识技能与额外法师法术。",
  druid: "隐士可以提升感知和体质，医疗师帮助你改善治疗法术的结果。",
  warlock: "流浪者可以提升魅力和敏捷，幸运在关键检定或被攻击时提供帮助。",
  ranger: "流浪者可以提升敏捷和感知，洞悉和隐匿适合观察与探索。",
};
