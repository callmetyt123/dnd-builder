import { ARMOR } from "../../data/armor";
import { SOLDIER } from "../../data/backgrounds/soldier";
import { FIGHTER } from "../../data/classes/fighter";
import { ABILITIES, SKILLS } from "../../data/core";
import { DWARF } from "../../data/species/dwarf";
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
  const pb = proficiencyBonus(build.level);
  const finalScores = addAbilityBoosts(build.abilities.baseAssignment, build.abilities.backgroundBoosts);
  const abilities = Object.fromEntries(
    ABILITIES.map((ability) => [ability, { score: finalScores[ability], modifier: abilityModifier(finalScores[ability]) }]),
  ) as DerivedCharacter["abilities"];

  const skillProficiencies = new Set<SkillId>([
    ...SOLDIER.skillProficiencies,
    ...build.choices.fighterSkills,
  ]);

  const skills = Object.fromEntries(
    (Object.keys(SKILLS) as SkillId[]).map((skillId) => {
      const ability = SKILLS[skillId].defaultAbility;
      const proficient = skillProficiencies.has(skillId);
      const advantageSources = skillId === "athletics" && CHAMPION.athleticsAdvantage ? ["remarkable-athlete"] : [];
      return [
        skillId,
        makeRoll(
          abilities[ability].modifier + (proficient ? pb : 0),
          proficient ? "proficient" : "none",
          advantageSources,
          skillId === "stealth" ? ["chain-mail"] : [],
        ),
      ];
    }),
  ) as Record<SkillId, DerivedRoll>;

  const savingThrowProficiencies = new Set<AbilityId>(FIGHTER.savingThrowProficiencies);
  const savingThrows = Object.fromEntries(
    ABILITIES.map((ability) => [
      ability,
      makeRoll(
        abilities[ability].modifier + (savingThrowProficiencies.has(ability) ? pb : 0),
        savingThrowProficiencies.has(ability) ? "proficient" : "none",
      ),
    ]),
  ) as Record<AbilityId, DerivedRoll>;

  const classHp = FIGHTER.hitDie + abilities.constitution.modifier
    + (build.level - 1) * (FIGHTER.fixedHpAfterFirstLevel + abilities.constitution.modifier);
  const maxHp = classHp + DWARF.hpBonusPerLevel * build.level;

  const chainMail = ARMOR["chain-mail"];
  const defenseBonus = build.choices.fightingStyle === "defense" ? 1 : 0;
  const armorClass = chainMail.armorClass + defenseBonus;

  let speed = DWARF.speed;
  if (abilities.strength.score < chainMail.strengthRequirement) speed -= 10;

  const initiativeAdvantages = CHAMPION.initiativeAdvantage ? ["remarkable-athlete"] : [];
  const initiative = makeRoll(abilities.dexterity.modifier, "none", initiativeAdvantages);

  const masterySet = new Set(build.choices.weaponMasteries);
  // 合并两个来源的装备，避免背景武器和重复金币在人物卡中丢失。
  const inventory = new Map<string, number>();
  for (const item of [...FIGHTER.equipmentPackages[build.equipment.classPackage], ...SOLDIER.equipmentPackages[build.equipment.backgroundPackage]]) {
    const id = item.id === "gaming-set" ? build.choices.soldierGamingSet ?? "gaming-set" : item.id;
    inventory.set(id, (inventory.get(id) ?? 0) + item.quantity);
  }
  const equipment = [...inventory].map(([id, quantity]) => ({ id, quantity }));
  const carriedWeaponIds = equipment.map((item) => item.id).filter((id) => Object.prototype.hasOwnProperty.call(WEAPONS, id));

  const attacks = carriedWeaponIds.map((weaponId) => {
    const weapon = WEAPONS[weaponId];
    const mod = abilities[weapon.ability].modifier;
    return {
      weaponId,
      disadvantage: weapon.heavy && abilities.strength.score < 13 ? "力量低于 13，重型近战武器攻击具有劣势" : undefined,
      attackBonus: mod + pb,
      damageDice: weapon.damageDice,
      damageModifier: mod,
      damageType: weapon.damageType,
      mastery: {
        id: weapon.mastery,
        unlocked: masterySet.has(weaponId),
      },
      range: weapon.range,
    };
  });


  return {
    level: 3,
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
      { id: "second-wind", max: FIGHTER.secondWindUsesAtLevel3, recovery: "短休恢复1次，长休恢复全部" },
      { id: "action-surge", max: FIGHTER.actionSurgeUsesAtLevel3, recovery: "短休或长休恢复" },
      { id: "stonecunning", max: pb, recovery: "长休恢复全部" },
    ],
    criticalThreshold: CHAMPION.criticalThreshold,
    languages: ["common", ...build.choices.languages],
    senses: { darkvision: DWARF.darkvision },
    resistances: [...DWARF.resistances],
    features: [
      "fighting-style-defense",
      "second-wind",
      "weapon-mastery",
      "action-surge",
      "tactical-mind",
      ...CHAMPION.features,
      ...DWARF.features,
      SOLDIER.originFeatId,
    ],
    equipment,
  };
}
