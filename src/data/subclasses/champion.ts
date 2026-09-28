export const CHAMPION = {
  id: "champion" as const,
  classId: "fighter" as const,
  criticalThreshold: 19,
  initiativeAdvantage: true,
  athleticsAdvantage: true,
  features: ["improved-critical", "remarkable-athlete"],
} as const;
