import { MANEUVERS } from "../../data/expandedSubclasses";
import { ARTISAN_TOOLS } from "../../data/originOptions";
import { PROFILES } from "../../data/profiles";
import { WEAPONS } from "../../data/weapons";
import { SPELL_LIST } from "../../data/spells";
import type { CharacterBuild, ValidationMessage } from "../types";

export function validateFighter(build: CharacterBuild): ValidationMessage[] {
  const f = build.choices.fighter, out: ValidationMessage[] = [];
  const block = (id: string, message: string, targetStep = "configuration") => out.push({ id, message, targetStep, severity: "blocker", domain: "rules" });
  if (build.subclassId === "champion") return out;
  if (!f) { block("fighter-options", "请补齐子职配置。"); return out; }
  if (build.subclassId === "battle-master") {
    if (f.maneuvers.length !== 3 || new Set(f.maneuvers).size !== 3 || f.maneuvers.some((id) => !Object.prototype.hasOwnProperty.call(MANEUVERS, id))) block("maneuvers", "选择三项不同的战技。");
    if (!PROFILES.fighter.skills.includes(f.studentSkill)) block("student-skill", "战争学者需要一项战士职业列表中的技能。");
    if (!Object.prototype.hasOwnProperty.call(ARTISAN_TOOLS, f.artisanTool)) block("student-tool", "战争学者需要一种工匠工具熟练。");
    if (build.choices.fighterSkills.includes(f.studentSkill)) out.push({ id: "student-duplicate", message: "战争学者与职业技能重复，熟练不会叠加；建议改选。", targetStep: "configuration", severity: "warning", domain: "recommendation" });
  }
  if (build.subclassId === "eldritch-knight") {
    for (const [key, count, level] of [["cantrips", 2, 0], ["prepared", 3, 1]] as const) if (f[key].length !== count || new Set(f[key]).size !== count || f[key].some((id) => !SPELL_LIST.some((s) => s.id === id && s.level === level))) block(`knight-${key}`, key === "cantrips" ? "选择两道不同的法师戏法。" : "选择三道不同的一环法师法术。", "spells");
    // 联结是可选的出发准备；不从精通列表推断角色拥有武器。
    const owned = [...PROFILES.fighter.equipment];
    if (f.bondedWeapons.length > 2 || new Set(f.bondedWeapons).size !== f.bondedWeapons.length || f.bondedWeapons.some((id) => !Object.prototype.hasOwnProperty.call(WEAPONS, id) || !owned.some((e) => e.id === id))) block("war-bond", "从战士起始包选择至多两种不同的联结武器；也可留空后在线下联结。");
    out.push({ id: "knight-material", domain: "recommendation", severity: "info", targetStep: "spells", message: "战士起始包不赠送施法法器。含材料的法术需先备材料或购置奥术法器；联结武器不会自动成为法器。" });
  }
  return out;
}
