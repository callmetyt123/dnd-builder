import type { CharacterBuild, ClassId, ValidationMessage } from "../types";
import { defaultBuild } from "../defaultBuild";
import { changeSpecies } from "../species";
import { changeBackground, classSkills, recommendSkills, recommendedBoosts, ABILITY_PRIORITY } from "../origins";
import { BACKGROUNDS, RECOMMENDED_BACKGROUND, BACKGROUND_REASON } from "../../data/backgrounds";
import { STANDARD_LANGUAGE_IDS } from "../../data/core";
import { ROGUE_LANGUAGES } from "../../data/rogue";
import { SPECIES } from "../../data/species";
import { spell } from "../../data/spells";
import { abilityNames, skillNames } from "../../translations/zh-CN";

export const PLAYSTYLES = [
  ["melee", "近身保护同伴", "穿上护甲，靠近敌人，用武器战斗。"],
  ["ranged", "远处射箭", "保持距离，用弓箭帮助队伍。"],
  ["magic", "施展魔法", "用魔法攻击、移动或应对难题。"],
  ["support", "支援与治疗", "帮助受伤的同伴，或限制敌人行动。"],
  ["stealth", "潜行与解谜", "寻找线索、开锁，抓住出手机会。"],
  ["nature", "亲近自然与动物", "与动物合作，或亲自变成野兽。"],
] as const;
const route: Record<ClassId, { tags: string[]; complexity: number; reason: string; effort: string }> = {
  fighter: { tags: ["melee", "durability"], complexity: 0, reason: "用武器和护甲在前线作战，常用选择清楚。", effort: "较少：记住武器攻击、回气和动作如潮；护甲不能保证敌人只攻击你。" },
  rogue: { tags: ["stealth", "mobile", "ranged"], complexity: 1, reason: "擅长潜行、技能检定与寻找偷袭机会，也能使用短弓。", effort: "适中：留意偷袭条件和附赠动作；入门推荐盗贼子职。" },
  warlock: { tags: ["magic"], complexity: 1, reason: "以攻击戏法为常用手段，少量契约法术应对关键时刻。", effort: "适中：管理两格契约法术位和祈唤，短休恢复法术位。" },
  ranger: { tags: ["ranged", "nature", "hybrid"], complexity: 2, reason: "用长弓和动物伙伴协同，也有少量自然法术。", effort: "较多：同时安排自己和伙伴的行动；指挥伙伴与部分法术争用附赠动作。" },
  druid: { tags: ["support", "nature", "hybrid"], complexity: 2, reason: "兼顾治疗、控制与野兽变形，能帮助同伴并探索环境。", effort: "较多：需要查询法术和兽形，分别理解原形与兽形的能力。" },
  wizard: { tags: ["magic", "support"], complexity: 2, reason: "法术选择丰富，适合用奥术伤害和控制应对不同局面。", effort: "较多：理解准备法术、法术位和专注；当前塑能师不以治疗为长项。" },
};
// 偏好匹配优先于复杂度；复杂度只排序接近的路线，不把治疗偏好推成战士。
export function recommendClasses(preference: CharacterBuild["playstyle"]) {
  const desired = { simple: 0, balanced: 1, deep: 2 }[preference.complexity];
  const tags = [...new Set(preference.tags)];
  return (Object.keys(route) as ClassId[]).map((id) => {
    const r = route[id], matched = tags.filter((tag) => r.tags.includes(tag));
    const labels = matched.map((tag) => PLAYSTYLES.find(([key]) => key === tag)?.[1] ?? ({ mobile: "灵活作战", hybrid: "魔武结合", durability: "耐久防护" }[tag] ?? tag));
    return { id, ...r, score: matched.length * 10 - Math.abs(desired - r.complexity) * 2, reason: `${labels.length ? `符合「${labels.join("、")}」：` : "可作备选："}${r.reason}` };
  }).sort((a, b) => b.score - a.score);
}
export const STEP_NAMES: Record<string, string> = { playstyle: "玩法", class: "职业", species: "种族与语言", background: "背景", abilities: "属性", configuration: "职业配置", spells: "法术", identity: "身份", review: "检查" };
export type RecommendationStep = "species" | "background" | "abilities" | "configuration" | "spells";
export function isRecommendationStep(step: string): step is RecommendationStep { return ["species", "background", "abilities", "configuration", "spells"].includes(step); }
export function stepBlockers(messages: ValidationMessage[], step: string) {
  return messages.filter((m) => m.severity === "blocker" && (step === "review" || m.targetStep === step));
}

// 推荐只在玩家主动点击时应用，并限定到本步骤；关联选择的替换范围会在页面明示。
export function applyRecommendation(build: CharacterBuild, step: RecommendationStep): CharacterBuild {
  if (step === "species") return changeSpecies(build, build.classId === "rogue" ? "halfling" : "dwarf");
  if (step === "background") return changeBackground(build, RECOMMENDED_BACKGROUND[build.classId]);
  const defaults = defaultBuild(build.classId);
  if (step === "abilities") return { ...build, abilities: { baseAssignment: defaults.abilities.baseAssignment, backgroundBoosts: recommendedBoosts(build.classId, build.backgroundId) } };
  const choices = { ...build.choices };
  if (step === "configuration") {
    choices.weaponMasteries = defaults.choices.weaponMasteries;
    if (build.classId === "fighter") { choices.fighterSkills = defaults.choices.fighterSkills; choices.fightingStyle = "defense"; }
    if (build.classId === "wizard" && choices.wizard) choices.wizard = { ...choices.wizard, skills: defaults.choices.wizard!.skills, scholar: defaults.choices.wizard!.scholar };
    if (build.classId === "druid" && choices.druid) choices.druid = { ...choices.druid, skills: defaults.choices.druid!.skills, knownForms: defaults.choices.druid!.knownForms };
    if (build.classId === "warlock" && choices.warlock) choices.warlock = { ...choices.warlock, skills: defaults.choices.warlock!.skills, invocations: defaults.choices.warlock!.invocations, cantrips: defaults.choices.warlock!.cantrips };
    if (build.classId === "ranger" && choices.ranger) choices.ranger = { ...choices.ranger, skills: defaults.choices.ranger!.skills, expertise: "perception", style: "archery", primal: defaults.choices.ranger!.primal, extraLanguages: STANDARD_LANGUAGE_IDS.filter((id) => id !== "common" && !choices.languages.includes(id)).slice(0, 2) };
    if (build.classId === "rogue" && choices.rogue) choices.rogue = { ...choices.rogue, skills: defaults.choices.rogue!.skills, expertise: defaults.choices.rogue!.expertise, extraLanguage: ROGUE_LANGUAGES.find((id) => !["common", "thieves-cant", ...choices.languages].includes(id))! };
    return recommendSkills({ ...build, choices });
  }
  if (build.classId === "wizard" && choices.wizard) choices.wizard = { ...defaults.choices.wizard!, skills: choices.wizard.skills, scholar: choices.wizard.scholar };
  if (build.classId === "druid" && choices.druid) choices.druid = { ...choices.druid, cantrips: defaults.choices.druid!.cantrips.slice(0, choices.druid.order === "magician" ? 3 : 2), prepared: defaults.choices.druid!.prepared };
  if (build.classId === "warlock" && choices.warlock) choices.warlock = { ...choices.warlock, cantrips: defaults.choices.warlock!.cantrips, prepared: defaults.choices.warlock!.prepared };
  if (build.classId === "ranger" && choices.ranger) choices.ranger = { ...choices.ranger, prepared: defaults.choices.ranger!.prepared };
  if (build.classId === "rogue" && choices.rogue) choices.rogue = { ...choices.rogue, cantrips: defaults.choices.rogue!.cantrips, prepared: defaults.choices.rogue!.prepared };
  return { ...build, choices };
}
const configurationWhy: Record<ClassId, string> = {
  fighter: "防御风格少一项主动操作；巨剑、连枷和标枪精通都对应起始装备。", rogue: "用技能发现线索、处理机关；匕首与短弓精通对应起始装备。", wizard: "用技能调查线索、理解魔法；学者专精从已有熟练中选取。", druid: "棕熊、恐狼用于作战，猫与獾辅助探索；保留你选的原初职能。", warlock: "以魔能爆作常用攻击，搭配苦痛魔爆、斥力魔爆和魔能意志。", ranger: "箭术配合长弓，陆地伙伴辅助战斗；语言会避开已掌握的种类。",
};
const spellWhy: Record<ClassId, string> = { fighter: "", rogue: "心灵之楔与次级幻象辅助队伍，易容术等法术辅助社交和潜行。", wizard: "火焰箭用于日常攻击；魔法飞弹提供稳定伤害，护盾术防护，蛛网术限制敌人。", druid: "荆棘之鞭用于攻击，治愈真言帮助受伤同伴，纠缠术限制移动。", warlock: "魔能爆是常用攻击；脆弱诅咒配合攻击检定，黯冰狱铠防护，迷踪步脱离危险。", ranger: "疗伤术与神莓术支持队伍，捕获打击限制敌人，与动物交谈辅助探索。" };
export function recommendationInfo(build: CharacterBuild, step: RecommendationStep) {
  const next = applyRecommendation(build, step);
  if (step === "species") return { title: `入门备选：${SPECIES[next.speciesId].name}`, why: build.classId === "rogue" ? "半身人的灵巧形象适合潜行，幸运可重掷掷出 1 的 d20 检定。其他种族同样可选。" : "矮人提供额外生命值和黑暗视觉，适合先熟悉职业能力。其他种族同样可选。", scope: "只更换种族及其专属选项；额外语言仍按你的选择。", preview: "种族不限制职业；属性提升在背景步骤选择。", label: `选择${SPECIES[next.speciesId].name}` };
  if (step === "background") return { title: `推荐背景：${BACKGROUNDS[next.backgroundId].name}`, why: BACKGROUND_REASON[build.classId], scope: "更换背景、背景装备及背景加值；相关专长选项按原有切换规则更新。", preview: `获得${BACKGROUNDS[next.backgroundId].skills.map((id) => skillNames[id]).join("、")}熟练。`, label: "采用推荐背景" };
  if (step === "abilities") return { title: "先采用推荐属性", why: `优先${abilityNames[ABILITY_PRIORITY[build.classId][0]]}，支持这个职业的常用攻击或施法，再兼顾生存能力。`, scope: "替换六项基础属性及背景加值，仍遵守你当前背景允许提升的属性。", preview: Object.entries(next.abilities.baseAssignment).map(([id, score]) => `${abilityNames[id as keyof typeof abilityNames]} ${score}`).join(" · "), label: "采用推荐属性" };
  if (step === "configuration") return { title: "这一套配置可以直接开始", why: configurationWhy[build.classId], scope: `替换职业技能、专精与本页推荐项；${build.classId === "warlock" ? "祈唤及绑定的两道戏法一起替换。" : build.classId === "ranger" ? "包括风格、精通、额外语言和伙伴外形。" : build.classId === "rogue" ? "包括精通和额外语言，保留所选子职。" : build.classId === "druid" ? "包括已知兽形，保留原初职能与法术。" : "保留起源、属性与法术。"}`, preview: `推荐职业技能：${classSkills(next).map((id) => skillNames[id]).join("、")}。避开起源已提供的熟练；没有空余选项时才保留重复。`, label: "采用推荐职业配置" };
  const magic = next.choices[next.classId === "fighter" ? "wizard" : next.classId];
  return { title: "先用这组法术熟悉角色", why: build.classId === "druid" && build.choices.druid?.order === "warden" ? "指引术辅助检定，自然伎俩表现自然魔法；治愈真言帮助同伴，纠缠术限制敌人。" : spellWhy[build.classId], scope: `替换职业戏法与准备法术${build.classId === "wizard" ? "及法术书" : ""}；起源法术保留。${build.classId === "warlock" ? "保留祈唤；若绑定失效，检查清单会引导你修正。" : ""}`, preview: `准备：${magic?.prepared.map((id) => spell(id)?.name ?? id).join("、") ?? ""}。`, label: "采用推荐法术" };
}
