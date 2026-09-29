import { FIEND_SPELLS, invocation } from "../../data/warlock";
import { DRUID_ALWAYS, MOON_SPELLS } from "../../data/druidSpells";
import { legalMoonForm } from "../../data/beasts";
import { ARMOR } from "../../data/armor";
import { BACKGROUNDS } from "../../data/backgrounds";
import { toolProficiencies } from "../origins";
import { FIGHTER } from "../../data/classes/fighter";
import { PROFILES } from "../../data/profiles";
import { spell } from "../../data/spells";
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
  const profile = PROFILES[build.classId];
  const background = BACKGROUNDS[build.backgroundId];
  const initiate = background.feat === "magic-initiate" ? build.choices.origin.magicInitiate : undefined;
  const wizard = build.classId === "wizard" ? build.choices.wizard : undefined;
  const druid = build.classId === "druid" ? build.choices.druid : undefined;
  const warlock = build.classId === "warlock" ? build.choices.warlock : undefined;
  const ranger = build.classId === "ranger" ? build.choices.ranger : undefined;
  const fighter = build.classId === "fighter";
  const book = wizard ? [...wizard.earlyBook, ...wizard.level3Book, ...wizard.evocationBook] : [];
  const pb = proficiencyBonus(build.level);
  const finalScores = addAbilityBoosts(build.abilities.baseAssignment, build.abilities.backgroundBoosts);
  const abilities = Object.fromEntries(
    ABILITIES.map((ability) => [ability, { score: finalScores[ability], modifier: abilityModifier(finalScores[ability]) }]),
  ) as DerivedCharacter["abilities"];

  const skillProficiencies = new Set<SkillId>([
    ...background.skills,
    ...(ranger?.skills ?? warlock?.skills ?? druid?.skills ?? wizard?.skills ?? build.choices.fighterSkills),
  ]);

  const skills = Object.fromEntries(
    (Object.keys(SKILLS) as SkillId[]).map((skillId) => {
      const ability = SKILLS[skillId].defaultAbility;
      const proficient = skillProficiencies.has(skillId);
      const expertise = proficient && (wizard?.scholar === skillId || ranger?.expertise === skillId);
      const advantageSources = fighter && skillId === "athletics" && CHAMPION.athleticsAdvantage ? ["remarkable-athlete"] : [];
      return [
        skillId,
        makeRoll(
          abilities[ability].modifier + (proficient ? pb * (expertise ? 2 : 1) : 0) + (druid?.order === "magician" && ["arcana", "nature"].includes(skillId) ? Math.max(1, abilities.wisdom.modifier) : 0),
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
      ),
    ]),
  ) as Record<AbilityId, DerivedRoll>;

  const classHp = profile.hitDie + abilities.constitution.modifier
    + (build.level - 1) * (profile.fixedHp + abilities.constitution.modifier);
  const maxHp = classHp + DWARF.hpBonusPerLevel * build.level;

  const chainMail = ARMOR["chain-mail"];
  const defenseBonus = build.choices.fightingStyle === "defense" ? 1 : 0;
  const armorClass = ranger ? 12 + abilities.dexterity.modifier + (ranger.style === "defense" ? 1 : 0) : fighter ? chainMail.armorClass + defenseBonus : (druid ? 13 : warlock ? 11 : 10) + abilities.dexterity.modifier;

  let speed = DWARF.speed;
  if (fighter && abilities.strength.score < chainMail.strengthRequirement) speed -= 10;

  const initiativeAdvantages = fighter && CHAMPION.initiativeAdvantage ? ["remarkable-athlete"] : [];
  const initiative = makeRoll(abilities.dexterity.modifier, "none", initiativeAdvantages);

  const masterySet = new Set(build.choices.weaponMasteries);
  // 合并两个来源的装备，避免背景武器和重复金币在人物卡中丢失。
  const inventory = new Map<string, number>();
  for (const item of [...profile.equipment, ...background.equipment]) {
    const id = item.id === "gaming-set" ? build.choices.origin.gamingSet : item.id;
    inventory.set(id, (inventory.get(id) ?? 0) + item.quantity);
  }
  const equipment = [...inventory].map(([id, quantity]) => ({ id, quantity }));
  const carriedWeaponIds = equipment.map((item) => item.id).filter((id) => Object.prototype.hasOwnProperty.call(WEAPONS, id));

  const attacks = carriedWeaponIds.map((weaponId) => {
    const weapon = WEAPONS[weaponId];
    const mod = weapon.finesse ? Math.max(abilities.strength.modifier, abilities.dexterity.modifier) : abilities[weapon.ability].modifier;
    return {
      weaponId,
      disadvantage: weapon.heavy && abilities[weapon.category === "martial-ranged" ? "dexterity" : "strength"].score < 13 ? "重型武器属性不足 13，攻击具有劣势（近战看力量，远程看敏捷）" : undefined,
      attackBonus: mod + pb + (ranger?.style === "archery" && weapon.category.endsWith("ranged") ? 2 : 0),
      damageDice: weapon.damageDice,
      damageModifier: mod,
      damageType: weapon.damageType,
      mastery: {
        id: weapon.mastery,
        unlocked: (fighter || !!ranger) && masterySet.has(weaponId),
      },
      range: weapon.range,
    };
  });


  return {
    level: 3,
    hitDie: profile.hitDie,
    tools: toolProficiencies(build),
    originMagic: initiate ? { ...initiate, attack: abilities[initiate.ability].modifier + pb, dc: 8 + pb + abilities[initiate.ability].modifier } : undefined,
    primalCompanion: ranger?.primal,
    spellcasting: ranger ? { attack: abilities.wisdom.modifier + pb, dc: 8 + pb + abilities.wisdom.modifier, book: [], cantrips: [], prepared: [...ranger.prepared, "hunters-mark"], ritualSpells: ranger.prepared.filter((id) => spell(id)?.ritual) } : wizard ? { attack: abilities.intelligence.modifier + pb, dc: 8 + pb + abilities.intelligence.modifier, book, cantrips: wizard.cantrips, prepared: wizard.prepared, ritualSpells: book.filter((id) => spell(id)?.ritual) } : druid ? { attack: abilities.wisdom.modifier + pb, dc: 8 + pb + abilities.wisdom.modifier, book: [], cantrips: [...druid.cantrips, MOON_SPELLS[0]], prepared: [...druid.prepared, ...DRUID_ALWAYS], ritualSpells: [...druid.prepared, ...DRUID_ALWAYS].filter((id) => spell(id)?.ritual) } : warlock ? { attack: abilities.charisma.modifier + pb, dc: 8 + pb + abilities.charisma.modifier, book: [], prepared: [...warlock.prepared, ...FIEND_SPELLS], cantrips: warlock.cantrips, ritualSpells: [] } : undefined,
    pactMagic: warlock ? { slotLevel: 2, invocations: warlock.invocations, atWill: warlock.invocations.flatMap((v) => invocation(v.id)?.spell ? [invocation(v.id)!.spell!] : []), darkBlessing: Math.max(1, abilities.charisma.modifier + build.level), concentrationAdvantage: warlock.invocations.some((v) => v.id === "eldritch-mind"), devilsSight: warlock.invocations.some((v) => v.id === "devils-sight") } : undefined,
    wildShape: druid ? { knownForms: druid.knownForms.filter(legalMoonForm), temporaryHp: build.level * 3 } : undefined,
    armorNote: ranger ? `镶钉皮甲 · 12 + 敏捷${ranger.style === "defense" ? " + 防御" : ""}` : druid ? "皮甲 + 敏捷 + 盾牌" : warlock ? "皮甲 · 11 + 敏捷" : wizard ? `无甲 · 10 + 敏捷${wizard.prepared.includes("mage-armor") || initiate?.spell === "mage-armor" ? `；法师护甲生效时 ${13 + abilities.dexterity.modifier}` : ""}` : undefined,
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
      ...(ranger ? [{ id: "spell-slot-1", max: 3, recovery: "长休恢复全部；短休不恢复" }, { id: "favored-enemy", max: 2, recovery: "长休恢复；免费施展猎人印记，仍需专注" }] : fighter ? [
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
      ...(background.feat === "lucky" ? [{ id: "lucky", max: pb, recovery: "长休恢复全部；不随短休恢复" }] : []),
      ...(initiate ? [{ id: "magic-initiate", max: 1, recovery: "长休恢复；免费施展所选一环法术" }] : []),
      { id: "stonecunning", max: pb, recovery: "长休恢复全部" },
    ],
    criticalThreshold: fighter ? CHAMPION.criticalThreshold : 20,
    languages: ["common", ...build.choices.languages, ...(ranger?.extraLanguages ?? []), ...(druid ? ["druidic"] : [])],
    senses: { darkvision: DWARF.darkvision },
    resistances: [...DWARF.resistances],
    features: [
      ...(ranger ? ["ranger-spellcasting", "favored-enemy", "deft-explorer", "ranger-mastery", ranger.style === "defense" ? "fighting-style-defense" : "archery", "primal-companion"] : fighter ? [
      "fighting-style-defense",
      "second-wind",
      "weapon-mastery",
      "action-surge",
      "tactical-mind",
      ...CHAMPION.features,
      ] : warlock ? ["pact-magic", "magical-cunning", "fiend-spells", "dark-ones-blessing"] : druid ? ["druid-spellcasting", "druidic", druid.order, "wild-shape", "circle-forms", "wild-companion"] : ["spellcasting", "ritual-adept", "arcane-recovery", "scholar", "evocation-savant", "potent-cantrip"]),
      background.feat,
      ...DWARF.features,
    ],
    equipment,
  };
}
