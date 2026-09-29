import { SPECIES } from "../../data/species";
import { BACKGROUNDS } from "../../data/backgrounds";
import { SKILLS } from "../../data/core";
import { ARTISAN_TOOLS, CRAFTER_TOOLS, INSTRUMENTS, ORIGIN_FEATS, TOOL_OPTIONS } from "../../data/originOptions";
import { GAMING_SETS } from "../../data/characterDetails";
import { backgroundTool, featSources, magicOptions, classSkills, classTools } from "../origins";
import type { CharacterBuild, ValidationMessage } from "../types";

export function validateOrigins(build: CharacterBuild): ValidationMessage[] {
  const messages: ValidationMessage[] = [];
  const check = (ok: boolean, id: string, message: string, targetStep: string) => { if (!ok) messages.push({ id, message, targetStep, severity: "blocker", domain: "rules" }); };
  const unique = (ids: string[], count: number) => ids.length === count && new Set(ids).size === count;
  const owns = (map: object, id: string) => Object.prototype.hasOwnProperty.call(map, id);
  const sc = build.choices.species, species = SPECIES[build.speciesId], bg = BACKGROUNDS[build.backgroundId];
  check(species.sizes.includes(sc.size), "species-size", "请选择该种族允许的体型。", "species");
  check(species.lineages ? owns(species.lineages, sc.lineage) : sc.lineage === "", "species-lineage", "请选择有效血系或先祖。", "species");
  if (build.speciesId === "elf" || build.speciesId === "human") check(build.speciesId === "elf" ? ["insight", "perception", "survival"].includes(sc.skill) : owns(SKILLS, sc.skill), "species-skill", "请选择合法种族技能。", "species");
  if (build.speciesId === "elf" && sc.lineage === "high") check(magicOptions("wizard").some((s) => s.level === 0 && s.id === sc.cantrip), "high-elf-cantrip", "高等精灵须选择一道法师戏法。", "species");
  if (bg.tool === "artisan-tool") check(owns(ARTISAN_TOOLS, build.choices.origin.artisanTool), "background-tool", "选择一种工匠工具。", "background");
  if (bg.tool === "instrument") check(owns(INSTRUMENTS, build.choices.origin.instrument), "background-instrument", "选择一种乐器。", "background");
  if (bg.equipment.some((e) => e.id === "gaming-set")) check(owns(GAMING_SETS, build.choices.origin.gamingSet), "gaming-set", "选择一种游戏套装。", "background");
  const sources = featSources(build);
  for (const [index, f] of sources.entries()) {
    const step = index ? "species" : "background", prefix = index ? "human-" : "";
    const c = f.choices;
    check(ORIGIN_FEATS.includes(f.id), prefix + "origin-feat", "请选择有效起源专长。", step);
    if (index && f.id === bg.feat) check(f.id === "skilled" || (f.id === "magic-initiate" && f.list !== bg.magicList), "human-feat-repeat", "该专长不能重复获得；熟习可复选，魔法学徒复选须选不同法术列表。", step);
    if (f.id === "skilled") check(unique(c.skilled, 3) && c.skilled.every((id) => owns(SKILLS, id) || owns(TOOL_OPTIONS, id)), prefix + "skilled", "熟习需要选择三项不同的技能或工具熟练。", step);
    if (f.id === "crafter") check(unique(c.crafter, 3) && c.crafter.every((id) => CRAFTER_TOOLS.includes(id)), prefix + "crafter", "巧匠需要从快速制作表中选择三种不同工具。", step);
    if (f.id === "musician") check(unique(c.musician, 3) && c.musician.every((id) => owns(INSTRUMENTS, id)), prefix + "musician", "音乐家需要选择三种不同乐器。", step);
    if (f.id === "magic-initiate") {
      const options = magicOptions(f.list), m = c.magicInitiate;
      check(unique(m.cantrips, 2) && m.cantrips.every((id) => options.some((s) => s.id === id && s.level === 0)), prefix + "initiate-cantrips", "魔法学徒需要从指定法术列表选择两道不同戏法。", step);
      check(options.some((s) => s.id === m.spell && s.level === 1), prefix + "initiate-spell", "魔法学徒需要从指定法术列表选择一道一环法术。", step);
    }
  }
  // 合法的重复熟练不阻断车卡，也不将其误算为专精或额外熟练。
  const supplied = [...classSkills(build), ...bg.skills, backgroundTool(build), ...classTools(build), ...(build.speciesId === "human" || build.speciesId === "elf" ? [sc.skill] : []), ...sources.flatMap((f) => f.id === "skilled" ? f.choices.skilled : f.id === "crafter" ? f.choices.crafter : f.id === "musician" ? f.choices.musician : [])];
  if (new Set(supplied).size !== supplied.length) messages.push({ id: "origin-proficiency-overlap", domain: "recommendation", severity: "warning", targetStep: "background", message: "部分技能或工具由多个来源重复提供，熟练不叠加；可保留，也可调整允许自选的项目。" });
  return messages;
}
