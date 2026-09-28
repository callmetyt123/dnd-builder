export const SOLDIER = {
  id: "soldier" as const,
  abilityOptions: ["strength", "dexterity", "constitution"] as const,
  skillProficiencies: ["athletics", "intimidation"] as const,
  originFeatId: "savage-attacker",
  toolChoice: "gaming-set",
  equipmentPackages: {
    "soldier-a": [
      { id: "spear", quantity: 1 },
      { id: "shortbow", quantity: 1 },
      { id: "arrow", quantity: 20 },
      { id: "quiver", quantity: 1 },
      { id: "gaming-set", quantity: 1 },
      { id: "healers-kit", quantity: 1 },
      { id: "travelers-clothes", quantity: 1 },
      { id: "gp", quantity: 14 },
    ],
  },
} as const;
