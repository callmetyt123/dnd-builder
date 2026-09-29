import type { CharacterBuild, DruidSubclass, WarlockSubclass, RangerSubclass, SkillId } from "../rules/types";

export interface PrimalSubclass { name: string; complexity: string; reason: string; features: string[]; cantrips: string[]; spells: string[] }
// 自动授予与职业自选名额分开，避免切换子职时留下旧宗主或旧结社的法术。
export const DRUID_SUBCLASSES: Record<DruidSubclass, PrimalSubclass> = {
  moon: { name: "月亮结社", complexity: "较复杂 · 野兽作战", reason: "变成较强野兽作战，需查阅兽形数据并留意施法限制。", features: ["circle-forms"], cantrips: ["starry-wisp"], spells: ["cure-wounds", "moonbeam"] },
  land: { name: "大地结社", complexity: "推荐 · 施法与支援", reason: "以法术为主，大地之援兼顾治疗与伤害；长休可更换地形魔法。", features: ["land-spells", "lands-aid"], cantrips: [], spells: [] },
  sea: { name: "海洋结社", complexity: "适中 · 近身光环", reason: "靠近敌人，以海浪造成寒冷伤害并推离；三级还不会游泳或飞行。", features: ["sea-spells", "wrath-of-sea"], cantrips: ["ray-of-frost"], spells: ["fog-cloud", "thunderwave", "gust-of-wind", "shatter"] },
  stars: { name: "星辰结社", complexity: "适中 · 选择星座", reason: "每次激活时选择射击、治疗或稳定专注；星耀形态保留原形数值。", features: ["star-map", "starry-form"], cantrips: ["guidance"], spells: ["guiding-bolt"] },
};
export const LAND_TYPES = {
  arid: { name: "荒漠", cantrip: "fire-bolt", spells: ["burning-hands", "blur"] },
  polar: { name: "极地", cantrip: "ray-of-frost", spells: ["fog-cloud", "hold-person"] },
  temperate: { name: "温带", cantrip: "shocking-grasp", spells: ["sleep", "misty-step"] },
  tropical: { name: "热带", cantrip: "acid-splash", spells: ["web", "ray-of-sickness"] },
};
export type LandType = keyof typeof LAND_TYPES;
export const STAR_FORMS = { archer: "射手座", chalice: "圣杯座", dragon: "巨龙座" };
export const STAR_MAPS = { scroll: "星座卷轴", stone: "钻孔石板", hide: "画有星辰的枭熊皮", book: "黑檀木封皮星图集", crystal: "投射星辰的水晶", glass: "星座玻璃圆盘" };
export const WARLOCK_SUBCLASSES: Record<WarlockSubclass, PrimalSubclass> = {
  fiend: { name: "邪魔宗主", complexity: "推荐 · 攻击与耐久", reason: "以攻击戏法为主，击倒附近敌人时获得临时生命值。", features: ["fiend-spells", "dark-ones-blessing"], cantrips: [], spells: ["burning-hands", "command", "scorching-ray", "suggestion"] },
  archfey: { name: "至高妖精宗主", complexity: "适中 · 传送与干扰", reason: "多次免费迷踪步，脱离危险时还能提供临时生命值或干扰敌人。", features: ["archfey-spells", "steps-of-the-fey"], cantrips: [], spells: ["faerie-fire", "sleep", "calm-emotions", "misty-step", "phantasmal-force"] },
  celestial: { name: "天界宗主", complexity: "适中 · 治疗骰池", reason: "保持攻击戏法，同时以治愈之光和额外法术支援同伴。", features: ["celestial-spells", "healing-light"], cantrips: ["light", "sacred-flame"], spells: ["cure-wounds", "guiding-bolt", "aid", "lesser-restoration"] },
  "great-old-one": { name: "旧日支配者宗主", complexity: "较复杂 · 心灵与控制", reason: "建立远距心灵联络；部分法术可省去言语姿势，并可改用心灵伤害。", features: ["great-old-one-spells", "awakened-mind", "psychic-spells"], cantrips: [], spells: ["dissonant-whispers", "tashas-hideous-laughter", "phantasmal-force", "detect-thoughts"] },
};
export const RANGER_SUBCLASSES: Record<RangerSubclass, PrimalSubclass> = {
  "beast-master": { name: "驯兽师", complexity: "较复杂 · 管理伙伴", reason: "与动物伙伴一起行动，需留意指挥和猎人印记争用附赠动作。", features: ["primal-companion"], cantrips: [], spells: [] },
  hunter: { name: "猎人", complexity: "推荐 · 武器与追猎", reason: "集中使用武器，推荐巨像屠夫；标记猎物后还能得知抗性与弱点。", features: ["hunters-lore", "hunters-prey"], cantrips: [], spells: [] },
  "fey-wanderer": { name: "妖精漫游者", complexity: "适中 · 战斗与交涉", reason: "武器附加心灵伤害，感知也能帮助魅力检定，适合交涉与探索。", features: ["dreadful-strikes", "fey-wanderer-magic", "otherworldly-glamour"], cantrips: [], spells: ["charm-person"] },
  "gloom-stalker": { name: "幽域追猎者", complexity: "适中 · 黑暗与伏击", reason: "更快行动并在黑暗中避开黑暗视觉；有限次数的恐惧打击加强命中。", features: ["dread-ambusher", "gloom-stalker-magic", "umbral-sight"], cantrips: [], spells: ["disguise-self"] },
};
export const HUNTERS_PREY = { "colossus-slayer": "巨像屠夫", "horde-breaker": "灭族者" };
export const FEY_SKILLS: SkillId[] = ["deception", "performance", "persuasion"];
export const FEY_GIFTS = { butterflies: "休息时蝴蝶绕身", flowers: "黎明时头发生花", fragrance: "淡淡药草香气", shadow: "无人直视时影子起舞", antlers: "头发间细角或触角", colors: "每天黎明肤色与发色改变" };
export function primalSubclass(build: CharacterBuild): PrimalSubclass | undefined {
  const table = build.classId === "druid" ? DRUID_SUBCLASSES : build.classId === "warlock" ? WARLOCK_SUBCLASSES : build.classId === "ranger" ? RANGER_SUBCLASSES : undefined;
  return table && Object.prototype.hasOwnProperty.call(table, build.subclassId) ? (table as Record<string, PrimalSubclass>)[build.subclassId] : undefined;
}
export function automaticMagic(build: CharacterBuild): { cantrips: string[]; prepared: string[] } {
  const sub = primalSubclass(build);
  if (!sub) return { cantrips: [], prepared: [] };
  const land = build.choices.druid?.land ?? "temperate";
  const terrain = Object.prototype.hasOwnProperty.call(LAND_TYPES, land) ? LAND_TYPES[land] : LAND_TYPES.temperate;
  return { cantrips: build.subclassId === "land" ? [terrain.cantrip] : sub.cantrips,
    prepared: [...(build.classId === "druid" ? ["speak-with-animals"] : build.classId === "ranger" ? ["hunters-mark"] : []), ...(build.subclassId === "land" ? terrain.spells : sub.spells)] };
}
export const PRIMAL_FEATURES: Record<string, { name: string; timing: string; text: string }> = {
  "land-spells": { name: "大地结社法术", timing: "每次长休后选择地形", text: "荒漠、极地、温带或热带，获得对应戏法与两道始终准备法术；不占职业自选名额。" },
  "lands-aid": { name: "大地之援", timing: "魔法动作 · 消耗一次荒野变形", text: "60 尺内选一点，10 尺半径球内由你选择的生物作体质豁免，失败受 2d6 暗蚀伤害、成功半伤；另选区域内一名生物恢复 2d6 HP。三级没有自然恢复。" },
  "sea-spells": { name: "海洋结社法术", timing: "始终准备", text: "额外获得冷冻射线、云雾术、雷鸣波、造风术和粉碎音波；不会获得月亮结社的兽形施法。" },
  "wrath-of-sea": { name: "瀚海之怒", timing: "附赠动作 · 消耗一次荒野变形", text: "显现自身 5 尺海浪光环，持续 10 分钟。激活时及后续回合用附赠动作，选择光环内另一可见生物：体质豁免失败受感知调整值枚 d6 寒冷伤害（至少一枚），大型或更小者可被推离至多 15 尺；成功无效果。解除、再激活或失能结束光环；三级不授予游泳、飞行或抗性。" },
  "star-map": { name: "星图", timing: "持握星图时", text: "星图为微型物件与德鲁伊法器；持握时始终准备神导术和光导箭。每长休可免费施展光导箭感知调整值次（至少一次），按一环；仍须成分。丢失后可在短休或长休进行一小时仪式重造，旧图随之消失。" },
  "starry-form": { name: "星耀形态", timing: "附赠动作 · 消耗一次荒野变形", text: "保留原形数据，发出 10 尺明亮及额外 10 尺微光，持续 10 分钟。每次激活选择射手、圣杯或巨龙；解除无需动作，失能、死亡或再次激活时结束。不是野兽变形，不赠临时 HP；三级不能在同一次形态中免费切换星座。" },
  "archfey-spells": { name: "至高妖精法术", timing: "始终准备", text: "妖火、睡眠术、安定心神、迷踪步、魅影之力；均独立于四项职业准备。" },
  "steps-of-the-fey": { name: "妖精步伐", timing: "施展迷踪步时", text: "每长休可免费施展迷踪步魅力调整值次（至少一次）。每次施展可选复苏步伐：传送后你或 10 尺内可见生物获 1d10 临时 HP；或嘲弄步伐：原位置 5 尺内生物感知豁免失败，至你下回合开始攻击除你外生物有劣势。三级只能附赠动作施展，尚无反应传送。" },
  "celestial-spells": { name: "天界法术", timing: "始终准备", text: "额外获得光亮术、圣火术、疗伤术、光导箭、援助术、次等复原术；按魅力施法，不占职业名额。" },
  "healing-light": { name: "治愈之光", timing: "附赠动作 · 长休恢复", text: "四枚 d6 的独立治疗骰池。选择自己或 60 尺内可见生物，每次消耗至多魅力调整值枚（至少一枚且不超过剩余），恢复所掷总值 HP。不消耗法术位，不是治疗法术。" },
  "great-old-one-spells": { name: "旧日支配者法术", timing: "始终准备", text: "不谐低语、塔莎狂笑术、魅影之力、侦测思想；均独立于四项职业准备。" },
  "awakened-mind": { name: "唤醒心灵", timing: "附赠动作", text: "与 30 尺内可见生物建立三分钟心灵连结；在魅力调整值英里内（至少一英里）可双向交谈，彼此需使用对方理解的语言。建立新连结会结束旧连结，不读取思想也不授予攻击优势。" },
  "psychic-spells": { name: "心灵法术", timing: "施展魔契师法术时", text: "可将造成的伤害改为心灵。惑控与幻术学派的魔契师法术可免言语和姿势，仍须材料；不自动强化起源法术。" },
  "hunters-lore": { name: "猎人学识", timing: "猎人印记生效时", text: "知道被你标记生物的全部免疫、抗性与易伤，请主持人告知具体项目。" },
  "hunters-prey": { name: "猎杀技艺", timing: "短休或长休可换选", text: "巨像屠夫：武器命中 HP 不满生物，每回合一次额外 1d8 同类型伤害。灭族者：每个自己的回合一次，武器攻击时可用同一武器另攻击原目标 5 尺内、在武器范围内且本回合未攻击过的另一生物。只拥有当前选择的一项。" },
  "dreadful-strikes": { name: "哀惧灵袭", timing: "武器命中时", text: "额外造成 1d4 心灵伤害，每名目标每回合至多一次。没有每日次数，不自动加进所有武器基础伤害。" },
  "fey-wanderer-magic": { name: "妖精漫游者魔法", timing: "始终准备", text: "三级额外准备魅惑类人，感知施法；精野之赐是外观表现，不增加其他能力。" },
  "otherworldly-glamour": { name: "妖冶娴都", timing: "被动", text: "所有魅力检定加感知调整值（至少 +1），不是豁免加值；另选欺瞒、表演或游说熟练。纸卡的魅力技能已计入。" },
  "dread-ambusher": { name: "恐惧伏击", timing: "首回合／武器命中时", text: "先攻加入感知调整值。战斗首个自己的回合速度 +10 尺，回合结束恢复。武器命中可加 2d6 心灵伤害，每回合最多一次、每长休感知调整值次（至少一次）；不是首轮免费额外攻击。" },
  "gloom-stalker-magic": { name: "幽域追猎者魔法", timing: "始终准备", text: "三级额外准备易容术，使用感知施法。" },
  "umbral-sight": { name: "阴影视野", timing: "被动／黑暗中", text: "获得 60 尺黑暗视觉，原已有黑暗视觉则增加 60 尺。完全处于黑暗时，对于依靠黑暗视觉看你的生物具有隐形状态；不等同于始终隐形。" },
};
