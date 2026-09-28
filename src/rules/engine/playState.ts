import type { DerivedCharacter } from "../types";
import { isRecord } from "../validator/buildShape";

export interface PlayState {
  hp: number;
  temporaryHp: number;
  hitDice: number;
  remaining: Record<string, number>;
}
export type PlayAction =
  | { type: "hp"; value: number }
  | { type: "temporary-hp"; value: number }
  | { type: "hit-dice"; value: number }
  | { type: "resource"; id: string; value: number }
  | { type: "rest"; kind: "short" | "long" };
const clamp = (value: unknown, max: number, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(0, Math.trunc(value))) : fallback;

export function normalizePlayState(value: unknown, character: DerivedCharacter): PlayState {
  const raw = isRecord(value) ? value : {};
  const remaining = isRecord(raw.remaining) ? raw.remaining : {};
  return {
    hp: clamp(raw.hp, character.maxHp, character.maxHp),
    temporaryHp: clamp(raw.temporaryHp, 999, 0),
    hitDice: clamp(raw.hitDice, character.level, character.level),
    remaining: Object.fromEntries(character.resources.map((r) => [r.id, clamp(remaining[r.id], r.max, r.max)])),
  };
}

export function updatePlayState(state: PlayState, action: PlayAction, c: DerivedCharacter): PlayState {
  let next = { ...state, remaining: { ...state.remaining } };
  if (action.type === "hp") next.hp = action.value;
  if (action.type === "temporary-hp") next.temporaryHp = action.value;
  if (action.type === "hit-dice") next.hitDice = action.value;
  if (action.type === "resource") next.remaining[action.id] = action.value;
  if (action.type === "rest") {
    // 短休不会自动治疗；生命骰的实际治疗量由玩家掷骰后记录。
    if (action.kind === "long") next = normalizePlayState(undefined, c);
    else {
      next.remaining["second-wind"] += 1;
      next.remaining["action-surge"] = c.resources.find((r) => r.id === "action-surge")!.max;
    }
  }
  return normalizePlayState(next, c);
}
