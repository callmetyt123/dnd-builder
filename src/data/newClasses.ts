import { SKILLS } from "./core";
import type { NewClassId, NewSubclassId, AbilityId, BackgroundId, SkillId, ClassId } from "../rules/types";
export interface NewClassDefinition { name: string; subclassId: NewSubclassId; subclass: string; skills: SkillId[]; count: number; hitDie: number; fixedHp: number; saves: AbilityId[]; equipment: {id: string; quantity: number}[]; priority: AbilityId[]; background: BackgroundId; cantripCount: number; preparedCount: number; auto: string[]; reason: string; effort: string; tags: string[]; complexity: number; training: string }
// 这里只定义三级入门路线；不会提前授予额外攻击、灵光或高等级子职能力。
export const NEW_CLASSES: Record<NewClassId, NewClassDefinition> = {
  "barbarian": {
    "name": "野蛮人",
    "subclassId": "berserker",
    "subclass": "狂战士道途",
    "skills": [
      "animal-handling",
      "athletics",
      "intimidation",
      "nature",
      "perception",
      "survival"
    ],
    "count": 3,
    "hitDie": 12,
    "fixedHp": 7,
    "saves": [
      "strength",
      "constitution"
    ],
    "equipment": [
      {
        "id": "greataxe",
        "quantity": 1
      },
      {
        "id": "handaxe",
        "quantity": 4
      },
      {
        "id": "explorers-pack",
        "quantity": 1
      },
      {
        "id": "gp",
        "quantity": 15
      }
    ],
    "priority": [
      "strength",
      "constitution",
      "dexterity",
      "wisdom",
      "charisma",
      "intelligence"
    ],
    "background": "farmer",
    "cantripCount": 0,
    "preparedCount": 0,
    "auto": [],
    "reason": "用狂暴加强耐久与力量攻击；鲁莽攻击能提高命中，也会让敌人更容易命中你。",
    "effort": "记住狂暴持续条件、鲁莽攻击和首次命中的狂怒加伤。",
    "tags": [
      "melee",
      "durability"
    ],
    "complexity": 0,
    "training": "简易和军用武器；轻甲、中甲、盾牌。包 A 无护甲，使用无甲防御。"
  },
  "bard": {
    "name": "吟游诗人",
    "subclassId": "lore",
    "subclass": "逸闻学院",
    "skills": [],
    "count": 6,
    "hitDie": 8,
    "fixedHp": 5,
    "saves": [
      "dexterity",
      "charisma"
    ],
    "equipment": [
      {
        "id": "leather-armor",
        "quantity": 1
      },
      {
        "id": "dagger",
        "quantity": 2
      },
      {
        "id": "class-instrument",
        "quantity": 1
      },
      {
        "id": "entertainers-pack",
        "quantity": 1
      },
      {
        "id": "gp",
        "quantity": 19
      }
    ],
    "priority": [
      "charisma",
      "dexterity",
      "constitution",
      "wisdom",
      "intelligence",
      "strength"
    ],
    "background": "entertainer",
    "cantripCount": 2,
    "preparedCount": 6,
    "auto": [],
    "reason": "以吟游激励帮助同伴，用技能应对交涉与探索；逸闻学院还可用反应干扰敌人。",
    "effort": "激励和语出惊人共用次数；三级长休恢复，另需管理法术。",
    "tags": [
      "support",
      "magic",
      "stealth"
    ],
    "complexity": 2,
    "training": "简易武器、轻甲；三种乐器熟练。可用乐器作为职业施法法器。"
  },
  "cleric": {
    "name": "牧师",
    "subclassId": "life",
    "subclass": "生命领域",
    "skills": [
      "history",
      "insight",
      "medicine",
      "persuasion",
      "religion"
    ],
    "count": 2,
    "hitDie": 8,
    "fixedHp": 5,
    "saves": [
      "wisdom",
      "charisma"
    ],
    "equipment": [
      {
        "id": "chain-shirt",
        "quantity": 1
      },
      {
        "id": "shield",
        "quantity": 1
      },
      {
        "id": "mace",
        "quantity": 1
      },
      {
        "id": "holy-symbol",
        "quantity": 1
      },
      {
        "id": "priests-pack",
        "quantity": 1
      },
      {
        "id": "gp",
        "quantity": 7
      }
    ],
    "priority": [
      "wisdom",
      "constitution",
      "dexterity",
      "strength",
      "charisma",
      "intelligence"
    ],
    "background": "hermit",
    "cantripCount": 3,
    "preparedCount": 6,
    "auto": [
      "aid",
      "bless",
      "cure-wounds",
      "lesser-restoration"
    ],
    "reason": "生命领域加强耗位治疗，也能用神圣火花支援；并非每回合都需要治疗。",
    "effort": "区分法术位与引导神力；生命门徒只加到符合条件的耗位治疗。",
    "tags": [
      "support",
      "magic"
    ],
    "complexity": 1,
    "training": "简易武器；轻甲、中甲、盾牌。圣徽为职业法器；纯姿势、无材料的法术仍须空手。"
  },
  "monk": {
    "name": "武僧",
    "subclassId": "open-hand",
    "subclass": "散打武者",
    "skills": [
      "acrobatics",
      "athletics",
      "history",
      "insight",
      "religion",
      "stealth"
    ],
    "count": 2,
    "hitDie": 8,
    "fixedHp": 5,
    "saves": [
      "strength",
      "dexterity"
    ],
    "equipment": [
      {
        "id": "spear",
        "quantity": 1
      },
      {
        "id": "dagger",
        "quantity": 5
      },
      {
        "id": "class-tool",
        "quantity": 1
      },
      {
        "id": "explorers-pack",
        "quantity": 1
      },
      {
        "id": "gp",
        "quantity": 11
      }
    ],
    "priority": [
      "dexterity",
      "wisdom",
      "constitution",
      "strength",
      "intelligence",
      "charisma"
    ],
    "background": "sailor",
    "cantripCount": 0,
    "preparedCount": 0,
    "auto": [],
    "reason": "用徒手打击与移动作战；疾风连击命中后可妨碍敌人，平时不花功力也能灵活行动。",
    "effort": "附赠动作只能选一种；保留功力与反应用于防御。",
    "tags": [
      "melee",
      "stealth",
      "mobile"
    ],
    "complexity": 1,
    "training": "简易武器及带轻型词条的军用武器；一种工匠工具或乐器熟练。无护甲与盾牌受训。"
  },
  "paladin": {
    "name": "圣武士",
    "subclassId": "devotion",
    "subclass": "奉献之誓",
    "skills": [
      "athletics",
      "insight",
      "intimidation",
      "medicine",
      "persuasion",
      "religion"
    ],
    "count": 2,
    "hitDie": 10,
    "fixedHp": 6,
    "saves": [
      "wisdom",
      "charisma"
    ],
    "equipment": [
      {
        "id": "chain-mail",
        "quantity": 1
      },
      {
        "id": "shield",
        "quantity": 1
      },
      {
        "id": "longsword",
        "quantity": 1
      },
      {
        "id": "javelin",
        "quantity": 6
      },
      {
        "id": "holy-symbol",
        "quantity": 1
      },
      {
        "id": "priests-pack",
        "quantity": 1
      },
      {
        "id": "gp",
        "quantity": 9
      }
    ],
    "priority": [
      "strength",
      "charisma",
      "constitution",
      "wisdom",
      "dexterity",
      "intelligence"
    ],
    "background": "noble",
    "cantripCount": 0,
    "preparedCount": 4,
    "auto": [
      "divine-smite",
      "protection-from-evil-and-good",
      "shield-of-faith"
    ],
    "reason": "穿甲持盾近战，圣疗帮助同伴；命中后可用至圣斩，奉献之誓的圣洁武器提高命中。",
    "effort": "圣疗、引导神力和法术位分开记录；圣疗与斩击争用附赠动作。",
    "tags": [
      "melee",
      "support"
    ],
    "complexity": 1,
    "training": "简易和军用武器；全部护甲与盾牌。圣徽为职业法器；使用含姿势而无材料的法术需自由手。"
  },
  "sorcerer": {
    "name": "术士",
    "subclassId": "draconic",
    "subclass": "龙族术法",
    "skills": [
      "arcana",
      "deception",
      "insight",
      "intimidation",
      "persuasion",
      "religion"
    ],
    "count": 2,
    "hitDie": 6,
    "fixedHp": 4,
    "saves": [
      "constitution",
      "charisma"
    ],
    "equipment": [
      {
        "id": "spear",
        "quantity": 1
      },
      {
        "id": "dagger",
        "quantity": 2
      },
      {
        "id": "arcane-crystal",
        "quantity": 1
      },
      {
        "id": "dungeoneers-pack",
        "quantity": 1
      },
      {
        "id": "gp",
        "quantity": 28
      }
    ],
    "priority": [
      "charisma",
      "constitution",
      "dexterity",
      "wisdom",
      "intelligence",
      "strength"
    ],
    "background": "merchant",
    "cantripCount": 4,
    "preparedCount": 6,
    "auto": [
      "chromatic-orb",
      "command",
      "dragons-breath",
      "alter-self"
    ],
    "reason": "用先天术法提高职业施法效果，龙族体魄加强生存；两种超魔为法术提供变化。",
    "effort": "管理先天术法、术法点和法术位；超魔有各自适用条件。",
    "tags": [
      "magic"
    ],
    "complexity": 2,
    "training": "简易武器，无护甲受训。奥术水晶为职业法器；无甲时龙族体魄提供独立 AC 公式。"
  }
};
NEW_CLASSES.bard.skills = Object.keys(SKILLS) as SkillId[];
export const NEW_CLASS_IDS = Object.keys(NEW_CLASSES) as NewClassId[];
export function isNewClass(id: ClassId | string): id is NewClassId { return Object.prototype.hasOwnProperty.call(NEW_CLASSES, id); }
