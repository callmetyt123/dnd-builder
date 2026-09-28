import { PROFILES, SCHOLAR_SKILLS } from "../../data/profiles";
import { spell } from "../../data/spells";
import type { ValidationMessage, WizardChoices } from "../types";

// Learning sources have different level/school constraints; prepared spells are a subset of the book.
export function validateWizard(w: WizardChoices): ValidationMessage[] {
  const messages: ValidationMessage[] = [];
  const block = (id: string, message: string, targetStep = "spells") => messages.push({ id, domain: "rules", severity: "blocker", message, targetStep });
  const distinct = (ids: string[], count: number) => ids.length === count && new Set(ids).size === count;
  const profile = PROFILES.wizard;
  if (!distinct(w.skills, 2) || w.skills.some((id) => !profile.skills.includes(id)) || w.skills.some((id) => profile.backgroundSkills.includes(id))) block("wizard-skills", "选择 2 项不同的法师技能，贤者已提供奥秘与历史。", "configuration");
  if (!SCHOLAR_SKILLS.includes(w.scholar) || ![...profile.backgroundSkills, ...w.skills].includes(w.scholar)) block("scholar", "学者专精须选择已熟练的奥秘、历史、调查、医药、自然或宗教。", "configuration");
  if (!distinct(w.cantrips, 3) || w.cantrips.some((id) => spell(id)?.level !== 0)) block("cantrips", "选择 3 道不同的法师戏法。");
  if (!distinct(w.earlyBook, 8) || w.earlyBook.some((id) => spell(id)?.level !== 1)) block("early-book", "一至二级学习的 8 道法术必须是一环法术。");
  if (!distinct(w.level3Book, 2) || w.level3Book.some((id) => !spell(id) || ![1, 2].includes(spell(id)!.level))) block("level3-book", "三级升级选择 2 道一环或二环法术。");
  if (!distinct(w.evocationBook, 2) || w.evocationBook.some((id) => !spell(id) || ![1, 2].includes(spell(id)!.level) || spell(id)!.school !== "塑能")) block("evocation-book", "塑能学者额外学习 2 道一环或二环塑能法术。");
  const book = [...w.earlyBook, ...w.level3Book, ...w.evocationBook];
  if (new Set(book).size !== book.length) block("book-duplicates", "法术书各学习来源不能重复，需收录 12 道不同法术。");
  if (!distinct(w.prepared, 6) || w.prepared.some((id) => !book.includes(id))) block("prepared", "从法术书中准备 6 道不同的法术。");
  if (!distinct(w.initiateCantrips, 2) || w.initiateCantrips.some((id) => spell(id)?.level !== 0)) block("initiate-cantrips", "魔法学徒须选择 2 道不同的法师戏法。");
  if (spell(w.initiateSpell)?.level !== 1) block("initiate-spell", "魔法学徒须选择一道一环法师法术。");
  return messages;
}
