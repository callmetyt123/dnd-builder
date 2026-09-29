import { BACKGROUNDS } from "../data/backgrounds";
import { PROFILES, SCHOLAR_SKILLS } from "../data/profiles";
import type { AbilityId, BackgroundId, CharacterBuild, ClassId, OriginChoices, SkillId } from "./types";

export const ABILITY_PRIORITY: Record<ClassId, AbilityId[]> = {
  fighter: ["strength", "constitution", "dexterity", "wisdom", "charisma", "intelligence"],
  wizard: ["intelligence", "constitution", "dexterity", "wisdom", "charisma", "strength"],
  druid: ["wisdom", "constitution", "dexterity", "intelligence", "charisma", "strength"],
  warlock: ["charisma", "dexterity", "constitution", "wisdom", "intelligence", "strength"],
  ranger: ["dexterity", "wisdom", "constitution", "strength", "intelligence", "charisma"],
};

export function recommendedBoosts(classId: ClassId, backgroundId: BackgroundId) {
  const allowed = ABILITY_PRIORITY[classId].filter((id) => BACKGROUNDS[backgroundId].abilities.includes(id));
  return { [allowed[0]]: 2, [allowed[1]]: 1 };
}
export function defaultOriginChoices(classId: ClassId): OriginChoices {
  const ability = classId === "warlock" ? "charisma" : classId === "druid" || classId === "ranger" || classId === "fighter" ? "wisdom" : "intelligence";
  return { gamingSet: "dice-set", magicInitiate: { cantrips: [classId === "wizard" ? "light" : "prestidigitation", "mage-hand"], spell: classId === "wizard" ? "mage-armor" : "shield", ability } };
}
export function classSkills(build: CharacterBuild): SkillId[] {
  return build.classId === "fighter" ? build.choices.fighterSkills : build.choices[build.classId]!.skills;
}
export function proficientSkills(build: CharacterBuild): SkillId[] {
  return [...new Set([...classSkills(build), ...BACKGROUNDS[build.backgroundId].skills])];
}

// 更换背景保留玩家的职业技能；重复熟练只提示，不悄悄替换玩家选择。
export function changeBackground(build: CharacterBuild, backgroundId: BackgroundId): CharacterBuild {
  if (backgroundId === build.backgroundId) return build;
  return { ...build, backgroundId, abilities: { ...build.abilities, backgroundBoosts: recommendedBoosts(build.classId, backgroundId) }, equipment: { ...build.equipment, backgroundPackage: `${backgroundId}-a` } };
}

// 一键修复只动重复技能和失效专精；从本职业列表补齐，不额外授予熟练。
export function recommendSkills(build: CharacterBuild): CharacterBuild {
  const background = BACKGROUNDS[build.backgroundId];
  const count = build.classId === "ranger" ? 3 : 2;
  const options = PROFILES[build.classId].skills.filter((id) => !background.skills.includes(id));
  const skills = [...new Set([...classSkills(build).filter((id) => options.includes(id)), ...options])].slice(0, count);
  const choices = { ...build.choices };
  if (build.classId === "fighter") choices.fighterSkills = skills;
  else if (build.classId === "wizard") {
    const w = choices.wizard!;
    const available = [...skills, ...background.skills];
    const scholar = available.includes(w.scholar) ? w.scholar : SCHOLAR_SKILLS.find((id) => available.includes(id))!;
    choices.wizard = { ...w, skills, scholar };
  } else if (build.classId === "ranger") {
    const r = choices.ranger!;
    choices.ranger = { ...r, skills, expertise: [...skills, ...background.skills].includes(r.expertise) ? r.expertise : skills[0] };
  } else if (build.classId === "druid") choices.druid = { ...choices.druid!, skills };
  else choices.warlock = { ...choices.warlock!, skills };
  return { ...build, choices };
}

export function toolProficiencies(build: CharacterBuild): string[] {
  const tool = BACKGROUNDS[build.backgroundId].tool;
  return [...new Set([tool === "gaming-set" ? build.choices.origin.gamingSet : tool, ...(build.classId === "druid" ? ["herbalism-kit"] : [])])];
}
