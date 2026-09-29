import { SKILLS } from "../data/core";
import { TOOL_OPTIONS, CRAFTER_TOOLS, INSTRUMENTS } from "../data/originOptions";
import { ORIGIN_SPELL_IDS } from "../data/originSpells";
import { spell } from "../data/spells";
import type { FeatChoices, MagicList, OriginFeat } from "./types";
import { BACKGROUNDS } from "../data/backgrounds";
import { PROFILES, SCHOLAR_SKILLS } from "../data/profiles";
import type { AbilityId, BackgroundId, CharacterBuild, ClassId, OriginChoices, SkillId } from "./types";

export const ABILITY_PRIORITY: Record<ClassId, AbilityId[]> = {
  rogue: ["dexterity", "constitution", "intelligence", "wisdom", "strength", "charisma"],
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
export function defaultMagic(list: MagicList, classId: ClassId = "fighter") {
  const ability = classId === "warlock" ? "charisma" as const : (classId === "wizard" || classId === "rogue") ? "intelligence" as const : "wisdom" as const;
  return { ability, cantrips: list === "cleric" ? ["guidance", "sacred-flame"] : list === "druid" ? ["guidance", "druidcraft"] : [classId === "wizard" ? "light" : "prestidigitation", "mage-hand"], spell: list === "wizard" ? classId === "wizard" ? "mage-armor" : "shield" : "healing-word" };
}
export function defaultFeatChoices(classId: ClassId = "fighter"): FeatChoices {
  return { skilled: ["arcana", "medicine", "persuasion"], crafter: ["carpenters-tools", "smiths-tools", "weavers-tools"], musician: ["lute", "flute", "drum"], magicList: "wizard", magicInitiate: defaultMagic("wizard", classId) };
}
export function defaultOriginChoices(classId: ClassId): OriginChoices {
  return { ...defaultFeatChoices(classId), gamingSet: "dice-set", artisanTool: "carpenters-tools", instrument: "lute" };
}
export function featSources(build: CharacterBuild): { source: string; id: OriginFeat; choices: FeatChoices; list: MagicList; resource: string }[] {
  const b = BACKGROUNDS[build.backgroundId];
  return [{ source: b.name + "背景", id: b.feat as OriginFeat, choices: build.choices.origin, list: b.magicList ?? "wizard", resource: "magic-initiate" }, ...(build.speciesId === "human" ? [{ source: "人类额外专长", id: build.choices.species.humanFeat, choices: build.choices.species.feat, list: build.choices.species.feat.magicList, resource: "human-magic" }] : [])];
}
export function originFeats(build: CharacterBuild): OriginFeat[] { return [...new Set(featSources(build).map((f) => f.id))]; }
export function extraSkills(build: CharacterBuild): SkillId[] {
  return [...(build.speciesId === "human" || build.speciesId === "elf" ? [build.choices.species.skill] : []), ...featSources(build).flatMap((f) => f.id === "skilled" ? f.choices.skilled.filter((id): id is SkillId => Object.prototype.hasOwnProperty.call(SKILLS, id)) : [])];
}
export function magicOptions(list: MagicList) { return ORIGIN_SPELL_IDS[list].map((id) => spell(id)!).filter(Boolean); }
export function classSkills(build: CharacterBuild): SkillId[] {
  return build.classId === "fighter" ? build.choices.fighterSkills : build.choices[build.classId]!.skills;
}
export function proficientSkills(build: CharacterBuild): SkillId[] {
  return [...new Set([...classSkills(build), ...BACKGROUNDS[build.backgroundId].skills, ...extraSkills(build)])];
}

// 更换背景保留玩家的职业技能；重复熟练只提示，不悄悄替换玩家选择。
export function changeBackground(build: CharacterBuild, backgroundId: BackgroundId): CharacterBuild {
  if (backgroundId === build.backgroundId) return build;
  const list = BACKGROUNDS[backgroundId].magicList;
  const oldList = BACKGROUNDS[build.backgroundId].magicList;
  const origin = list && list !== oldList ? { ...build.choices.origin, magicList: list, magicInitiate: defaultMagic(list, build.classId) } : build.choices.origin;
  const next: CharacterBuild = { ...build, backgroundId, choices: { ...build.choices, origin }, abilities: { ...build.abilities, backgroundBoosts: recommendedBoosts(build.classId, backgroundId) }, equipment: { ...build.equipment, backgroundPackage: `${backgroundId}-a` } };
  const feat = BACKGROUNDS[backgroundId].feat;
  if (feat !== BACKGROUNDS[build.backgroundId].feat && ["skilled", "crafter", "musician"].includes(feat)) {
    const defaults = recommendedFeatChoices(next, "background");
    next.choices.origin = { ...origin, [feat]: defaults[feat as "skilled" | "crafter" | "musician"] };
  }
  return next;
}

// 一键修复只动重复技能和失效专精；从本职业列表补齐，不额外授予熟练。
export function recommendSkills(build: CharacterBuild): CharacterBuild {
  const background = BACKGROUNDS[build.backgroundId];
  const count = build.classId === "rogue" ? 4 : build.classId === "ranger" ? 3 : 2;
  const options = PROFILES[build.classId].skills.filter((id) => ![...background.skills, ...extraSkills(build)].includes(id));
  const skills = [...new Set([...classSkills(build).filter((id) => options.includes(id)), ...options, ...PROFILES[build.classId].skills])].slice(0, count);
  const choices = { ...build.choices };
  if (build.classId === "fighter") choices.fighterSkills = skills;
  else if (build.classId === "rogue") {
    const r = choices.rogue!;
    const available = [...new Set([...skills, ...background.skills, ...extraSkills(build)])];
    choices.rogue = { ...r, skills, expertise: [...new Set([...r.expertise.filter((id) => available.includes(id)), ...available])].slice(0, 2) };
  }
  else if (build.classId === "wizard") {
    const w = choices.wizard!;
    const available = [...skills, ...background.skills, ...extraSkills(build)];
    const scholar = available.includes(w.scholar) && SCHOLAR_SKILLS.includes(w.scholar) ? w.scholar : SCHOLAR_SKILLS.find((id) => available.includes(id))!;
    choices.wizard = { ...w, skills, scholar };
  } else if (build.classId === "ranger") {
    const r = choices.ranger!;
    choices.ranger = { ...r, skills, expertise: [...skills, ...background.skills, ...extraSkills(build)].includes(r.expertise) ? r.expertise : skills[0] };
  } else if (build.classId === "druid") choices.druid = { ...choices.druid!, skills };
  else choices.warlock = { ...choices.warlock!, skills };
  return { ...build, choices };
}

export function backgroundTool(build: CharacterBuild): string {
  const tool = BACKGROUNDS[build.backgroundId].tool;
  return tool === "gaming-set" ? build.choices.origin.gamingSet : tool === "artisan-tool" ? build.choices.origin.artisanTool : tool === "instrument" ? build.choices.origin.instrument : tool;
}
export function classTools(build: CharacterBuild): string[] {
  return build.classId === "druid" ? ["herbalism-kit"] : build.classId === "rogue" ? ["thieves-tools", ...(build.subclassId === "assassin" ? ["disguise-kit", "poisoners-kit"] : [])] : [];
}
export function toolProficiencies(build: CharacterBuild): string[] {
  return [...new Set([backgroundTool(build), ...classTools(build), ...featSources(build).flatMap((f) => f.id === "crafter" ? f.choices.crafter : f.id === "musician" ? f.choices.musician : f.id === "skilled" ? f.choices.skilled.filter((id) => Object.prototype.hasOwnProperty.call(TOOL_OPTIONS, id)) : [])])];
}

// 推荐只填可自选熟练，避开职业、背景和另一专长已提供的项目。
export function recommendedFeatChoices(build: CharacterBuild, source: "background" | "human"): FeatChoices {
  const defaults = defaultFeatChoices(build.classId);
  const occupied = new Set<string>([...classSkills(build), ...BACKGROUNDS[build.backgroundId].skills, backgroundTool(build), ...classTools(build), ...(build.speciesId === "elf" || build.speciesId === "human" ? [build.choices.species.skill] : [])]);
  for (const [i, f] of featSources(build).entries()) if ((source === "human" && i === 0) || (source === "background" && i === 1)) {
    const ids = f.id === "skilled" ? f.choices.skilled : f.id === "crafter" ? f.choices.crafter : f.id === "musician" ? f.choices.musician : [];
    ids.forEach((id) => occupied.add(id));
  }
  const pick = (preferred: string[], all: string[]) => [...new Set([...preferred, ...all])].filter((id) => !occupied.has(id)).slice(0, 3);
  return { ...defaults, skilled: pick(defaults.skilled, Object.keys(SKILLS)), crafter: pick(defaults.crafter, CRAFTER_TOOLS), musician: pick(defaults.musician, Object.keys(INSTRUMENTS)) };
}
