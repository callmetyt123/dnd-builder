import type { CharacterBuild, ValidationMessage } from "../types";
import { PROFILES } from "../../data/profiles";
import { ROGUE_LANGUAGES, ROGUE_MASTERIES } from "../../data/rogue";
import { magicOptions, proficientSkills } from "../origins";

export function validateRogue(build: CharacterBuild): ValidationMessage[] {
  const r = build.choices.rogue!, messages: ValidationMessage[] = [];
  const check = (ok: boolean, id: string, message: string, targetStep = "configuration") => { if (!ok) messages.push({ id, message, targetStep, severity: "blocker", domain: "rules" }); };
  const unique = (ids: string[], n: number) => ids.length === n && new Set(ids).size === n;
  check(unique(r.skills, 4) && r.skills.every((id) => PROFILES.rogue.skills.includes(id)), "rogue-skills", "请选择 4 项不同的游荡者职业技能。");
  check(unique(r.expertise, 2) && r.expertise.every((id) => proficientSkills(build).includes(id)), "rogue-expertise", "请选择两项不同的已熟练技能作为专精；来源可以是职业、背景或起源专长。");
  check(ROGUE_LANGUAGES.includes(r.extraLanguage) && !["common", "thieves-cant", ...build.choices.languages].includes(r.extraLanguage), "rogue-language", "额外语言须选尚未掌握的一门；盗贼黑话已自动习得。");
  check(unique(build.choices.weaponMasteries, 2) && build.choices.weaponMasteries.every((id) => ROGUE_MASTERIES.includes(id)), "rogue-mastery", "选择两种不同且具有熟练的武器精通。");
  // 非施法子职保留编辑过的法术选择，但不授予法术，也不以这些字段拦截车卡。
  if (build.subclassId === "arcane-trickster") {
    const list = magicOptions("wizard");
    check(unique(r.cantrips, 2) && r.cantrips.every((id) => id !== "mage-hand" && list.some((s) => s.id === id && s.level === 0)), "trickster-cantrips", "法师之手自动习得，另选两道不同的法师戏法。", "spells");
    check(unique(r.prepared, 3) && r.prepared.every((id) => list.some((s) => s.id === id && s.level === 1)), "trickster-prepared", "请选择三道不同的一环法师法术；三级不能准备二环法术。", "spells");
    if (r.prepared.some((id) => list.find((s) => s.id === id)?.components.includes("M"))) messages.push({ id: "trickster-materials", message: "所选法术有材料成分；起始包不赠送奥术法器或材料包。游玩前核对材料与装备，不影响当前构筑合法性。", targetStep: "spells", domain: "recommendation", severity: "warning" });
  }
  return messages;
}
