import type { AbilityId, AlignmentId, SkillId } from "../rules/types";

export const zhCN = {
  class: {
    fighter: "战士",
  },
  subclass: {
    champion: "勇士",
  },
  species: {
    dwarf: "矮人",
  },
  background: {
    soldier: "士兵",
  },
  fightingStyle: {
    defense: "防御",
  },
  mastery: {
    graze: "擦掠",
    sap: "削弱",
    slow: "缓速",
  },
  weapon: {
    greatsword: "巨剑",
    flail: "连枷",
    javelin: "标枪",
  },
  armor: {
    "chain-mail": "链甲",
  },
  feature: {
    "second-wind": "回气",
    "action-surge": "动作如潮",
    "tactical-mind": "战术思维",
    "weapon-mastery": "武器精通",
    "improved-critical": "精通重击",
    "remarkable-athlete": "运动健将",
    "dwarven-toughness": "矮人坚韧",
    stonecunning: "石中精魂",
  },
  language: {
    common: "通用语",
    "common-sign-language": "通用手语",
    dwarvish: "矮人语",
    elvish: "精灵语",
    giant: "巨人语",
    gnomish: "侏儒语",
    goblin: "地精语",
    halfling: "半身人语",
    orc: "兽人语",
  },
} as const;

export const abilityNames: Record<AbilityId, string> = {
  strength: "力量",
  dexterity: "敏捷",
  constitution: "体质",
  intelligence: "智力",
  wisdom: "感知",
  charisma: "魅力",
};

export const skillNames: Record<SkillId, string> = {
  acrobatics: "体操",
  "animal-handling": "驯兽",
  arcana: "奥秘",
  athletics: "运动",
  deception: "欺瞒",
  history: "历史",
  insight: "洞悉",
  intimidation: "威吓",
  investigation: "调查",
  medicine: "医药",
  nature: "自然",
  perception: "察觉",
  performance: "表演",
  persuasion: "游说",
  religion: "宗教",
  "sleight-of-hand": "巧手",
  stealth: "隐匿",
  survival: "求生",
};

export const alignmentNames: Record<AlignmentId, string> = {
  LG: "守序善良",
  NG: "中立善良",
  CG: "混乱善良",
  LN: "守序中立",
  N: "绝对中立",
  CN: "混乱中立",
  LE: "守序邪恶",
  NE: "中立邪恶",
  CE: "混乱邪恶",
};

export const alignmentSummaries: Record<AlignmentId, string> = {
  LG: "遵循原则，并主动保护他人。",
  NG: "愿意做正确的事，但不拘泥于规则。",
  CG: "重视自由，并凭良知帮助他人。",
  LN: "重视规则、传统或明确的个人准则。",
  N: "根据现实情况判断，不轻易走向极端。",
  CN: "把个人自由置于规则和约束之前。",
  LE: "利用秩序、制度或承诺来达成自身目的。",
  NE: "优先自身利益，必要时愿意伤害他人。",
  CE: "随欲望行动，很少接受规则与道德约束。",
};
