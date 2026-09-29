import { illusionCantrip, originCantripIds } from "../expandedSubclasses";
import { validateFighter } from "./validateFighter";
import type { WizardSubclass } from "../types";
import { validateRogue } from "./validateRogue";
import { validateOrigins } from "./validateOrigins";
import { validateRanger } from "./validateRanger";
import { validateWarlock } from "./validateWarlock";
import { validateDruid } from "./validateDruid";
import { validateWizard } from "./validateWizard";
import { alignmentNames } from "../../translations/zh-CN";
import { hasBuildShape, isSupportedBuild } from "./buildShape";
import { BACKGROUNDS } from "../../data/backgrounds";
import { classSkills, ABILITY_PRIORITY, proficientSkills } from "../origins";
import { FIGHTER } from "../../data/classes/fighter";
import { STANDARD_ARRAY, STANDARD_LANGUAGE_IDS } from "../../data/core";
import { WEAPONS } from "../../data/weapons";
import type { AbilityId, ValidationMessage, ValidationResult } from "../types";
import { deriveCharacter } from "../engine/deriveCharacter";

function multiset(values: number[]) {
  return [...values].sort((a, b) => a - b).join(",");
}

export function validateBuild(build: unknown): ValidationResult {
  const messages: ValidationMessage[] = [];
  if (!hasBuildShape(build) || !isSupportedBuild(build)) {
    return { rulesLegal: false, complete: false, supported: false, canGenerate: false, messages: [{ id: "unsupported-build", domain: "support", severity: "blocker", message: "数据结构或角色方案不受支持。当前支持三级、六种职业、十五条子职路线、十种种族和十六种背景。" }] };
  }
  const fighter = build.classId === "fighter";
  const background = BACKGROUNDS[build.backgroundId];
  if (build.identity.alignment && !Object.prototype.hasOwnProperty.call(alignmentNames, build.identity.alignment)) {
    messages.push({ id: "identity-alignment-invalid", domain: "rules", severity: "blocker", message: "请选择有效的阵营。", targetStep: "identity" });
  }
  if (build.identity.age !== undefined && (!Number.isInteger(build.identity.age) || build.identity.age < 0)) {
    messages.push({ id: "identity-age", domain: "rules", severity: "blocker", message: "年龄应为非负整数，或留空。", targetStep: "identity" });
  }
  if (build.identity.name.length > 60 || (build.identity.gender?.length ?? 0) > 30 || (build.identity.appearance?.length ?? 0) > 300 || (build.identity.description?.length ?? 0) > 600 || (build.identity.personalityTraits?.length ?? 0) > 3 || build.identity.personalityTraits?.some((trait) => trait.length > 30)) {
    messages.push({ id: "identity-length", domain: "completeness", severity: "blocker", message: "姓名最多 60 字、性别 30 字、外貌 300 字、简介 600 字，性格特点最多 3 项。", targetStep: "identity" });
  }
  messages.push(...validateOrigins(build));

  if (!build.identity.name.trim()) {
    messages.push({ id: "identity-name", domain: "completeness", severity: "blocker", message: "请填写角色姓名。", targetStep: "identity" });
  }
  if (!build.identity.alignment) {
    messages.push({ id: "identity-alignment", domain: "completeness", severity: "blocker", message: "请选择角色阵营。", targetStep: "identity" });
  }

  if (multiset(Object.values(build.abilities.baseAssignment)) !== multiset([...STANDARD_ARRAY])) {
    messages.push({ id: "abilities-standard-array", domain: "rules", severity: "blocker", message: "属性基础值必须使用标准数组 15 / 14 / 13 / 12 / 10 / 8，并且每个数值只能使用一次。", targetStep: "abilities" });
  }

  const boosts = Object.entries(build.abilities.backgroundBoosts) as [AbilityId, number][];
  const allowedBoosts = new Set<AbilityId>(background.abilities);
  if (boosts.some(([ability]) => !allowedBoosts.has(ability))) {
    messages.push({ id: "background-boost-target", domain: "rules", severity: "blocker", message: "属性提升必须属于所选背景允许的三项属性。", targetStep: "abilities" });
  }
  const boostValues = boosts.map(([, value]) => value).filter(Boolean).sort();
  const legalBoost = JSON.stringify(boostValues) === JSON.stringify([1, 2]) || JSON.stringify(boostValues) === JSON.stringify([1, 1, 1]);
  if (!legalBoost) {
    messages.push({ id: "background-boost-shape", domain: "rules", severity: "blocker", message: "背景属性提升必须是 +2/+1，或三项各 +1。", targetStep: "abilities" });
  }

  if (fighter) {
  messages.push(...validateFighter(build));
  if (build.choices.fighterSkills.length !== FIGHTER.skillCount || new Set(build.choices.fighterSkills).size !== FIGHTER.skillCount) {
    messages.push({ id: "fighter-skills-count", domain: "rules", severity: "blocker", message: `战士需要选择 ${FIGHTER.skillCount} 项不同的职业技能。`, targetStep: "configuration" });
  }
  const invalidFighterSkill = build.choices.fighterSkills.find((skill) => !(FIGHTER.skillOptions as readonly string[]).includes(skill));
  if (invalidFighterSkill) {
    messages.push({ id: "fighter-skills-list", domain: "rules", severity: "blocker", message: "存在不属于战士职业技能列表的选择。", targetStep: "configuration" });
  }

  if (build.choices.weaponMasteries.length !== FIGHTER.weaponMasteryCount || new Set(build.choices.weaponMasteries).size !== FIGHTER.weaponMasteryCount) {
    messages.push({ id: "weapon-mastery-count", domain: "rules", severity: "blocker", message: `3级战士需要选择 ${FIGHTER.weaponMasteryCount} 种不同的精通武器。`, targetStep: "configuration" });
  }
  if (build.choices.weaponMasteries.some((id) => !Object.prototype.hasOwnProperty.call(WEAPONS, id))) {
    messages.push({ id: "weapon-mastery-known", domain: "rules", severity: "blocker", message: "当前开发切片中存在尚未录入规则数据的武器精通选择。", targetStep: "configuration" });
  }

  } else if (build.classId === "rogue") messages.push(...validateRogue(build));
  else if (build.classId === "ranger") messages.push(...validateRanger(build));
  else if (build.classId === "warlock") messages.push(...validateWarlock(build.choices.warlock!));
  else if (build.classId === "druid") messages.push(...validateDruid(build.choices.druid!));
  else messages.push(...validateWizard(build.choices.wizard!, proficientSkills(build), build.subclassId as WizardSubclass, originCantripIds(build), illusionCantrip(build)));

  if (build.choices.languages.length !== 2 || new Set(build.choices.languages).size !== 2) {
    messages.push({ id: "language-count", domain: "rules", severity: "blocker", message: "角色需要另外选择两种不同的标准语言。", targetStep: "species" });
  }
  if (build.choices.languages.some((id) => !(STANDARD_LANGUAGE_IDS as readonly string[]).includes(id) || id === "common")) {
    messages.push({ id: "language-list", domain: "rules", severity: "blocker", message: "请选择两种合法的额外标准语言。", targetStep: "species" });
  }

  const duplicated = classSkills(build).filter((skill) => background.skills.includes(skill));
  if (duplicated.length) messages.push({ id: "duplicate-skill", domain: "recommendation", severity: "warning", message: "职业技能与背景重复，熟练不会叠加。可在背景页一键调整，或在职业配置页改选其他职业技能。", targetStep: "background" });
  if (!background.abilities.includes(ABILITY_PRIORITY[build.classId][0])) messages.push({ id: "background-main-ability", domain: "recommendation", severity: "warning", message: "这个背景不能提升当前职业的主要属性。仍可完成车卡；若更看重命中或法术效果，可以使用推荐背景。", targetStep: "background" });
  const derived = deriveCharacter(build);
  if (fighter && derived.abilities.strength.score < 14) {
    messages.push({ id: "heavy-fighter-low-str", domain: "recommendation", severity: "warning", message: `当前力量为 ${derived.abilities.strength.score}；这会降低推荐的重武器战士命中与伤害。`, targetStep: "abilities" });
  }
  if (derived.speed < 30) {
    messages.push({ id: "heavy-armor-speed", domain: "recommendation", severity: "warning", message: "当前力量不足以满足所穿重甲的力量要求，因此速度降低 10 尺。", targetStep: "abilities" });
  }

  const carriedIds = new Set(derived.equipment.map((item) => item.id));
  const notCarried = build.choices.weaponMasteries.filter((id) => !carriedIds.has(id));
  if (notCarried.length > 0) {
    messages.push({ id: "mastery-not-carried", domain: "recommendation", severity: "info", message: `你精通的 ${notCarried.length} 种武器当前不在起始装备中；获得这些武器前无法立即利用对应精通。`, targetStep: "configuration" });
  }

  const rulesLegal = !messages.some((m) => m.domain === "rules" && m.severity === "blocker");
  const complete = !messages.some((m) => m.domain === "completeness" && m.severity === "blocker");
  const supported = !messages.some((m) => m.domain === "support" && m.severity === "blocker");

  return {
    rulesLegal,
    complete,
    supported,
    canGenerate: rulesLegal && complete && supported,
    messages,
  };
}
