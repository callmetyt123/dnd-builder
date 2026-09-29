import { isNewClass } from "../data/newClasses";
import { newSubclassDefaults } from "./newClasses";
import { changePrimalSubclass, reconcilePrimalChoices, isPrimalBuild } from "./primalSubclasses";
import type { PrimalSubclassId } from "./types";
import { speciesCantripIds } from "./species";
import { featSources } from "./origins";
import type { CharacterBuild, FighterSubclass, WizardSubclass } from "./types";
import { defaultFighterChoices, FIGHTER_SUBCLASSES, WIZARD_SUBCLASSES } from "../data/expandedSubclasses";
import { SPELL_LIST, spell, type Spell } from "../data/spells";
import { defaultBuild } from "./defaultBuild";

export { defaultFighterChoices } from "../data/expandedSubclasses";
export function originCantripIds(build: CharacterBuild): string[] {
  return [...speciesCantripIds(build), ...featSources(build).flatMap((f) => f.id === "magic-initiate" ? f.choices.magicInitiate.cantrips : [])];
}
// 已从起源知晓次级幻象时，额外名额改选未知晓的法师戏法；不删除原来源。
export function illusionCantrip(build: CharacterBuild): string {
  const w = build.choices.wizard!;
  if (w.illusionCantrip !== undefined) return w.illusionCantrip;
  const known = [...w.cantrips, ...originCantripIds(build)];
  return known.includes("minor-illusion") ? SPELL_LIST.find((s) => s.level === 0 && !known.includes(s.id))?.id ?? "minor-illusion" : "minor-illusion";
}
export function wizardSchool(build: CharacterBuild) { return WIZARD_SUBCLASSES[build.subclassId as WizardSubclass]; }
export function subclassFeatures(build: CharacterBuild): string[] {
  return build.classId === "fighter" ? FIGHTER_SUBCLASSES[build.subclassId as FighterSubclass].features : build.classId === "wizard" ? wizardSchool(build).features : [];
}

// 切换只替换不合法的学派名额；保留其余抄录与仍在书中的准备项，避免清空自定义配置。
export function changeExpandedSubclass(build: CharacterBuild, id: FighterSubclass | WizardSubclass): CharacterBuild {
  if (build.subclassId === id) return build;
  if (build.classId === "fighter" && Object.prototype.hasOwnProperty.call(FIGHTER_SUBCLASSES, id)) return { ...build, subclassId: id, choices: { ...build.choices, fighter: build.choices.fighter ?? defaultFighterChoices() } };
  if (build.classId !== "wizard" || !Object.prototype.hasOwnProperty.call(WIZARD_SUBCLASSES, id)) return build;
  const w = build.choices.wizard!, school = WIZARD_SUBCLASSES[id as WizardSubclass];
  const baseBook = [...w.earlyBook, ...w.level3Book];
  const allowed = SPELL_LIST.filter((s) => s.level > 0 && s.school === school.school && !baseBook.includes(s.id)).map((s) => s.id);
  const evocationBook = [...new Set([...w.evocationBook, ...school.book, ...allowed])].filter((key) => allowed.includes(key)).slice(0, 2);
  const book = [...baseBook, ...evocationBook];
  const prepared = [...new Set([...w.prepared.filter((key) => book.includes(key)), ...evocationBook, ...book])].slice(0, 6);
  const cantrips = w.cantrips;
  return { ...build, subclassId: id, choices: { ...build.choices, wizard: { ...w, cantrips, evocationBook, prepared, illusionCantrip: undefined } } };
}
export function subclassDefaults(build: CharacterBuild): CharacterBuild {
  if (isNewClass(build.classId)) return newSubclassDefaults(build);
  if (isPrimalBuild(build)) {
    const base = defaultBuild(build.classId);
    if (build.classId === "druid") base.choices.druid = { ...base.choices.druid!, land: build.choices.druid?.land, starForm: build.choices.druid?.starForm, starMap: build.choices.druid?.starMap };
    return reconcilePrimalChoices(changePrimalSubclass(base, build.subclassId as PrimalSubclassId));
  }
  let next = changeExpandedSubclass(defaultBuild(build.classId), build.subclassId as FighterSubclass | WizardSubclass);
  if (build.classId === "fighter" && ["eldritch-knight", "psi-warrior"].includes(build.subclassId)) next = { ...next, abilities: { ...next.abilities, baseAssignment: { strength: 15, dexterity: 12, constitution: 13, intelligence: 14, wisdom: 10, charisma: 8 } } };
  return next;
}
// 强化幻术也适用于起源获得的幻术；只改变呈现副本，不修改共享字典。
export function wizardSpell(build: CharacterBuild, id: string): Spell | undefined {
  const raw = spell(id);
  const s = raw && (build.classId === "wizard" || build.classId === "fighter") ? { ...raw, text: raw.text.split("若通过邪魔活力祈唤")[0].split("此法术不用攻击检定")[0] } : raw;
  if (!s || build.classId !== "wizard" || build.subclassId !== "illusionist" || s.school !== "幻术") return s;
  const distance = /^(\d+)\s*尺/.exec(s.range);
  return { ...s, range: distance && Number(distance[1]) >= 10 ? s.range.replace(distance[0], `${Number(distance[1]) + 60} 尺`) : s.range,
    components: s.components.replace(/^V(?:[、，,]\s*)?/, "") || "无", time: id === "minor-illusion" ? "动作或附赠动作" : s.time,
    text: s.text + (id === "minor-illusion" ? " 强化幻术：可在同一次施法同时创造声音与影像。" : "") };
}
