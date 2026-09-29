import { NEW_CLASSES } from "./newClasses";
import { FIGHTER } from "./classes/fighter";
import type { AbilityId, ClassId, SkillId } from "../rules/types";
// 职业定义不含背景规则；背景选择不会改变职业的生命骰、豁免或装备包。
export interface Profile {
  name: string; subclass: string; hitDie: number; fixedHp: number;
  saves: readonly AbilityId[]; skills: readonly SkillId[];
  equipment: readonly { id: string; quantity: number }[];
}
export const SCHOLAR_SKILLS: SkillId[] = ["arcana", "history", "investigation", "medicine", "nature", "religion"];
export const PROFILES: Record<ClassId, Profile> = { ...NEW_CLASSES,
  rogue: { name: "游荡者", subclass: "盗贼", hitDie: 8, fixedHp: 5,
    saves: ["dexterity", "intelligence"], skills: ["acrobatics", "athletics", "deception", "insight", "intimidation", "investigation", "perception", "persuasion", "sleight-of-hand", "stealth"],
    equipment: [{ id: "leather-armor", quantity: 1 }, { id: "dagger", quantity: 2 }, { id: "shortsword", quantity: 1 }, { id: "shortbow", quantity: 1 }, { id: "arrow", quantity: 20 }, { id: "quiver", quantity: 1 }, { id: "thieves-tools", quantity: 1 }, { id: "burglars-pack", quantity: 1 }, { id: "gp", quantity: 8 }] },
  ranger: { name: "游侠", subclass: "驯兽师", hitDie: 10, fixedHp: 6,
    saves: ["strength", "dexterity"], skills: ["animal-handling", "athletics", "insight", "investigation", "nature", "perception", "stealth", "survival"],
    equipment: [{ id: "studded-leather", quantity: 1 }, { id: "scimitar", quantity: 1 }, { id: "shortsword", quantity: 1 }, { id: "longbow", quantity: 1 }, { id: "arrow", quantity: 20 }, { id: "quiver", quantity: 1 }, { id: "mistletoe", quantity: 1 }, { id: "explorers-pack", quantity: 1 }, { id: "gp", quantity: 7 }] },
  warlock: { name: "魔契师", subclass: "邪魔宗主", hitDie: 8, fixedHp: 5,
    saves: ["wisdom", "charisma"], skills: ["arcana", "deception", "history", "intimidation", "investigation", "nature", "religion"],
    equipment: [{ id: "leather-armor", quantity: 1 }, { id: "sickle", quantity: 1 }, { id: "dagger", quantity: 2 }, { id: "arcane-orb", quantity: 1 }, { id: "occult-book", quantity: 1 }, { id: "scholars-pack", quantity: 1 }, { id: "gp", quantity: 15 }] },
  druid: { name: "德鲁伊", subclass: "月亮结社", hitDie: 8, fixedHp: 5,
    saves: ["intelligence", "wisdom"], skills: ["arcana", "animal-handling", "insight", "medicine", "nature", "perception", "religion", "survival"],
    equipment: [{ id: "leather-armor", quantity: 1 }, { id: "shield", quantity: 1 }, { id: "sickle", quantity: 1 }, { id: "quarterstaff", quantity: 1 }, { id: "explorers-pack", quantity: 1 }, { id: "herbalism-kit", quantity: 1 }, { id: "gp", quantity: 9 }] },
  fighter: { name: "战士", subclass: "勇士", hitDie: FIGHTER.hitDie, fixedHp: FIGHTER.fixedHpAfterFirstLevel,
    saves: FIGHTER.savingThrowProficiencies, skills: FIGHTER.skillOptions,
    equipment: FIGHTER.equipmentPackages["fighter-a"] },
  wizard: { name: "法师", subclass: "塑能师", hitDie: 6, fixedHp: 4,
    saves: ["intelligence", "wisdom"], skills: ["arcana", "history", "insight", "investigation", "medicine", "nature", "religion"],
    equipment: [{ id: "dagger", quantity: 2 }, { id: "quarterstaff", quantity: 1 }, { id: "robe", quantity: 1 }, { id: "spellbook", quantity: 1 }, { id: "scholars-pack", quantity: 1 }, { id: "gp", quantity: 5 }] },
};
