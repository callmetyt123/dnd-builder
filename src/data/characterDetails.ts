// 文案按 PHB 2024 的当前等级整理；每项只说明适用条件和操作。
export const GAMING_SETS: Record<string, string> = {
  "dice-set": "骰子套组", "dragonchess-set": "龙棋套组", "playing-card-set": "纸牌套组", "three-dragon-ante-set": "三龙牌套组",
};
export const itemNames: Record<string, string> = {
  dagger: "匕首", quarterstaff: "长棍（其中一根为奥术法器）", robe: "长袍", spellbook: "法术书", "scholars-pack": "学者套组", "calligraphers-supplies": "书法工具", "history-book": "历史书", parchment: "羊皮纸",
  "chain-mail": "链甲", greatsword: "巨剑", flail: "连枷", javelin: "标枪", spear: "矛", shortbow: "短弓",
  "dungeoneers-pack": "地城探索者套组", arrow: "箭", quiver: "箭袋", "healers-kit": "医疗包（10 次）", "travelers-clothes": "旅行者服装", gp: "金币（GP）", ...GAMING_SETS,
};
export const damageNames: Record<string, string> = { slashing: "挥砍", piercing: "穿刺", bludgeoning: "钝击" };
export const features: Record<string, { name: string; timing: string; text: string }> = {
  "spell-slot-1": { name: "一环法术位", timing: "施法", text: "施展一环法术时消耗。" },
  "spell-slot-2": { name: "二环法术位", timing: "施法", text: "可施展二环法术，或升环施展一环法术。" },
  spellcasting: { name: "施法", timing: "智力 · 法师", text: "3 道职业戏法、6 道职业准备法术；法术书或奥术法器可代替无标价且不消耗的材料。一回合只能消耗一个法术位施法。" },
  "ritual-adept": { name: "仪式学家", timing: "施法时间额外 +10 分钟", text: "读法术书可施展书中带仪式标签的法术，无须准备、不耗法术位。施法期间需持续专注，每回合使用魔法动作。" },
  "arcane-recovery": { name: "奥术回想", timing: "短休结束时 · 每长休一次", text: "恢复已消耗的法术位，总环阶至多为 2：一个二环，或一至两个一环。普通短休不会自动恢复法术位。" },
  scholar: { name: "学者", timing: "技能专精 · 法师", text: "所选已熟练学术技能的熟练加值翻倍，已计入技能栏。" },
  "evocation-savant": { name: "塑能学者", timing: "法术书 · 塑能师", text: "额外学习两道不高于二环的塑能法术，已加入法术书；仍需准备才能正常施展。" },
  "potent-cantrip": { name: "强力戏法", timing: "伤害戏法失手或目标豁免成功", text: "目标生物仍受到戏法的一半伤害（向下取整），但不承受其他效果。二环灼热射线不适用。三级尚无保护盟友的法术塑形。" },
  "magic-initiate": { name: "魔法学徒", timing: "贤者 · 每长休一次免费施法", text: "所选 2 道戏法及 1 道一环法术使用指定施法属性。一环法术始终准备、不占职业名额；可免费施展一次，也可用法术位施展。" },
  "fighting-style-defense": { name: "防御", timing: "被动 · 战斗风格", text: "穿着轻甲、中甲或重甲时 AC +1，已计入。" },
  "second-wind": { name: "回气", timing: "附赠动作 · 战士", text: "恢复 1d10+3 HP。与战术思维共用次数；短休恢复 1 次，长休全部恢复。" },
  "weapon-mastery": { name: "武器精通", timing: "被动 · 战士", text: "可用已选 3 种武器的精通属性；长休后可更换其中 1 种。" },
  "action-surge": { name: "动作如潮", timing: "自己的回合 · 战士", text: "获得 1 个额外动作，不能用于魔法动作。短休或长休恢复。" },
  "tactical-mind": { name: "战术思维", timing: "属性检定失败时 · 战士", text: "花费 1 次回气，在检定上加 1d10；若仍失败则不消耗次数。" },
  "improved-critical": { name: "精通重击", timing: "被动 · 勇士", text: "武器攻击与徒手打击的 d20 掷出 19–20 即为重击。" },
  "remarkable-athlete": { name: "运动健将", timing: "被动 · 勇士", text: "先攻与力量（运动）检定具有优势；重击后可立即移动至多速度一半，不触发借机攻击。" },
  darkvision: { name: "黑暗视觉", timing: "被动 · 矮人", text: "120 尺；微光视为明亮，黑暗视为微光（仅灰度）。" },
  "dwarven-resilience": { name: "矮人体魄", timing: "被动 · 矮人", text: "毒素伤害抗性；避免或结束中毒状态的豁免具有优势。" },
  "dwarven-toughness": { name: "矮人刚毅", timing: "被动 · 矮人", text: "每级 HP 上限 +1，三级合计 +3，已计入。" },
  stonecunning: { name: "石中精妙", timing: "附赠动作 · 矮人", text: "获得 60 尺震颤感知，持续 10 分钟；必须站在或接触石质表面才能使用该感知。长休恢复全部次数。" },
  "savage-attacker": { name: "凶蛮打手", timing: "每回合一次 · 起源专长", text: "武器命中时，将武器伤害骰掷两组，选择其中一组使用。" },
};
export const masteryDescriptions: Record<string, string> = {
  graze: "未命中生物时，仍可造成等于攻击属性调整值的同类型伤害；只有提高该调整值才能增加此伤害。",
  sap: "命中后，目标下回合开始前的下一次攻击检定具有劣势。",
  slow: "命中并造成伤害后，目标速度降低 10 尺，至你的下回合开始；同种精通不叠加。",
  vex: "命中并造成伤害后，你在下回合结束前对该生物的下一次攻击检定具有优势。",
};
