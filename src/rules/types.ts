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

export type ClassId = "fighter" | "wizard" | "druid" | "warlock" | "ranger";
export interface RangerChoices { skills: SkillId[]; expertise: SkillId; extraLanguages: string[]; style: "archery" | "defense"; prepared: string[]; primal: PrimalChoice }
export interface InvocationChoice { id: string; target?: string }
export interface WarlockChoices {
  skills: SkillId[]; cantrips: string[]; prepared: string[]; invocations: InvocationChoice[];
}
export interface DruidChoices {
  skills: SkillId[]; order: "magician" | "warden"; cantrips: string[]; prepared: string[]; knownForms: string[];
}
export interface WizardChoices {
  skills: SkillId[]; scholar: SkillId; cantrips: string[];
  // 分开记录升级来源，防止一级法术书被二环法术填满。
  earlyBook: string[]; level3Book: string[]; evocationBook: string[]; prepared: string[];
}

export interface CharacterBuild {
  schemaVersion: 1;
  level: 3;
  classId: ClassId;
  subclassId: "champion" | "evoker" | "moon" | "fiend" | "beast-master";
  speciesId: SpeciesId;
  backgroundId: BackgroundId;
  profileId: "fighter-heavy" | "wizard-evoker" | "druid-moon" | "warlock-fiend" | "ranger-beast-master";
  playstyle: {
    tags: string[];
    complexity: "simple" | "balanced" | "deep";
  };
  abilities: {
    baseAssignment: AbilityScores;
    backgroundBoosts: Partial<Record<AbilityId, number>>;
  };
  choices: {
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
    classPackage: "fighter-a" | "wizard-a" | "druid-a" | "warlock-a" | "ranger-a";
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
  pactMagic?: { slotLevel: 2; invocations: InvocationChoice[]; atWill: string[]; darkBlessing: number; concentrationAdvantage: boolean; devilsSight: boolean };
  wildShape?: { knownForms: string[]; temporaryHp: number };
  armorNote?: string;
  proficiencyBonus: number;
  abilities: Record<AbilityId, { score: number; modifier: number }>;
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
