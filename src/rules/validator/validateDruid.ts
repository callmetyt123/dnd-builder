import { PROFILES } from "../../data/profiles";
import { DRUID_CANTRIPS, DRUID_PREPARABLE } from "../../data/druidSpells";
import { legalMoonForm } from "../../data/beasts";
import type { DruidChoices, ValidationMessage } from "../types";

// 名额分别校验，自动获得的法术不能占用职业准备名额。
export function validateDruid(d: DruidChoices): ValidationMessage[] {
  const messages: ValidationMessage[] = [];
  const check = (valid: boolean, id: string, message: string, targetStep = "configuration") => {
    if (!valid) messages.push({ id, domain: "rules", severity: "blocker", message, targetStep });
  };
  const distinct = (ids: string[], n: number) => ids.length === n && new Set(ids).size === n;
  check(distinct(d.skills, 2) && d.skills.every((s) => PROFILES.druid.skills.includes(s) && !PROFILES.druid.backgroundSkills.includes(s)), "druid-skills", "选择 2 项不同的职业技能；隐士已提供医药和宗教。");
  check(["magician", "warden"].includes(d.order), "druid-order", "请选择术师或卫士。");
  check(distinct(d.knownForms, 4) && d.knownForms.every(legalMoonForm), "known-forms", "选择 4 种不同的已录入形态；三级月亮结社仅允许 CR ≤ 1 且没有飞行速度的野兽。");
  check(distinct(d.cantrips, d.order === "magician" ? 3 : 2) && d.cantrips.every((id) => DRUID_CANTRIPS.includes(id)), "druid-cantrips", "选择正确数量的职业戏法；点点星芒由结社自动提供。", "spells");
  check(distinct(d.prepared, 6) && d.prepared.every((id) => DRUID_PREPARABLE.includes(id)), "druid-prepared", "选择 6 道不同的职业准备法术，不包括始终准备的法术。", "spells");
  return messages;
}
