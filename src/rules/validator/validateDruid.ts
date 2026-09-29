import { automaticMagic, LAND_TYPES, STAR_FORMS, STAR_MAPS } from "../../data/primalSubclasses";
import type { CharacterBuild } from "../types";
import { PROFILES } from "../../data/profiles";
import { DRUID_CANTRIPS, DRUID_PREPARABLE } from "../../data/druidSpells";
import { legalDruidForm } from "../../data/beasts";
import type { DruidChoices, ValidationMessage } from "../types";

// 名额分别校验，自动获得的法术不能占用职业准备名额。
export function validateDruid(d: DruidChoices, build?: CharacterBuild): ValidationMessage[] {
  const moon = !build || build.subclassId === "moon";
  const auto = build ? automaticMagic(build) : { cantrips: ["starry-wisp"], prepared: ["speak-with-animals", "cure-wounds", "moonbeam"] };
  const messages: ValidationMessage[] = [];
  const check = (valid: boolean, id: string, message: string, targetStep = "configuration") => {
    if (!valid) messages.push({ id, domain: "rules", severity: "blocker", message, targetStep });
  };
  const distinct = (ids: string[], n: number) => ids.length === n && new Set(ids).size === n;
  check(distinct(d.skills, 2) && d.skills.every((s) => PROFILES.druid.skills.includes(s)), "druid-skills", "选择 2 项不同的德鲁伊职业技能。");
  check(["magician", "warden"].includes(d.order), "druid-order", "请选择术师或卫士。");
  check(distinct(d.knownForms, 4) && d.knownForms.every((id) => legalDruidForm(id, moon)), "known-forms", `选择 4 种不同的已录入形态；三级${moon ? "月亮结社允许 CR ≤ 1" : "当前结社允许 CR ≤ 1/4"}，均无飞行速度。`);
  check(distinct(d.cantrips, d.order === "magician" ? 3 : 2) && d.cantrips.every((id) => DRUID_CANTRIPS.includes(id) && !auto.cantrips.includes(id)), "druid-cantrips", "选择正确数量的职业戏法；不含结社自动提供的戏法。", "spells");
  check(distinct(d.prepared, 6) && d.prepared.every((id) => DRUID_PREPARABLE.includes(id) && !auto.prepared.includes(id)), "druid-prepared", "选择 6 道不同的职业准备法术，不包括始终准备的法术。", "spells");
  if (build?.subclassId === "land") check(Object.prototype.hasOwnProperty.call(LAND_TYPES, d.land ?? "temperate"), "land-type", "请选择合法大地地形。");
  if (build?.subclassId === "stars") {
    check(Object.prototype.hasOwnProperty.call(STAR_FORMS, d.starForm ?? "archer"), "star-form", "请选择星座入门偏好。");
    check(Object.prototype.hasOwnProperty.call(STAR_MAPS, d.starMap ?? "scroll"), "star-map", "请选择星图外观。");
  }
  return messages;
}
