import type { NewClassId, NewSubclassId, CharacterBuild } from "../rules/types";
export interface NewSubclassDefinition { classId: NewClassId; name: string; complexity: string; reason: string; effort: string; features: string[]; auto: string[] }
// 只列三级授予项；职业共通资源由职业引擎单独处理。
export const NEW_SUBCLASSES: Record<NewSubclassId, NewSubclassDefinition> = {
  "berserker": {
    "classId": "barbarian",
    "name": "狂战士道途",
    "complexity": "简单",
    "reason": "喜欢直接近战输出。狂暴配合鲁莽，首次力量命中追加伤害。",
    "effort": "敌人也更容易命中你。",
    "features": [
      "frenzy"
    ],
    "auto": []
  },
  "wild-heart": {
    "classId": "barbarian",
    "name": "兽心道途",
    "complexity": "适中",
    "reason": "喜欢动物主题与战场配合。每次狂暴选熊、鹰或狼。",
    "effort": "激活时选效果；仪式只能在非狂暴时使用。",
    "features": [
      "animal-speaker",
      "rage-wilds"
    ],
    "auto": []
  },
  "world-tree": {
    "classId": "barbarian",
    "name": "世界树道途",
    "complexity": "适中",
    "reason": "想在前线保护队友。狂暴给自己和近旁同伴临时生命。",
    "effort": "临时生命不相加；同伴需要在 10 尺内。",
    "features": [
      "tree-vitality"
    ],
    "auto": []
  },
  "zealot": {
    "classId": "barbarian",
    "name": "狂热者道途",
    "complexity": "简单",
    "reason": "喜欢神圣战士。狂暴首次命中加伤，还能用治疗骰自救。",
    "effort": "治疗与开启狂暴都要附赠动作。",
    "features": [
      "divine-fury",
      "warrior-gods"
    ],
    "auto": []
  },
  "lore": {
    "classId": "bard",
    "name": "逸闻学院",
    "complexity": "适中",
    "reason": "喜欢技能解谜与临场干扰。多三项技能，反应削弱敌人。",
    "effort": "激励和语出惊人共用次数。",
    "features": [
      "cutting-words",
      "lore-skills"
    ],
    "auto": []
  },
  "dance": {
    "classId": "bard",
    "name": "舞蹈学院",
    "complexity": "适中",
    "reason": "喜欢徒手舞者。无甲作战，消耗激励时顺势徒手打击。",
    "effort": "必须无甲无盾；三级没有额外攻击。",
    "features": [
      "dazzling-footwork"
    ],
    "auto": []
  },
  "glamour": {
    "classId": "bard",
    "name": "魅心学院",
    "complexity": "较多",
    "reason": "喜欢控场与团队移动。临时生命配合队友反应撤出险境。",
    "effort": "管理激励、惑心次数与专注。",
    "features": [
      "beguiling-magic",
      "mantle-inspiration"
    ],
    "auto": [
      "charm-person",
      "mirror-image"
    ]
  },
  "valor": {
    "classId": "bard",
    "name": "勇气学院",
    "complexity": "适中",
    "reason": "喜欢战歌支援。队友激励骰还能加伤害或应急 AC。",
    "effort": "新增护甲训练不赠送装备。",
    "features": [
      "combat-inspiration",
      "martial-training"
    ],
    "auto": []
  },
  "life": {
    "classId": "cleric",
    "name": "生命领域",
    "complexity": "适中",
    "reason": "想加强治疗。耗位治疗加成，危急时分配治疗量。",
    "effort": "维持生命只能治到半血。",
    "features": [
      "preserve-life",
      "disciple-of-life"
    ],
    "auto": [
      "aid",
      "bless",
      "cure-wounds",
      "lesser-restoration"
    ]
  },
  "light": {
    "classId": "cleric",
    "name": "光明领域",
    "complexity": "适中",
    "reason": "喜欢光耀火焰与反应保护。范围伤害并干扰攻击。",
    "effort": "守御之光和引导神力分别计次。",
    "features": [
      "radiance-dawn",
      "warding-flare"
    ],
    "auto": [
      "burning-hands",
      "faerie-fire",
      "scorching-ray",
      "see-invisibility"
    ]
  },
  "trickery": {
    "classId": "cleric",
    "name": "诡术领域",
    "complexity": "较多",
    "reason": "喜欢潜行与幻象。祝福帮助隐匿，分身改变施法位置。",
    "effort": "使用自己的感官；分身不会替你观察。",
    "features": [
      "blessing-trickster",
      "invoke-duplicity"
    ],
    "auto": [
      "charm-person",
      "disguise-self",
      "invisibility",
      "pass-without-trace"
    ]
  },
  "war": {
    "classId": "cleric",
    "name": "战争领域",
    "complexity": "适中",
    "reason": "喜欢武器支援。补救失手，附赠动作再攻击。",
    "effort": "战争祭司短休恢复；导引打击花引导神力。",
    "features": [
      "guided-strike",
      "war-priest"
    ],
    "auto": [
      "guiding-bolt",
      "shield-of-faith",
      "magic-weapon",
      "spiritual-weapon"
    ]
  },
  "open-hand": {
    "classId": "monk",
    "name": "散打武者",
    "complexity": "适中",
    "reason": "喜欢徒手控制。疾风连击命中后推离、击倒或阻止借机攻击。",
    "effort": "只有疾风连击命中才能触发散打。",
    "features": [
      "open-hand-technique"
    ],
    "auto": []
  },
  "shadow": {
    "classId": "monk",
    "name": "暗影武者",
    "complexity": "较多",
    "reason": "喜欢暗处潜行。制造能看穿的黑暗，用幻象掩护。",
    "effort": "黑暗也会挡住同伴；需专注。",
    "features": [
      "shadow-arts"
    ],
    "auto": []
  },
  "elements": {
    "classId": "monk",
    "name": "四象武者",
    "complexity": "适中",
    "reason": "喜欢元素拳法。延长徒手触及并拉近或推离敌人。",
    "effort": "每次同调花功力；推拉需力量豁免。",
    "features": [
      "elemental-attunement",
      "manipulate-elements"
    ],
    "auto": []
  },
  "mercy": {
    "classId": "monk",
    "name": "命流武者",
    "complexity": "适中",
    "reason": "想用拳法兼顾救人。功力用于追加暗蚀或触碰治疗。",
    "effort": "夺命每回合一次；治疗会减少连击次数。",
    "features": [
      "hand-harm",
      "hand-healing",
      "implements-mercy"
    ],
    "auto": []
  },
  "devotion": {
    "classId": "paladin",
    "name": "奉献之誓",
    "complexity": "适中",
    "reason": "喜欢正面守护。圣洁武器提高近战武器命中。",
    "effort": "不自动加伤害；需要引导神力。",
    "features": [
      "sacred-weapon",
      "devotion-oath"
    ],
    "auto": [
      "protection-from-evil-and-good",
      "shield-of-faith"
    ]
  },
  "ancients": {
    "classId": "paladin",
    "name": "古贤之誓",
    "complexity": "适中",
    "reason": "喜欢自然守护。近旁藤蔓束缚敌人，辅助队友。",
    "effort": "自然之怒占用动作，目标每轮可再豁免。",
    "features": [
      "natures-wrath"
    ],
    "auto": [
      "ensnaring-strike",
      "speak-with-animals"
    ]
  },
  "glory": {
    "classId": "paladin",
    "name": "荣耀之誓",
    "complexity": "适中",
    "reason": "喜欢鼓舞团队。至圣斩后分配临时生命，探索时加强运动。",
    "effort": "两种能力共用引导神力。",
    "features": [
      "inspiring-smite",
      "peerless-athlete"
    ],
    "auto": [
      "guiding-bolt",
      "heroism"
    ]
  },
  "vengeance": {
    "classId": "paladin",
    "name": "复仇之誓",
    "complexity": "适中",
    "reason": "喜欢追击强敌。攻击时立誓，针对一个目标获得优势。",
    "effort": "只对誓言目标有优势；猎人印记要专注。",
    "features": [
      "vow-enmity"
    ],
    "auto": [
      "bane",
      "hunters-mark"
    ]
  },
  "draconic": {
    "classId": "sorcerer",
    "name": "龙族术法",
    "complexity": "适中",
    "reason": "想兼顾魔法与生存。龙族体魄提高无甲 AC 与生命。",
    "effort": "三级没有元素抗性或飞行。",
    "features": [
      "draconic-resilience"
    ],
    "auto": [
      "chromatic-orb",
      "command",
      "dragons-breath",
      "alter-self"
    ]
  },
  "aberrant": {
    "classId": "sorcerer",
    "name": "畸变术法",
    "complexity": "较多",
    "reason": "喜欢心灵控制与秘密沟通。多种心灵法术、短暂传心谈话。",
    "effort": "仍需共同语言；三级不能用点数代替这些法术位。",
    "features": [
      "telepathic-speech"
    ],
    "auto": [
      "arms-of-hadar",
      "dissonant-whispers",
      "calm-emotions",
      "detect-thoughts"
    ]
  },
  "clockwork": {
    "classId": "sorcerer",
    "name": "时械术法",
    "complexity": "适中",
    "reason": "喜欢防护与稳定局势。反应取消优势或劣势。",
    "effort": "掷骰前使用，次数按魅力，长休恢复。",
    "features": [
      "restore-balance"
    ],
    "auto": [
      "protection-from-evil-and-good",
      "alarm",
      "lesser-restoration",
      "aid"
    ]
  },
  "wild-magic": {
    "classId": "sorcerer",
    "name": "狂野术法",
    "complexity": "较多",
    "reason": "喜欢不可预测的魔法。混乱之潮换取优势，也会引发浪涌。",
    "effort": "需要掷随机表，可能影响全队。",
    "features": [
      "wild-surge",
      "tides-chaos"
    ],
    "auto": []
  }
};
export function newSubclass(build: CharacterBuild) { return NEW_SUBCLASSES[build.subclassId as NewSubclassId]; }
export function newSkillCount(build: CharacterBuild) { return build.classId === "bard" ? (build.subclassId === "lore" ? 6 : 3) : build.classId === "barbarian" ? 3 : 2; }
export function newAutoSpells(build: CharacterBuild): string[] { return [...(build.classId === "paladin" ? ["divine-smite"] : []), ...(newSubclass(build)?.auto ?? [])]; }
export function newAutoCantrips(build: CharacterBuild): string[] { return build.subclassId === "aberrant" ? ["mind-sliver"] : []; }
