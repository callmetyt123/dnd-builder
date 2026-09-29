import { SPECIES, DRAGON_DAMAGE } from "../data/species";
import type { CharacterBuild, DerivedCharacter, InnateMagic, SpeciesChoices, SpeciesId } from "./types";
import { defaultFeatChoices, defaultMagic, proficientSkills, recommendedFeatChoices } from "./origins";

export function defaultSpeciesChoices(id: SpeciesId = "dwarf"): SpeciesChoices {
  return { lineage: Object.keys(SPECIES[id].lineages ?? {})[0] ?? "", size: SPECIES[id].sizes[0], ability: "wisdom", skill: "insight", cantrip: "prestidigitation", humanFeat: "skilled", feat: defaultFeatChoices() };
}
export function changeSpecies(build: CharacterBuild, speciesId: SpeciesId): CharacterBuild {
  if (build.speciesId === speciesId) return build;
  const selected = defaultSpeciesChoices(speciesId);
  selected.ability = defaultMagic("wizard", build.classId).ability;
  selected.feat = defaultFeatChoices(build.classId);
  // Remove the previous species contribution before recommending a nonduplicate skill.
  const currentSkills = proficientSkills({ ...build, speciesId: "dwarf" });
  selected.skill = (["insight", "perception", "survival"] as const).find((id) => !currentSkills.includes(id)) ?? "insight";
  const next = { ...build, speciesId, choices: { ...build.choices, species: selected } };
  selected.feat = recommendedFeatChoices(next, "human");
  return next;
}
export function speciesFeatures(build: CharacterBuild): string[] {
  return [...SPECIES[build.speciesId].features, ...(build.speciesId === "gnome" && build.choices.species.lineage === "rock" ? ["rock-tinker"] : [])];
}
export function speciesResistances(build: CharacterBuild): string[] {
  const id = build.speciesId, lineage = build.choices.species.lineage;
  const tieflingDamage: Record<string, string> = { infernal: "fire", abyssal: "poison", chthonic: "necrotic" };
  return id === "dwarf" ? ["poison"] : id === "aasimar" ? ["radiant", "necrotic"] : id === "dragonborn" ? [DRAGON_DAMAGE[lineage]].filter(Boolean) : id === "tiefling" ? [tieflingDamage[lineage]].filter(Boolean) : [];
}
export function speciesMagic(build: CharacterBuild, abilities: DerivedCharacter["abilities"], pb: number): InnateMagic[] {
  const { lineage, ability, cantrip } = build.choices.species;
  const id = build.speciesId;
  let cantrips: string[] = [], spells: string[] = [], freeUses = 0;
  if (id === "aasimar") cantrips = ["light"];
  if (id === "elf") { cantrips = [lineage === "drow" ? "dancing-lights" : lineage === "wood" ? "druidcraft" : cantrip]; spells = [lineage === "drow" ? "faerie-fire" : lineage === "wood" ? "longstrider" : "detect-magic"]; freeUses = 1; }
  if (id === "gnome") { cantrips = lineage === "rock" ? ["mending", "prestidigitation"] : ["minor-illusion"]; spells = lineage === "forest" ? ["speak-with-animals"] : []; freeUses = spells.length ? pb : 0; }
  if (id === "tiefling") { cantrips = ["thaumaturgy", lineage === "abyssal" ? "poison-spray" : lineage === "chthonic" ? "chill-touch" : "fire-bolt"]; spells = [lineage === "abyssal" ? "ray-of-sickness" : lineage === "chthonic" ? "false-life" : "hellish-rebuke"]; freeUses = 1; }
  // Celestial Radiance fixes Charisma; the other spellcasting species choose an ability.
  const casting = id === "aasimar" ? "charisma" : ability;
  return cantrips.length || spells.length ? [{ source: "种族法术", ability: casting, cantrips, spells, freeUses, resource: freeUses ? "species-magic" : undefined, attack: pb + abilities[casting].modifier, dc: 8 + pb + abilities[casting].modifier }] : [];
}
