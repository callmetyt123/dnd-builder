import { newSubclass, newSkillCount, newAutoSpells, newAutoCantrips, NEW_SUBCLASSES } from "../data/newSubclasses";
import { NEW_CLASSES, isNewClass } from "../data/newClasses";
import { NEW_CLASS_SPELL_IDS } from "../data/newClassSpells";
import { METAMAGIC, PALADIN_STYLES } from "../data/newClassFeatures";
import { spell } from "../data/spells";
import { WEAPONS } from "../data/weapons";
import { INSTRUMENTS, ARTISAN_TOOLS } from "../data/originOptions";
import { defaultOriginChoices, recommendedBoosts, proficientSkills } from "./origins";
import type { CharacterBuild, NewClassId, NewClassChoices, ValidationMessage, SkillId, AbilityId, NewSubclassId } from "./types";

export function newChoices(build: CharacterBuild): NewClassChoices | undefined { return isNewClass(build.classId) ? build.choices[build.classId] : undefined; }
export function newSpellIds(id: NewClassId): string[] { return id === "barbarian" || id === "monk" ? [] : NEW_CLASS_SPELL_IDS[id]; }
export function newCantripCount(build: CharacterBuild): number {
  if (!isNewClass(build.classId)) return 0;
  const q = newChoices(build)!;
  return NEW_CLASSES[build.classId].cantripCount + Number(build.classId === "cleric" && q.order === "thaumaturge") + (build.classId === "paladin" && q.style === "blessed-warrior" ? 2 : 0);
}
export function newCantripIds(build: CharacterBuild): string[] {
  return (build.classId === "paladin" ? NEW_CLASS_SPELL_IDS.cleric : isNewClass(build.classId) ? newSpellIds(build.classId) : []).filter((id) => spell(id)?.level === 0 && !newAutoCantrips(build).includes(id));
}
const starter: Record<NewClassId, {skills: SkillId[]; cantrips: string[]; prepared: string[]}> = {
  barbarian: { skills: ["athletics", "perception", "survival"], cantrips: [], prepared: [] },
  bard: { skills: ["persuasion", "insight", "perception", "stealth", "arcana", "investigation"], cantrips: ["vicious-mockery", "minor-illusion"], prepared: ["healing-word", "dissonant-whispers", "faerie-fire", "detect-magic", "invisibility", "suggestion"] },
  cleric: { skills: ["insight", "persuasion"], cantrips: ["sacred-flame", "guidance", "thaumaturgy", "light"], prepared: ["healing-word", "guiding-bolt", "detect-magic", "shield-of-faith", "spiritual-weapon", "prayer-of-healing"] },
  monk: { skills: ["stealth", "insight"], cantrips: [], prepared: [] },
  paladin: { skills: ["athletics", "insight"], cantrips: [], prepared: ["bless", "cure-wounds", "divine-favor", "command"] },
  sorcerer: { skills: ["arcana", "insight"], cantrips: ["fire-bolt", "ray-of-frost", "mage-hand", "prestidigitation"], prepared: ["shield", "magic-missile", "burning-hands", "detect-magic", "misty-step", "web"] },
};
export function newDefaults(base: CharacterBuild, id: NewClassId): CharacterBuild {
  const d = NEW_CLASSES[id];
  const q: NewClassChoices = { ...starter[id], skills: [...starter[id].skills], cantrips: [...starter[id].cantrips], prepared: [...starter[id].prepared], expertise: id === "bard" ? ["persuasion", "perception"] : [], tools: id === "bard" ? ["lute", "flute", "drum"] : id === "monk" ? ["calligraphers-supplies"] : [], instrument: "lute", order: "thaumaturge", style: "defense", metamagic: id === "sorcerer" ? ["empowered", "subtle"] : [] };
  const origin = defaultOriginChoices(id);
  // 艺人背景的音乐家另选三种乐器，避免默认方案重复职业熟练。
  if (id === "bard") origin.musician = ["horn", "lyre", "viol"];
  const baseAssignment = Object.fromEntries(d.priority.map((a, i) => [a, [15, 14, 13, 12, 10, 8][i]])) as Record<AbilityId, number>;
  return { ...base, classId: id, subclassId: d.subclassId, profileId: id, backgroundId: d.background,
    abilities: { baseAssignment, backgroundBoosts: recommendedBoosts(id, d.background) },
    choices: { ...base.choices, [id]: q, fighterSkills: [], weaponMasteries: id === "barbarian" ? ["greataxe", "handaxe"] : id === "paladin" ? ["longsword", "javelin"] : [], origin },
    equipment: { classPackage: `${id}-a`, backgroundPackage: `${d.background}-a` } };
}
// 调整圣职／风格时只协调戏法数量，不覆盖已选准备法术与起源。
export function patchNewChoices(build: CharacterBuild, patch: Partial<NewClassChoices>): CharacterBuild {
  if (!isNewClass(build.classId)) return build;
  const q = { ...newChoices(build)!, ...patch };
  const next = { ...build, choices: { ...build.choices, [build.classId]: q } };
  if (patch.skills && build.classId === "bard") q.expertise = q.expertise.filter((id) => proficientSkills(next).includes(id));
  if (patch.order !== undefined || patch.style !== undefined) {
    const ids = newCantripIds(next), n = newCantripCount(next);
    q.cantrips = [...new Set([...q.cantrips, "sacred-flame", "guidance", ...ids])].filter((id) => ids.includes(id)).slice(0, n);
  }
  return next;
}
export function newMasteryIds(id: NewClassId): string[] { return Object.keys(WEAPONS).filter((key) => id === "paladin" || (id === "barbarian" && WEAPONS[key].category.endsWith("melee"))); }
export function validateNewClass(build: CharacterBuild): ValidationMessage[] {
  if (!isNewClass(build.classId)) return [];
  const id = build.classId, d = NEW_CLASSES[id], q = newChoices(build)!, out: ValidationMessage[] = [];
  const unique = (v: string[], count: number, all: readonly string[]) => v.length === count && new Set(v).size === count && v.every((x) => all.includes(x));
  const check = (ok: boolean, key: string, text: string, step = "configuration") => { if (!ok) out.push({ id: key, domain: "rules", severity: "blocker", message: text, targetStep: step }); };
  check(unique(q.skills, newSkillCount(build), d.skills), "new-skills", `选择 ${newSkillCount(build)} 项不同的职业技能${build.subclassId === "lore" ? "（含逸闻额外三项）" : id === "barbarian" ? "（含原初学识一项）" : ""}。`);
  if (id === "bard") { check(unique(q.expertise, 2, proficientSkills(build)), "bard-expertise", "选择两项已熟练技能作为专精。"); check(unique(q.tools, 3, Object.keys(INSTRUMENTS)), "bard-tools", "选择三种不同乐器熟练。"); check(Object.prototype.hasOwnProperty.call(INSTRUMENTS, q.instrument), "bard-instrument", "选择包 A 中的乐器实物。"); }
  if (id !== "bard" && id !== "monk") check(q.tools.length === 0, "new-no-tools", "当前职业不授予自选工具熟练。");
  if (id === "monk") check(unique(q.tools, 1, [...Object.keys(ARTISAN_TOOLS), ...Object.keys(INSTRUMENTS)]), "monk-tool", "选择一种工匠工具或乐器熟练，包 A 提供该工具。");
  if (id === "cleric") check(["protector", "thaumaturge"].includes(q.order), "cleric-order", "选择保护者或奇术使圣职。");
  if (id === "paladin") check(Object.prototype.hasOwnProperty.call(PALADIN_STYLES, q.style), "paladin-style", "选择当前开放的战斗风格或受祝福的勇士。");
  if (id === "sorcerer") check(unique(q.metamagic, 2, Object.keys(METAMAGIC)), "sorcerer-metamagic", "选择两种不同的超魔法。");
  if (id === "barbarian" || id === "paladin") check(unique(build.choices.weaponMasteries, 2, newMasteryIds(id)), "new-masteries", "选择两种符合本职业要求的已录入武器精通。");
  else check(build.choices.weaponMasteries.length === 0, "new-no-masteries", "当前职业不授予武器精通。");
  check(unique(q.cantrips, newCantripCount(build), newCantripIds(build)), "new-cantrips", `选择 ${newCantripCount(build)} 道职业戏法。`, "spells");
  check(unique(q.prepared, d.preparedCount, newSpellIds(id).filter((s) => spell(s)?.level !== 0 && !newAutoSpells(build).includes(s))), "new-prepared", `选择 ${d.preparedCount} 道职业准备法术，自动授予另计。`, "spells");
  if (build.subclassId === "wild-heart") check(["bear", "eagle", "wolf"].includes(q.wildHeart ?? "bear"), "wild-heart-choice", "选择兽性狂暴的入门示例。");
  if (build.subclassId === "clockwork") check(["gears", "eyes", "brass", "geometry", "focus", "sound"].includes(q.manifestation ?? "gears"), "clockwork-manifestation", "选择秩序显迹外观。");
  return out;
}

// 子职切换只剔除失效项，不偷偷补进玩家未选的法术；缺额由页面提示修复。
export function changeNewSubclass(build: CharacterBuild, subclassId: NewSubclassId): CharacterBuild {
  if (!isNewClass(build.classId) || NEW_SUBCLASSES[subclassId]?.classId !== build.classId || build.subclassId === subclassId) return build;
  const q = newChoices(build)!;
  const next = { ...build, subclassId };
  const skills = q.skills.slice(0, newSkillCount(next));
  const updated = { ...q, skills, prepared: q.prepared.filter(id => !newAutoSpells(next).includes(id)), cantrips: q.cantrips.filter(id => !newAutoCantrips(next).includes(id)), wildHeart: q.wildHeart ?? "bear", manifestation: q.manifestation ?? "gears" };
  const result = { ...next, choices: { ...build.choices, [build.classId]: updated } };
  updated.expertise = updated.expertise.filter(id => proficientSkills(result).includes(id));
  return result;
}
// 推荐采用当前子职；已授予法术不再占用手选名额。
export function newSubclassDefaults(build: CharacterBuild): CharacterBuild {
  if (!isNewClass(build.classId)) return build;
  let next = changeNewSubclass(newDefaults(build, build.classId), build.subclassId as NewSubclassId);
  const q = newChoices(next)!, subclass = newSubclass(next);
  const prepared = [...new Set([...(build.classId === "sorcerer" && build.subclassId !== "draconic" ? ["mage-armor", "shield", "magic-missile", "misty-step", "web"] : []), ...q.prepared, ...starter[build.classId].prepared, ...newSpellIds(build.classId)])].filter(id => spell(id)!.level > 0 && !subclass.auto.includes(id) && id !== "divine-smite").slice(0, NEW_CLASSES[build.classId].preparedCount);
  const cantrips = [...new Set([...q.cantrips, ...newCantripIds(next)])].filter(id => newCantripIds(next).includes(id)).slice(0, newCantripCount(next));
  next = { ...next, choices: { ...next.choices, [build.classId]: { ...q, prepared, cantrips } } };
  // 武器型牧师仍需感知，但提高力量；舞者保留魅力与敏捷，主动采用时才替换属性。
  if (build.subclassId === "war") next = { ...next, abilities: { ...next.abilities, baseAssignment: { wisdom:15, strength:14, constitution:13, dexterity:12, charisma:10, intelligence:8 } }, choices: { ...next.choices, cleric:{...next.choices.cleric!,order:"protector",cantrips:cantrips.slice(0,3)} } };
  return next;
}
