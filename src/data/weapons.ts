export interface WeaponDefinition {
  id: string;
  damageDice: string;
  damageType: "slashing" | "bludgeoning" | "piercing";
  category: "martial-melee" | "martial-ranged" | "simple-melee" | "simple-ranged";
  mastery: "graze" | "sap" | "slow" | "nick" | "vex";
  ability: "strength" | "dexterity";
  range?: [number, number];
}

export const WEAPONS: Record<string, WeaponDefinition> = {
  greatsword: {
    id: "greatsword",
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
  },
};
