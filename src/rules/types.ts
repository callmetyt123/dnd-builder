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

export interface CharacterBuild {
  schemaVersion: 1;
  level: 3;
  classId: "fighter";
  subclassId: "champion";
  speciesId: "dwarf";
  backgroundId: "soldier";
  profileId: "fighter-heavy";
  playstyle: {
    tags: string[];
    complexity: "simple" | "balanced" | "deep";
  };
  abilities: {
    baseAssignment: AbilityScores;
    backgroundBoosts: Partial<Record<AbilityId, number>>;
  };
  choices: {
    languages: string[];
    soldierGamingSet?: string;
    fighterSkills: SkillId[];
    fightingStyle: "defense";
    weaponMasteries: string[];
  };
  equipment: {
    classPackage: "fighter-a";
    backgroundPackage: "soldier-a";
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
}

export interface DerivedCharacter {
  level: 3;
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
