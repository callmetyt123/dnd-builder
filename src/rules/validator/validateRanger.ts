import { proficientSkills } from "../origins";
import { PROFILES } from "../../data/profiles";
import { STANDARD_LANGUAGE_IDS } from "../../data/core";
import { RANGER_MASTERIES, RANGER_PREPARABLE, primalForm } from "../../data/ranger";
import type { CharacterBuild, ValidationMessage } from "../types";

export function validateRanger(build: CharacterBuild): ValidationMessage[] {
  const r = build.choices.ranger!;
  const messages: ValidationMessage[] = [];
  const check = (ok: boolean, id: string, message: string, targetStep = "configuration") => { if (!ok) messages.push({ id, domain: "rules", severity: "blocker", message, targetStep }); };
  const unique = (ids: string[], count: number) => ids.length === count && new Set(ids).size === count;
  check(unique(r.skills, 3) && r.skills.every((id) => PROFILES.ranger.skills.includes(id)), "ranger-skills", "选择 3 项不同的游侠职业技能。" );
  check(proficientSkills(build).includes(r.expertise), "ranger-expertise", "专精须选择已熟练技能。" );
  // 额外语言与角色创建语言分别保存，但不能重复消耗名额。
  check(unique(r.extraLanguages, 2) && r.extraLanguages.every((id) => (STANDARD_LANGUAGE_IDS as readonly string[]).includes(id) && !["common", ...build.choices.languages].includes(id)), "ranger-languages", "熟练探险家需选择两门尚未掌握的语言；本阶段开放标准语言子集。" );
  check(["archery", "defense"].includes(r.style), "ranger-style", "本阶段战斗风格可选箭术或防御。" );
  check(unique(build.choices.weaponMasteries, 2) && build.choices.weaponMasteries.every((id) => RANGER_MASTERIES.includes(id)), "ranger-mastery", "选择两种当前装备武器的精通。" );
  check(unique(r.prepared, 4) && r.prepared.every((id) => RANGER_PREPARABLE.includes(id)), "ranger-spells", "选择 4 道不同的一环游侠法术；猎人印记额外准备。", "spells");
  check(!!primalForm(r.primal.form)?.damageTypes.includes(r.primal.damage) && r.primal.appearance.trim().length > 0 && r.primal.appearance.length <= 40, "ranger-primal", "选择合法伙伴类型与伤害类型，并填写至多 40 字的外形。" );
  return messages;
}
