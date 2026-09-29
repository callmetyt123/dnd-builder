import { FIGHTER } from "./classes/fighter";
import { SOLDIER } from "./backgrounds/soldier";
import type { AbilityId, ClassId, SkillId } from "../rules/types";

// 每个方案明确其职业与背景来源；数值推导不依赖页面选择文案。
export interface Profile {
  name: string; subclass: string; background: string; hitDie: number; fixedHp: number;
  saves: readonly AbilityId[]; skills: readonly SkillId[]; backgroundSkills: readonly SkillId[];
  boostOptions: readonly AbilityId[]; equipment: readonly { id: string; quantity: number }[];
}
export const SCHOLAR_SKILLS: SkillId[] = ["arcana", "history", "investigation", "medicine", "nature", "religion"];
export const PROFILES: Record<ClassId, Profile> = {
  warlock: { name: "魔契师", subclass: "邪魔宗主", background: "流浪者", hitDie: 8, fixedHp: 5,
    saves: ["wisdom", "charisma"], skills: ["arcana", "deception", "history", "intimidation", "investigation", "nature", "religion"],
    backgroundSkills: ["insight", "stealth"], boostOptions: ["dexterity", "wisdom", "charisma"],
    equipment: [{ id: "leather-armor", quantity: 1 }, { id: "sickle", quantity: 1 }, { id: "dagger", quantity: 4 }, { id: "arcane-orb", quantity: 1 }, { id: "occult-book", quantity: 1 }, { id: "scholars-pack", quantity: 1 }, { id: "thieves-tools", quantity: 1 }, { id: "gaming-set", quantity: 1 }, { id: "bedroll", quantity: 1 }, { id: "pouch", quantity: 2 }, { id: "travelers-clothes", quantity: 1 }, { id: "gp", quantity: 31 }] },
  druid: { name: "德鲁伊", subclass: "月亮结社", background: "隐士", hitDie: 8, fixedHp: 5,
    saves: ["intelligence", "wisdom"], skills: ["arcana", "animal-handling", "insight", "medicine", "nature", "perception", "religion", "survival"],
    backgroundSkills: ["medicine", "religion"], boostOptions: ["constitution", "wisdom", "charisma"],
    equipment: [{ id: "leather-armor", quantity: 1 }, { id: "shield", quantity: 1 }, { id: "sickle", quantity: 1 }, { id: "quarterstaff", quantity: 2 }, { id: "explorers-pack", quantity: 1 }, { id: "herbalism-kit", quantity: 2 }, { id: "gp", quantity: 25 }, { id: "bedroll", quantity: 1 }, { id: "philosophy-book", quantity: 1 }, { id: "lamp", quantity: 1 }, { id: "oil", quantity: 3 }, { id: "travelers-clothes", quantity: 1 }] },
  fighter: { name: "战士", subclass: "勇士", background: "士兵", hitDie: FIGHTER.hitDie, fixedHp: FIGHTER.fixedHpAfterFirstLevel,
    saves: FIGHTER.savingThrowProficiencies, skills: FIGHTER.skillOptions, backgroundSkills: SOLDIER.skillProficiencies,
    boostOptions: SOLDIER.abilityOptions, equipment: [...FIGHTER.equipmentPackages["fighter-a"], ...SOLDIER.equipmentPackages["soldier-a"]] },
  wizard: { name: "法师", subclass: "塑能师", background: "贤者", hitDie: 6, fixedHp: 4,
    saves: ["intelligence", "wisdom"], skills: ["arcana", "history", "insight", "investigation", "medicine", "nature", "religion"],
    backgroundSkills: ["arcana", "history"], boostOptions: ["constitution", "intelligence", "wisdom"],
    equipment: [{ id: "dagger", quantity: 2 }, { id: "quarterstaff", quantity: 1 }, { id: "robe", quantity: 1 }, { id: "spellbook", quantity: 1 }, { id: "scholars-pack", quantity: 1 }, { id: "gp", quantity: 5 }, { id: "quarterstaff", quantity: 1 }, { id: "calligraphers-supplies", quantity: 1 }, { id: "history-book", quantity: 1 }, { id: "parchment", quantity: 8 }, { id: "robe", quantity: 1 }, { id: "gp", quantity: 8 }] },
};
