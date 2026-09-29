import { automaticMagic, primalSubclass } from "../../data/primalSubclasses";
import { illusionCantrip, subclassFeatures } from "../expandedSubclasses";
import { rogueFeatures, rogueWeaponProficient } from "../../data/rogue";
import type { RogueSubclass } from "../types";
import { invocation } from "../../data/warlock";
import { legalDruidForm } from "../../data/beasts";
import { ARMOR } from "../../data/armor";
import { BACKGROUNDS } from "../../data/backgrounds";
import { toolProficiencies, originFeats, extraSkills, featSources, backgroundTool } from "../origins";
import { FIGHTER } from "../../data/classes/fighter";
import { PROFILES } from "../../data/profiles";
import { spell } from "../../data/spells";
import { ABILITIES, SKILLS } from "../../data/core";
import { SPECIES } from "../../data/species";
import { speciesMagic, speciesFeatures, speciesResistances } from "../species";
import { CHAMPION } from "../../data/subclasses/champion";
import { WEAPONS } from "../../data/weapons";
import type {
  AbilityId,
  CharacterBuild,
  DerivedCharacter,
  DerivedRoll,
  ProficiencyRank,
  SkillId,
} from "../types";
import { abilityModifier, addAbilityBoosts, normalizeAdvantage, proficiencyBonus } from "./math";

function makeRoll(modifier: number, proficiency: ProficiencyRank, advantageSources: string[] = [], disadvantageSources: string[] = []): DerivedRoll {
  return {
    modifier,
    proficiency,
    advantageSources,
    disadvantageSources,
    state: normalizeAdvantage(advantageSources, disadvantageSources),
  };
}

export function deriveCharacter(build: CharacterBuild): DerivedCharacter {
  const profile = PROFILES[build.classId];
  const background = BACKGROUNDS[build.backgroundId];
  const species = SPECIES[build.speciesId];
  const feats = originFeats(build);
  const lineage = build.choices.species.lineage;
  const initiate = background.feat === "magic-initiate" ? build.choices.origin.magicInitiate : undefined;
  const wizard = build.classId === "wizard" ? build.choices.wizard : undefined;
  const druid = build.classId === "druid" ? build.choices.druid : undefined;
  const warlock = build.classId === "warlock" ? build.choices.warlock : undefined;
  const ranger = build.classId === "ranger" ? build.choices.ranger : undefined;
  const rogue = build.classId === "rogue" ? build.choices.rogue : undefined;
  const trickster = !!rogue && build.subclassId === "arcane-trickster";
  const fighter = build.classId === "fighter";
  const champion = fighter && build.subclassId === "champion";
  const battleMaster = fighter && build.subclassId === "battle-master";
  const knight = fighter && build.subclassId === "eldritch-knight" ? build.choices.fighter : undefined;
  const psi = fighter && build.subclassId === "psi-warrior";
  const automatic = automaticMagic(build);
  const fey = !!ranger && build.subclassId === "fey-wanderer";
  const gloom = !!ranger && build.subclassId === "gloom-stalker";
  const moon = !!druid && build.subclassId === "moon";
  const book = wizard ? [...wizard.earlyBook, ...wizard.level3Book, ...wizard.evocationBook] : [];
  const pb = proficiencyBonus(build.level);
  const finalScores = addAbilityBoosts(build.abilities.baseAssignment, build.abilities.backgroundBoosts);
  const abilities = Object.fromEntries(
    ABILITIES.map((ability) => [ability, { score: finalScores[ability], modifier: abilityModifier(finalScores[ability]) }]),
  ) as DerivedCharacter["abilities"];

  const skillProficiencies = new Set<SkillId>([
    ...background.skills,
    ...extraSkills(build),
    ...(fey ? [ranger!.feySkill ?? "persuasion"] : []),
    ...(battleMaster && build.choices.fighter ? [build.choices.fighter.studentSkill] : []),
    ...(rogue?.skills ?? ranger?.skills ?? warlock?.skills ?? druid?.skills ?? wizard?.skills ?? build.choices.fighterSkills),
  ]);

  const skills = Object.fromEntries(
    (Object.keys(SKILLS) as SkillId[]).map((skillId) => {
      const ability = SKILLS[skillId].defaultAbility;
      const proficient = skillProficiencies.has(skillId);
      const expertise = proficient && (wizard?.scholar === skillId || ranger?.expertise === skillId || rogue?.expertise.includes(skillId));
      const advantageSources = champion && skillId === "athletics" && CHAMPION.athleticsAdvantage ? ["remarkable-athlete"] : [];
      return [
        skillId,
        makeRoll(
          abilities[ability].modifier + (fey && ability === "charisma" ? Math.max(1, abilities.wisdom.modifier) : 0) + (proficient ? pb * (expertise ? 2 : 1) : 0) + (druid?.order === "magician" && ["arcana", "nature"].includes(skillId) ? Math.max(1, abilities.wisdom.modifier) : 0),
          expertise ? "expertise" : proficient ? "proficient" : "none",
          advantageSources,
          fighter && skillId === "stealth" ? ["chain-mail"] : [],
        ),
      ];
    }),
  ) as Record<SkillId, DerivedRoll>;

  const savingThrowProficiencies = new Set<AbilityId>(profile.saves);
  const savingThrows = Object.fromEntries(
    ABILITIES.map((ability) => [
      ability,
      makeRoll(
        abilities[ability].modifier + (savingThrowProficiencies.has(ability) ? pb : 0),
        savingThrowProficiencies.has(ability) ? "proficient" : "none",
        build.speciesId === "gnome" && ["intelligence", "wisdom", "charisma"].includes(ability) ? ["gnomish-cunning"] : [],
      ),
    ]),
  ) as Record<AbilityId, DerivedRoll>;

  const classHp = profile.hitDie + abilities.constitution.modifier
    + (build.level - 1) * (profile.fixedHp + abilities.constitution.modifier);
  const maxHp = classHp + (build.speciesId === "dwarf" ? build.level : 0) + (feats.includes("tough") ? 2 * build.level : 0);

  const chainMail = ARMOR["chain-mail"];
  const defenseBonus = build.choices.fightingStyle === "defense" ? 1 : 0;
  const armorClass = ranger ? 12 + abilities.dexterity.modifier + (ranger.style === "defense" ? 1 : 0) : fighter ? chainMail.armorClass + defenseBonus : (druid ? 13 : (warlock || rogue) ? 11 : 10) + abilities.dexterity.modifier;

  let speed = build.speciesId === "elf" && lineage === "wood" ? 35 : species.speed;
  if (fighter && abilities.strength.score < chainMail.strengthRequirement) speed -= 10;

  const initiativeAdvantages = rogue && build.subclassId === "assassin" ? ["assassinate"] : champion && CHAMPION.initiativeAdvantage ? ["remarkable-athlete"] : [];
  const initiative = makeRoll(abilities.dexterity.modifier + (gloom ? abilities.wisdom.modifier : 0) + (feats.includes("alert") ? pb : 0), "none", initiativeAdvantages);

  const masterySet = new Set(build.choices.weaponMasteries);
  // 合并两个来源的装备，避免背景武器和重复金币在人物卡中丢失。
  const inventory = new Map<string, number>();
  for (const item of [...profile.equipment, ...background.equipment]) {
    const id = item.id === "gaming-set" ? build.choices.origin.gamingSet : ["artisan-tool", "instrument"].includes(item.id) ? backgroundTool(build) : item.id;
    inventory.set(id, (inventory.get(id) ?? 0) + item.quantity);
  }
  if (rogue && build.subclassId === "assassin") for (const id of ["disguise-kit", "poisoners-kit"]) inventory.set(id, (inventory.get(id) ?? 0) + 1);
  if (druid && build.subclassId === "stars") inventory.set("star-map", 1);
  const equipment = [...inventory].map(([id, quantity]) => ({ id, quantity }));
  const carriedWeaponIds = equipment.map((item) => item.id).filter((id) => Object.prototype.hasOwnProperty.call(WEAPONS, id));

  const attacks = carriedWeaponIds.map((weaponId) => {
    const weapon = WEAPONS[weaponId];
    const mod = weapon.finesse ? Math.max(abilities.strength.modifier, abilities.dexterity.modifier) : abilities[weapon.ability].modifier;
    return {
      weaponId,
      disadvantage: weapon.heavy && abilities[weapon.category === "martial-ranged" ? "dexterity" : "strength"].score < 13 ? "重型武器属性不足 13，攻击具有劣势（近战看力量，远程看敏捷）" : undefined,
      attackBonus: mod + (weapon.category.startsWith("simple") || fighter || ranger || (!!rogue && rogueWeaponProficient(weaponId)) || druid?.order === "warden" ? pb : 0) + (ranger?.style === "archery" && weapon.category.endsWith("ranged") ? 2 : 0),
      damageDice: weapon.damageDice,
      damageModifier: mod,
      damageType: weapon.damageType,
      mastery: {
        id: weapon.mastery,
        unlocked: (fighter || !!ranger || !!rogue) && masterySet.has(weaponId),
      },
      range: weapon.range,
    };
  });

  const innateMagic = [...speciesMagic(build, abilities, pb), ...featSources(build).filter((f) => f.id === "magic-initiate").map((f) => ({ source: f.source + " · 魔法学徒", ability: f.choices.magicInitiate.ability, cantrips: f.choices.magicInitiate.cantrips, spells: [f.choices.magicInitiate.spell], freeUses: 1, resource: f.resource, attack: pb + abilities[f.choices.magicInitiate.ability].modifier, dc: 8 + pb + abilities[f.choices.magicInitiate.ability].modifier }))];
  // 每个来源保有独立资源；相同法术不会错误合并免费次数或施法属性。
  const speciesResources = build.speciesId === "dwarf" ? [{ id: "stonecunning", max: pb, recovery: "长休恢复全部" }]
    : build.speciesId === "aasimar" ? [{ id: "healing-hands", max: 1, recovery: "长休恢复" }, { id: "celestial-revelation", max: 1, recovery: "长休恢复；启动时选择变身效果" }]
    : build.speciesId === "dragonborn" ? [{ id: "breath-weapon", max: pb, recovery: "长休恢复全部" }]
    : build.speciesId === "goliath" ? [{ id: "giant-ancestry", max: pb, recovery: "长休恢复全部" }]
    : build.speciesId === "orc" ? [{ id: "adrenaline-rush", max: pb, recovery: "短休或长休恢复全部", shortRestRestore: pb }, { id: "relentless-endurance", max: 1, recovery: "长休恢复" }] : [];


  return {
    level: 3,
    hitDie: profile.hitDie,
    tools: toolProficiencies(build),
    innateMagic,
    size: build.choices.species.size,
    speciesFeatures: speciesFeatures(build),
    originMagic: initiate ? { ...initiate, attack: abilities[initiate.ability].modifier + pb, dc: 8 + pb + abilities[initiate.ability].modifier } : undefined,
    rogue: rogue ? { subclass: build.subclassId as RogueSubclass, sneakDice: "2d6", climb: build.subclassId === "thief" ? speed : undefined } : undefined,
    primalCompanion: build.subclassId === "beast-master" ? ranger?.primal : undefined,
    spellcasting: knight ? { attack: abilities.intelligence.modifier + pb, dc: 8 + pb + abilities.intelligence.modifier, book: [], cantrips: knight.cantrips, prepared: knight.prepared, ritualSpells: knight.prepared.filter((id) => spell(id)?.ritual) } : trickster ? { attack: abilities.intelligence.modifier + pb, dc: 8 + pb + abilities.intelligence.modifier, book: [], cantrips: ["mage-hand", ...rogue!.cantrips], prepared: rogue!.prepared, ritualSpells: rogue!.prepared.filter((id) => spell(id)?.ritual) } : ranger ? { attack: abilities.wisdom.modifier + pb, dc: 8 + pb + abilities.wisdom.modifier, book: [], cantrips: [], prepared: [...new Set([...ranger.prepared, ...automatic.prepared])], ritualSpells: [...ranger.prepared, ...automatic.prepared].filter((id) => spell(id)?.ritual) } : wizard ? { attack: abilities.intelligence.modifier + pb, dc: 8 + pb + abilities.intelligence.modifier, book, cantrips: [...wizard.cantrips, ...(build.subclassId === "illusionist" ? [illusionCantrip(build)] : [])], prepared: wizard.prepared, ritualSpells: book.filter((id) => spell(id)?.ritual) } : druid ? { attack: abilities.wisdom.modifier + pb, dc: 8 + pb + abilities.wisdom.modifier, book: [], cantrips: [...new Set([...druid.cantrips, ...automatic.cantrips])], prepared: [...new Set([...druid.prepared, ...automatic.prepared])], ritualSpells: [...druid.prepared, ...automatic.prepared].filter((id) => spell(id)?.ritual) } : warlock ? { attack: abilities.charisma.modifier + pb, dc: 8 + pb + abilities.charisma.modifier, book: [], prepared: [...new Set([...warlock.prepared, ...automatic.prepared])], cantrips: [...new Set([...warlock.cantrips, ...automatic.cantrips])], ritualSpells: [...warlock.prepared, ...automatic.prepared].filter((id) => spell(id)?.ritual) } : undefined,
    pactMagic: warlock ? { slotLevel: 2, invocations: warlock.invocations, atWill: warlock.invocations.flatMap((v) => invocation(v.id)?.spell ? [invocation(v.id)!.spell!] : []), darkBlessing: build.subclassId === "fiend" ? Math.max(1, abilities.charisma.modifier + build.level) : 0, psychicDamage: build.subclassId === "great-old-one" && warlock.psychicDamage === "psychic", concentrationAdvantage: warlock.invocations.some((v) => v.id === "eldritch-mind"), devilsSight: warlock.invocations.some((v) => v.id === "devils-sight") } : undefined,
    wildShape: druid ? { knownForms: druid.knownForms.filter((id) => legalDruidForm(id, moon)), temporaryHp: moon ? build.level * 3 : build.level } : undefined,
    armorNote: fighter ? "链甲 + 防御风格" : rogue ? "皮甲 · 11 + 敏捷" : ranger ? `镶钉皮甲 · 12 + 敏捷${ranger.style === "defense" ? " + 防御" : ""}` : druid ? "皮甲 + 敏捷 + 盾牌" : warlock ? "皮甲 · 11 + 敏捷" : wizard ? `无甲 · 10 + 敏捷${wizard.prepared.includes("mage-armor") || innateMagic.some((m) => m.spells.includes("mage-armor")) ? `；法师护甲生效时 ${13 + abilities.dexterity.modifier}` : ""}` : undefined,
    proficiencyBonus: pb,
    abilities,
    maxHp,
    armorClass,
    speed,
    initiative,
    savingThrows,
    skills,
    passivePerception: 10 + skills.perception.modifier,
    attacks,
    resources: [
      ...(rogue ? (trickster ? [{ id: "spell-slot-1", max: 2, recovery: "长休恢复全部；短休不恢复" }] : build.subclassId === "soulknife" ? [{ id: "psionic-power", max: 4, recovery: "d6；短休恢复 1 枚，长休恢复全部", shortRestRestore: 1 }, { id: "psychic-whispers", max: 1, recovery: "每长休首次免费；额外使用扣灵能骰" }] : []) : ranger ? [{ id: "spell-slot-1", max: 3, recovery: "长休恢复全部；短休不恢复" }, { id: "favored-enemy", max: 2, recovery: "长休恢复；免费施展猎人印记，仍需专注" }] : fighter ? [
      { id: "second-wind", max: FIGHTER.secondWindUsesAtLevel3, recovery: "短休恢复1次，长休恢复全部", shortRestRestore: 1 },
      { id: "action-surge", max: FIGHTER.actionSurgeUsesAtLevel3, recovery: "短休或长休恢复", shortRestRestore: 1 },
      ] : warlock ? [
        { id: "pact-slot", max: 2, recovery: "均为二环；短休或长休恢复全部", shortRestRestore: 2 },
        { id: "magical-cunning", max: 1, recovery: "长休恢复；一分钟仪式恢复 1 个已消耗的契约法术位" },
      ] : druid ? [
        { id: "wild-shape", max: 2, recovery: "短休恢复 1 次；长休恢复全部", shortRestRestore: 1 },
        { id: "spell-slot-1", max: 4, recovery: "长休恢复全部" },
        { id: "spell-slot-2", max: 2, recovery: "长休恢复全部" },
      ] : [
        { id: "spell-slot-1", max: 4, recovery: "长休恢复；短休可使用奥术回想" },
        { id: "spell-slot-2", max: 2, recovery: "长休恢复；短休可使用奥术回想" },
        { id: "arcane-recovery", max: 1, recovery: "长休恢复；短休时可恢复总环阶至多 2 的法术位" },
      ]),
      ...(battleMaster ? [{ id: "combat-superiority", max: 4, recovery: "d8；短休或长休恢复全部", shortRestRestore: 4 }] : []),
      ...(knight ? [{ id: "spell-slot-1", max: 2, recovery: "长休恢复全部" }] : []),
      ...(psi ? [{ id: "psi-warrior-energy", max: 4, recovery: "d6；短休恢复 1 枚，长休恢复全部", shortRestRestore: 1 }, { id: "telekinetic-movement", max: 1, recovery: "短休或长休恢复；可消耗 1 枚灵能骰重置", shortRestRestore: 1 }] : []),
      ...(build.subclassId === "stars" ? [{ id: "star-guiding-bolt", max: Math.max(1, abilities.wisdom.modifier), recovery: "长休恢复；持握星图时免费施展一环光导箭" }] : []),
      ...(build.subclassId === "archfey" ? [{ id: "steps-of-the-fey", max: Math.max(1, abilities.charisma.modifier), recovery: "长休恢复；免费施展迷踪步" }] : []),
      ...(build.subclassId === "celestial" ? [{ id: "healing-light", max: 4, recovery: "d6；长休恢复全部；每次至多魅力调整值枚（至少一枚）" }] : []),
      ...(gloom ? [{ id: "dreadful-strike", max: Math.max(1, abilities.wisdom.modifier), recovery: "长休恢复全部；每回合至多一次" }] : []),
      ...(feats.includes("lucky") ? [{ id: "lucky", max: pb, recovery: "长休恢复全部；不随短休恢复" }] : []),
      ...innateMagic.filter((m) => m.resource).map((m) => ({ id: m.resource!, max: m.freeUses, recovery: "长休恢复；免费施展该来源法术" })),
      ...speciesResources,
    ],
    criticalThreshold: champion ? CHAMPION.criticalThreshold : 20,
    languages: ["common", ...build.choices.languages, ...(ranger?.extraLanguages ?? []), ...(rogue ? ["thieves-cant", rogue.extraLanguage] : []), ...(druid ? ["druidic"] : [])],
    senses: { darkvision: ((build.speciesId === "elf" && lineage === "drow" ? 120 : species.darkvision) ?? 0) + (gloom ? 60 : 0) || undefined },
    resistances: speciesResistances(build),
    features: [
      ...(rogue ? rogueFeatures(build.subclassId as RogueSubclass) : ranger ? ["ranger-spellcasting", "favored-enemy", "deft-explorer", "ranger-mastery", ranger.style === "defense" ? "fighting-style-defense" : "archery", ...(primalSubclass(build)?.features ?? [])] : fighter ? [
      "fighting-style-defense",
      "second-wind",
      "weapon-mastery",
      "action-surge",
      "tactical-mind",
      ...subclassFeatures(build),
      ] : warlock ? ["pact-magic", "magical-cunning", ...(primalSubclass(build)?.features ?? [])] : druid ? ["druid-spellcasting", "druidic", druid.order, "wild-shape", "wild-companion", ...(primalSubclass(build)?.features ?? [])] : ["spellcasting", "ritual-adept", "arcane-recovery", "scholar", ...subclassFeatures(build)]),
      ...feats,
      ...speciesFeatures(build),
    ],
    equipment,
  };
}
