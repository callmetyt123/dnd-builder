export interface WeaponDefinition {
  id: string;
  damageDice: string;
  damageType: "slashing" | "bludgeoning" | "piercing";
  category: "martial-melee" | "martial-ranged" | "simple-melee" | "simple-ranged";
  mastery: "graze" | "sap" | "slow" | "nick" | "vex" | "topple" | "push";
  ability: "strength" | "dexterity";
  range?: [number, number];
  properties?: string;
  versatileDice?: string;
  heavy?: boolean;
  finesse?: boolean;
}

export const WEAPONS: Record<string, WeaponDefinition> = {
  club: { id: "club", damageDice: "1d4", damageType: "bludgeoning", category: "simple-melee", mastery: "slow", ability: "strength", properties: "轻型" },
  greatclub: { id: "greatclub", damageDice: "1d8", damageType: "bludgeoning", category: "simple-melee", mastery: "push", ability: "strength", properties: "双手" },
  handaxe: { id: "handaxe", damageDice: "1d6", damageType: "slashing", category: "simple-melee", mastery: "vex", ability: "strength", range: [20, 60], properties: "轻型、投掷" },
  "light-hammer": { id: "light-hammer", damageDice: "1d4", damageType: "bludgeoning", category: "simple-melee", mastery: "nick", ability: "strength", range: [20, 60], properties: "轻型、投掷" },
  mace: { id: "mace", damageDice: "1d6", damageType: "bludgeoning", category: "simple-melee", mastery: "sap", ability: "strength" },
  dart: { id: "dart", damageDice: "1d4", damageType: "piercing", category: "simple-ranged", mastery: "vex", ability: "dexterity", finesse: true, range: [20, 60], properties: "灵巧、投掷" },
  sling: { id: "sling", damageDice: "1d4", damageType: "bludgeoning", category: "simple-ranged", mastery: "slow", ability: "dexterity", range: [30, 120], properties: "弹药（弹丸）" },
  rapier: { id: "rapier", damageDice: "1d8", damageType: "piercing", category: "martial-melee", mastery: "vex", ability: "dexterity", finesse: true, properties: "灵巧" },
  whip: { id: "whip", damageDice: "1d4", damageType: "slashing", category: "martial-melee", mastery: "slow", ability: "dexterity", finesse: true, properties: "灵巧、触及（10 尺）" },
  "hand-crossbow": { id: "hand-crossbow", damageDice: "1d6", damageType: "piercing", category: "martial-ranged", mastery: "vex", ability: "dexterity", range: [30, 120], properties: "弹药（弩矢）、轻型、装填" },

  "light-crossbow": { id: "light-crossbow", damageDice: "1d8", damageType: "piercing", category: "simple-ranged", mastery: "slow", ability: "dexterity", range: [80, 320], properties: "弹药（弩矢）、装填、双手" },
  longbow: { id: "longbow", damageDice: "1d8", damageType: "piercing", category: "martial-ranged", mastery: "slow", ability: "dexterity", range: [150, 600], heavy: true, properties: "弹药（箭）、重型、双手" },
  shortsword: { id: "shortsword", damageDice: "1d6", damageType: "piercing", category: "martial-melee", mastery: "vex", ability: "dexterity", finesse: true, properties: "轻型、灵巧" },
  scimitar: { id: "scimitar", damageDice: "1d6", damageType: "slashing", category: "martial-melee", mastery: "nick", ability: "dexterity", finesse: true, properties: "轻型、灵巧" },
  sickle: { id: "sickle", damageDice: "1d4", damageType: "slashing", category: "simple-melee", mastery: "nick", ability: "strength", properties: "轻型" },
  dagger: { id: "dagger", damageDice: "1d4", damageType: "piercing", category: "simple-melee", mastery: "nick", ability: "dexterity", finesse: true, range: [20, 60], properties: "轻型、灵巧、投掷" },
  quarterstaff: { id: "quarterstaff", damageDice: "1d6", damageType: "bludgeoning", category: "simple-melee", mastery: "topple", ability: "strength", versatileDice: "1d8", properties: "两用（双手近战 1d8）" },
  greatsword: {
    id: "greatsword",
    properties: "重型、双手",
    heavy: true,
    damageDice: "2d6",
    damageType: "slashing",
    category: "martial-melee",
    mastery: "graze",
    ability: "strength",
  },
  flail: {
    id: "flail",
    damageDice: "1d8",
    damageType: "bludgeoning",
    category: "martial-melee",
    mastery: "sap",
    ability: "strength",
  },
  javelin: {
    id: "javelin",
    damageDice: "1d6",
    damageType: "piercing",
    category: "simple-melee",
    mastery: "slow",
    ability: "strength",
    range: [30, 120],
    properties: "投掷",
  },
  spear: { id: "spear", damageDice: "1d6", damageType: "piercing", category: "simple-melee", mastery: "sap", ability: "strength", range: [20, 60], versatileDice: "1d8", properties: "投掷、两用（双手近战 1d8）" },
  shortbow: { id: "shortbow", damageDice: "1d6", damageType: "piercing", category: "simple-ranged", mastery: "vex", ability: "dexterity", range: [80, 320], properties: "弹药（箭）、双手" },
};
