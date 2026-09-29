import type { PrimalChoice } from "../data/ranger";
export type AbilityId =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "charisma";

export type SkillId =
  | "acrobatics"
  | "animal-handling"
  | "arcana"
  | "athletics"
  | "deception"
  | "history"
  | "insight"
  | "intimidation"
  | "investigation"
  | "medicine"
  | "nature"
  | "perception"
  | "performance"
  | "persuasion"
  | "religion"
  | "sleight-of-hand"
  | "stealth"
  | "survival";

export type AlignmentId = "LG" | "NG" | "CG" | "LN" | "N" | "CN" | "LE" | "NE" | "CE";
export type ProficiencyRank = "none" | "proficient" | "expertise";
export type Severity = "blocker" | "warning" | "info";
export type ValidationDomain = "completeness" | "rules" | "support" | "recommendation";

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Identity {
  name: string;
  gender?: string;
  age?: number;
  alignment?: AlignmentId;
  personalityTraits?: string[];
  appearance?: string;
  description?: string;
}

export type BackgroundId = "soldier" | "sage" | "hermit" | "wayfarer" | "acolyte" | "artisan" | "charlatan" | "criminal" | "entertainer" | "farmer" | "guard" | "guide" | "merchant" | "noble" | "sailor" | "scribe";
export interface MagicInitiateChoices { cantrips: string[]; spell: string; ability: "intelligence" | "wisdom" | "charisma" }
export type MagicList = "cleric" | "druid" | "wizard";
export type OriginFeat = "alert" | "crafter" | "healer" | "lucky" | "magic-initiate" | "musician" | "savage-attacker" | "skilled" | "tavern-brawler" | "tough";
export interface FeatChoices { skilled: string[]; crafter: string[]; musician: string[]; magicInitiate: MagicInitiateChoices; magicList: MagicList }
export interface OriginChoices extends FeatChoices { gamingSet: string; artisanTool: string; instrument: string }
export type SpeciesId = "aasimar" | "dragonborn" | "dwarf" | "elf" | "gnome" | "goliath" | "halfling" | "human" | "orc" | "tiefling";
export interface SpeciesChoices {
  lineage: string; size: "small" | "medium"; ability: "intelligence" | "wisdom" | "charisma";
  skill: SkillId; cantrip: string; humanFeat: OriginFeat; feat: FeatChoices;
}
export interface InnateMagic { source: string; ability: "intelligence" | "wisdom" | "charisma"; cantrips: string[]; spells: string[]; resource?: string; freeUses: number; attack: number; dc: number }

export type NewClassId = "barbarian" | "bard" | "cleric" | "monk" | "paladin" | "sorcerer";
export type NewSubclassId = "berserker" | "wild-heart" | "world-tree" | "zealot" | "lore" | "dance" | "glamour" | "valor" | "life" | "light" | "trickery" | "war" | "open-hand" | "shadow" | "elements" | "mercy" | "devotion" | "ancients" | "glory" | "vengeance" | "draconic" | "aberrant" | "clockwork" | "wild-magic";
// 六个入门职业共用表单结构，规则与名额由职业定义约束。
export interface NewClassChoices { wildHeart?: string; manifestation?: string; skills: SkillId[]; expertise: SkillId[]; tools: string[]; instrument: string; order: string; style: string; metamagic: string[]; cantrips: string[]; prepared: string[] }
export type ClassId = NewClassId | "fighter" | "wizard" | "druid" | "warlock" | "ranger" | "rogue";
export type FighterSubclass = "champion" | "battle-master" | "eldritch-knight" | "psi-warrior";
export type WizardSubclass = "evoker" | "abjurer" | "diviner" | "illusionist";
export interface FighterChoices { maneuvers: string[]; studentSkill: SkillId; artisanTool: string; cantrips: string[]; prepared: string[]; bondedWeapons: string[] }
export type DruidSubclass = "moon" | "land" | "sea" | "stars";
export type WarlockSubclass = "fiend" | "archfey" | "celestial" | "great-old-one";
export type RangerSubclass = "beast-master" | "hunter" | "fey-wanderer" | "gloom-stalker";
export type PrimalSubclassId = DruidSubclass | WarlockSubclass | RangerSubclass;
export type RogueSubclass = "thief" | "assassin" | "arcane-trickster" | "soulknife";
export interface RogueChoices { skills: SkillId[]; expertise: SkillId[]; extraLanguage: string; cantrips: string[]; prepared: string[] }
export interface RangerChoices { skills: SkillId[]; expertise: SkillId; extraLanguages: string[]; style: "archery" | "defense"; prepared: string[]; primal: PrimalChoice; huntersPrey?: "colossus-slayer" | "horde-breaker"; feySkill?: SkillId; feyGift?: string }
export interface InvocationChoice { id: string; target?: string }
export interface WarlockChoices {
  skills: SkillId[]; cantrips: string[]; prepared: string[]; invocations: InvocationChoice[]; psychicDamage?: "original" | "psychic";
}
export interface DruidChoices {
  skills: SkillId[]; order: "magician" | "warden"; cantrips: string[]; prepared: string[]; knownForms: string[]; land?: "arid" | "polar" | "temperate" | "tropical"; starForm?: "archer" | "chalice" | "dragon"; starMap?: string;
}
export interface WizardChoices {
  skills: SkillId[]; scholar: SkillId; cantrips: string[];
  // 分开记录升级来源；evocationBook 为历史存储字段，现统一承载当前学派的两道额外法术。
  earlyBook: string[]; level3Book: string[]; evocationBook: string[]; prepared: string[];
  illusionCantrip?: string;
}

export interface CharacterBuild {
  schemaVersion: 1;
  level: 3;
  classId: ClassId;
  subclassId: NewSubclassId | RogueSubclass | FighterSubclass | WizardSubclass | DruidSubclass | WarlockSubclass | RangerSubclass;
  speciesId: SpeciesId;
  backgroundId: BackgroundId;
  profileId: NewClassId | "rogue" | "fighter-heavy" | "wizard-evoker" | "druid-moon" | "warlock-fiend" | "ranger-beast-master";
  playstyle: {
    tags: string[];
    complexity: "simple" | "balanced" | "deep";
  };
  abilities: {
    baseAssignment: AbilityScores;
    backgroundBoosts: Partial<Record<AbilityId, number>>;
  };
  choices: {
    barbarian?: NewClassChoices;
    bard?: NewClassChoices;
    cleric?: NewClassChoices;
    monk?: NewClassChoices;
    paladin?: NewClassChoices;
    sorcerer?: NewClassChoices;
    fighter?: FighterChoices;
    rogue?: RogueChoices;
    ranger?: RangerChoices;
    wizard?: WizardChoices;
    druid?: DruidChoices;
    warlock?: WarlockChoices;
    languages: string[];
    origin: OriginChoices;
    species: SpeciesChoices;
    fighterSkills: SkillId[];
    fightingStyle: "defense";
    weaponMasteries: string[];
  };
  equipment: {
    classPackage: `${NewClassId}-a` | "rogue-a" | "fighter-a" | "wizard-a" | "druid-a" | "warlock-a" | "ranger-a";
    backgroundPackage: `${BackgroundId}-a`;
  };
  identity: Identity;
}

export interface DerivedRoll {
  modifier: number;
  proficiency: ProficiencyRank;
  advantageSources: string[];
  disadvantageSources: string[];
  state: "normal" | "advantage" | "disadvantage";
}

export interface DerivedAttack {
  weaponId: string;
  attackBonus: number;
  damageDice: string;
  damageModifier: number;
  damageType: string;
  mastery?: {
    id: string;
    unlocked: boolean;
  };
  range?: [number, number];
  disadvantage?: string;
}

export interface DerivedResource {
  id: string;
  max: number;
  recovery: string;
  shortRestRestore?: number;
}

export interface DerivedCharacter {
  level: 3;
  hitDie: number;
  spellcasting?: { attack: number; dc: number; book: string[]; prepared: string[]; cantrips: string[]; ritualSpells: string[] };
  originMagic?: MagicInitiateChoices & { attack: number; dc: number };
  innateMagic: InnateMagic[];
  speciesFeatures: string[];
  size: "small" | "medium";
  tools: string[];
  primalCompanion?: PrimalChoice;
  pactMagic?: { slotLevel: 2; invocations: InvocationChoice[]; atWill: string[]; darkBlessing: number; psychicDamage?: boolean; concentrationAdvantage: boolean; devilsSight: boolean };
  wildShape?: { knownForms: string[]; temporaryHp: number };
  armorNote?: string;
  proficiencyBonus: number;
  abilities: Record<AbilityId, { score: number; modifier: number }>;
  rogue?: { subclass: RogueSubclass; sneakDice: "2d6"; climb?: number };
  maxHp: number;
  armorClass: number;
  speed: number;
  initiative: DerivedRoll;
  savingThrows: Record<AbilityId, DerivedRoll>;
  skills: Record<SkillId, DerivedRoll>;
  passivePerception: number;
  attacks: DerivedAttack[];
  resources: DerivedResource[];
  criticalThreshold: number;
  languages: string[];
  senses: { darkvision?: number };
  resistances: string[];
  features: string[];
  equipment: { id: string; quantity: number }[];
}

export interface ValidationMessage {
  id: string;
  domain: ValidationDomain;
  severity: Severity;
  message: string;
  targetStep?: string;
}

export interface ValidationResult {
  rulesLegal: boolean;
  complete: boolean;
  supported: boolean;
  canGenerate: boolean;
  messages: ValidationMessage[];
}
