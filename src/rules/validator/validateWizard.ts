import { WIZARD_SUBCLASSES } from "../../data/expandedSubclasses";
import type { WizardSubclass } from "../types";
import { PROFILES, SCHOLAR_SKILLS } from "../../data/profiles";
import { spell as anySpell, SPELL_LIST } from "../../data/spells";
import type { ValidationMessage, WizardChoices, SkillId } from "../types";

// 职业列表边界独立于共享法术字典，防止导入德鲁伊专属法术。
const spell = (id: string) => SPELL_LIST.some((s) => s.id === id) ? anySpell(id) : undefined;

// Learning sources have different level/school constraints; prepared spells are a subset of the book.
export function validateWizard(w: WizardChoices, backgroundSkills: readonly SkillId[] = ["arcana", "history"], subclass: WizardSubclass = "evoker", origins: string[] = [], bonus = w.illusionCantrip ?? "minor-illusion"): ValidationMessage[] {
  const messages: ValidationMessage[] = [];
  const block = (id: string, message: string, targetStep = "spells") => messages.push({ id, domain: "rules", severity: "blocker", message, targetStep });
  const distinct = (ids: string[], count: number) => ids.length === count && new Set(ids).size === count;
  const profile = PROFILES.wizard;
  const school = WIZARD_SUBCLASSES[subclass].school;
  if (subclass === "illusionist") {
    const known = [...w.cantrips, ...origins];
    if (spell(bonus)?.level !== 0 || known.includes(bonus) || (bonus !== "minor-illusion" && !known.includes("minor-illusion"))) block("illusion-cantrip", "强化幻术额外习得次级幻象；已经从职业或起源习得时，改选一道尚未知晓的法师戏法。");
  }
  if (!distinct(w.skills, 2) || w.skills.some((id) => !profile.skills.includes(id))) block("wizard-skills", "选择 2 项不同的法师职业技能。", "configuration");
  if (!SCHOLAR_SKILLS.includes(w.scholar) || ![...backgroundSkills, ...w.skills].includes(w.scholar)) block("scholar", "学者专精须选择已熟练的奥秘、历史、调查、医药、自然或宗教。", "configuration");
  if (!distinct(w.cantrips, 3) || w.cantrips.some((id) => spell(id)?.level !== 0)) block("cantrips", "选择 3 道不同的法师戏法。");
  if (!distinct(w.earlyBook, 8) || w.earlyBook.some((id) => spell(id)?.level !== 1)) block("early-book", "一至二级学习的 8 道法术必须是一环法术。");
  if (!distinct(w.level3Book, 2) || w.level3Book.some((id) => !spell(id) || ![1, 2].includes(spell(id)!.level))) block("level3-book", "三级升级选择 2 道一环或二环法术。");
  if (!distinct(w.evocationBook, 2) || w.evocationBook.some((id) => !spell(id) || ![1, 2].includes(spell(id)!.level) || spell(id)!.school !== school)) block("evocation-book", `${school}学者额外学习 2 道一环或二环${school}法术。`);
  const book = [...w.earlyBook, ...w.level3Book, ...w.evocationBook];
  if (new Set(book).size !== book.length) block("book-duplicates", "法术书各学习来源不能重复，需收录 12 道不同法术。");
  if (!distinct(w.prepared, 6) || w.prepared.some((id) => !book.includes(id))) block("prepared", "从法术书中准备 6 道不同的法术。");
  return messages;
}
