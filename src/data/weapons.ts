export interface WeaponDefinition {
  id: string;
  damageDice: string;
  damageType: "slashing" | "bludgeoning" | "piercing";
  category: "martial-melee" | "martial-ranged" | "simple-melee" | "simple-ranged";
  mastery: "graze" | "sap" | "slow" | "nick" | "vex";
  ability: "strength" | "dexterity";
  range?: [number, number];
  properties?: string;
  versatileDice?: string;
  heavy?: boolean;
}

export const WEAPONS: Record<string, WeaponDefinition> = {
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
