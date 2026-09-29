import type { SpeciesId } from "../rules/types";

export interface SpeciesDefinition { name: string; description: string; speed: number; darkvision?: number; lifespan: number; sizes: ("small" | "medium")[]; lineages?: Record<string, string>; features: string[] }
// 此目录只包含三级已获得的特质；龙裔飞行、歌利亚大型形态等五级能力不提前授予。
export const SPECIES: Record<SpeciesId, SpeciesDefinition> = {
  dwarf: { name: "矮人", description: "结实坚韧，擅长在黑暗与岩石间探索。被动能力较多，容易上手。", speed: 30, darkvision: 120, lifespan: 350, sizes: ["medium"], features: ["darkvision", "dwarven-resilience", "dwarven-toughness", "stonecunning"] },
  aasimar: { name: "阿斯莫", description: "带有天界特征的凡人，能治疗与短暂变身。每次变身再选择效果。", speed: 30, darkvision: 60, lifespan: 160, sizes: ["medium", "small"], features: ["celestial-resistance", "healing-hands", "celestial-revelation"] },
  dragonborn: { name: "龙裔", description: "龙形外貌，选择龙族先祖决定吐息与抗性。三级尚不能飞行。", speed: 30, darkvision: 60, lifespan: 80, sizes: ["medium"], lineages: { black: "黑龙 · 强酸", blue: "蓝龙 · 闪电", brass: "黄铜龙 · 火焰", bronze: "青铜龙 · 闪电", copper: "赤铜龙 · 强酸", gold: "金龙 · 火焰", green: "绿龙 · 毒素", red: "红龙 · 火焰", silver: "银龙 · 寒冷", white: "白龙 · 寒冷" }, features: ["breath-weapon"] },
  elf: { name: "精灵", description: "尖耳、长寿，通过冥想休息；血系带来不同的探索魔法。", speed: 30, darkvision: 60, lifespan: 750, sizes: ["medium"], lineages: { high: "高等精灵", wood: "木精灵", drow: "卓尔" }, features: ["fey-ancestry", "keen-senses", "trance"] },
  gnome: { name: "侏儒", description: "小巧、机敏，对精神影响有很强的防御，并掌握实用魔法。", speed: 30, darkvision: 60, lifespan: 425, sizes: ["small"], lineages: { forest: "森林侏儒", rock: "岩石侏儒" }, features: ["gnomish-cunning"] },
  goliath: { name: "歌利亚", description: "高大、步伐迅速，巨人先祖赋予一种有限次数的特殊能力。", speed: 35, lifespan: 80, sizes: ["medium"], lineages: { cloud: "云巨人", fire: "火巨人", frost: "霜巨人", hill: "山丘巨人", stone: "石巨人", storm: "风暴巨人" }, features: ["powerful-build", "giant-ancestry"] },
  halfling: { name: "半身人", description: "小巧勇敢，善于利用遮蔽；检定掷出 1 时有再次尝试的机会。", speed: 30, lifespan: 150, sizes: ["small"], features: ["brave", "halfling-nimbleness", "halfling-luck", "naturally-stealthy"] },
  human: { name: "人类", description: "形象自由，额外获得技能与起源专长；选择较多，已提供推荐配置。", speed: 30, lifespan: 80, sizes: ["medium", "small"], features: ["resourceful", "skillful", "versatile"] },
  orc: { name: "兽人", description: "高壮、有獠牙，能迅速冲锋，并在濒危时坚持站立。", speed: 30, darkvision: 120, lifespan: 80, sizes: ["medium"], features: ["adrenaline-rush", "relentless-endurance"] },
  tiefling: { name: "提夫林", description: "带有邪魔祖先的外貌特征，遗赠提供抗性与法术，不限制阵营。", speed: 30, darkvision: 60, lifespan: 80, sizes: ["medium", "small"], lineages: { infernal: "炼狱", abyssal: "深渊", chthonic: "幽冥" }, features: ["fiendish-legacy"] },
};
export const DRAGON_DAMAGE: Record<string, string> = { black: "acid", blue: "lightning", brass: "fire", bronze: "lightning", copper: "acid", gold: "fire", green: "poison", red: "fire", silver: "cold", white: "cold" };
export const GIANT_GIFTS: Record<string, string> = {
  cloud: "云之远迹：附赠动作传送至 30 尺内可见且未占据的位置。",
  fire: "火之燃烧：攻击检定命中并造成伤害时，额外造成 1d10 火焰伤害。",
  frost: "霜之刺骨：攻击检定命中并造成伤害时，额外造成 1d6 寒冷伤害，目标速度 −10 尺至你下回合开始。",
  hill: "山之翻撞：攻击检定命中大型或更小生物并造成伤害时，可使其倒地。",
  stone: "石之坚韧：受到伤害时用反应，使该次伤害减少 1d12 + 体质调整值。",
  storm: "岚之暴鸣：60 尺内生物对你造成伤害时，用反应对它造成 1d8 雷鸣伤害。",
};
export const DAMAGE_NAMES: Record<string, string> = { acid: "强酸", lightning: "闪电", fire: "火焰", poison: "毒素", cold: "寒冷", radiant: "光耀", necrotic: "暗蚀" };
