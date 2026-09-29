import type { AbilityId, AlignmentId, SkillId } from "../rules/types";

export const zhCN = {
  class: { ranger: "游侠",
    fighter: "战士", wizard: "法师", druid: "德鲁伊", warlock: "魔契师",
  },
  subclass: { "beast-master": "驯兽师", ranger: "游侠",
    champion: "勇士", evoker: "塑能师", moon: "月亮结社", fiend: "邪魔宗主",
  },
  species: {
    dwarf: "矮人",
  },
  background: {
    soldier: "士兵", sage: "智者", hermit: "隐士", wayfarer: "流浪者",
acolyte: "侍僧", artisan: "工匠", charlatan: "骗子", criminal: "罪犯", entertainer: "艺人", farmer: "农民", guard: "警卫", guide: "向导", merchant: "商人", noble: "贵族", sailor: "水手", scribe: "抄写员",
  },
  fightingStyle: {
    defense: "防御",
  },
  mastery: {
    graze: "擦掠", nick: "迅击", topple: "推倒",
    sap: "削弱",
    slow: "缓速",
    vex: "侵扰",
  },
  weapon: { longbow: "长弓", shortsword: "短剑", scimitar: "弯刀",
    sickle: "镰刀", greatsword: "巨剑", dagger: "匕首", quarterstaff: "长棍",
    flail: "连枷",
    javelin: "标枪",
    spear: "矛",
    shortbow: "短弓",
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
    "dwarven-toughness": "矮人刚毅",
    stonecunning: "石中精妙",
  },
  language: {
    druidic: "德鲁伊语", common: "通用语",
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

export function masteryName(id: string): string {
  // 新增精通尚未校对中文译名时，保留稳定 ID，避免显示为空。
  const names: Readonly<Record<string, string>> = zhCN.mastery;
  return names[id] ?? id;
}

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
