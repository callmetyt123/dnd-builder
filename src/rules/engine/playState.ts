import type { DerivedCharacter } from "../types";
import { isRecord } from "../validator/buildShape";

export interface PlayState {
  warlockArmor?: "leather" | "unarmored" | "mage-armor";
  agathys?: boolean;
  formId?: string;
  incapacitated?: boolean;
  companion?: boolean;
  hp: number;
  temporaryHp: number;
  hitDice: number;
  remaining: Record<string, number>;
}
export type PlayAction =
  | { type: "cast-pact"; spellId: string }
  | { type: "magical-cunning" }
  | { type: "dark-blessing" }
  | { type: "fiendish-vigor" }
  | { type: "warlock-armor"; value: "leather" | "unarmored" | "mage-armor" }
  | { type: "end-agathys" }
  | { type: "transform"; formId: string }
  | { type: "revert" }
  | { type: "incapacitated"; value: boolean }
  | { type: "damage"; amount: number }
  | { type: "companion"; resource: "wild-shape" | "spell-slot-1" | "spell-slot-2" }
  | { type: "dismiss-companion" }
  | { type: "hp"; value: number }
  | { type: "temporary-hp"; value: number }
  | { type: "hit-dice"; value: number }
  | { type: "resource"; id: string; value: number }
  | { type: "rest"; kind: "short" | "long"; recover?: "one-first" | "two-first" | "one-second" };
const clamp = (value: unknown, max: number, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(0, Math.trunc(value))) : fallback;

export function normalizePlayState(value: unknown, character: DerivedCharacter): PlayState {
  const raw = isRecord(value) ? value : {};
  const remaining = isRecord(raw.remaining) ? raw.remaining : {};
  const hp = clamp(raw.hp, character.maxHp, character.maxHp);
  const incapacitated = raw.incapacitated === true;
  return {
    warlockArmor: character.pactMagic ? raw.warlockArmor === "mage-armor" ? character.pactMagic.atWill.includes("mage-armor") ? "mage-armor" : "unarmored" : raw.warlockArmor === "unarmored" ? "unarmored" : "leather" : undefined,
    agathys: !!character.pactMagic && raw.agathys === true && clamp(raw.temporaryHp, 999, 0) > 0,
    // 读档时也执行终止条件，篡改或过期形态不能绕过已知形态边界。
    formId: hp > 0 && !incapacitated && typeof raw.formId === "string" && character.wildShape?.knownForms.includes(raw.formId) ? raw.formId : undefined,
    incapacitated, companion: !!character.wildShape && raw.companion === true,
    hp,
    temporaryHp: clamp(raw.temporaryHp, 999, 0),
    hitDice: clamp(raw.hitDice, character.level, character.level),
    remaining: Object.fromEntries(character.resources.map((r) => [r.id, clamp(remaining[r.id], r.max, r.max)])),
  };
}

export function updatePlayState(state: PlayState, action: PlayAction, c: DerivedCharacter): PlayState {
  let next = { ...state, remaining: { ...state.remaining } };
  const canAct = !!c.pactMagic && next.hp > 0 && !next.incapacitated;
  // 施法与扣位原子执行；祈唤随意施法不进入契约法术位通道。
  if (action.type === "cast-pact" && canAct && c.spellcasting?.prepared.includes(action.spellId) && next.remaining["pact-slot"] > 0) {
    next.remaining["pact-slot"] -= 1;
    if (action.spellId === "armor-of-agathys") { next.temporaryHp = Math.max(next.temporaryHp, 10); next.agathys = true; }
  }
  if (action.type === "magical-cunning" && canAct && next.remaining["magical-cunning"] > 0 && next.remaining["pact-slot"] < 2) {
    next.remaining["magical-cunning"] -= 1; next.remaining["pact-slot"] += 1;
  }
  if (action.type === "dark-blessing" && c.pactMagic) next.temporaryHp = Math.max(next.temporaryHp, c.pactMagic.darkBlessing);
  if (action.type === "fiendish-vigor" && canAct && c.pactMagic?.atWill.includes("false-life")) next.temporaryHp = Math.max(next.temporaryHp, 12);
  if (action.type === "warlock-armor" && canAct && (action.value !== "mage-armor" || c.pactMagic?.atWill.includes("mage-armor"))) next.warlockArmor = action.value;
  if (action.type === "end-agathys") next.agathys = false;
  if (action.type === "transform" && c.wildShape?.knownForms.includes(action.formId) && next.hp > 0 && !next.incapacitated && next.remaining["wild-shape"] > 0) {
    next.formId = action.formId;
    next.remaining["wild-shape"] -= 1;
    next.temporaryHp = Math.max(next.temporaryHp, c.wildShape.temporaryHp);
  }
  // 临时 HP 按通常规则保留到耗尽或长休；结束形态不退款、不重新计算 HP。
  if (action.type === "revert") next.formId = undefined;
  if (action.type === "incapacitated") next.incapacitated = action.value;
  if (action.type === "damage") {
    const amount = clamp(action.amount, 9999, 0);
    next.hp -= Math.max(0, amount - next.temporaryHp);
    next.temporaryHp = Math.max(0, next.temporaryHp - amount);
  }
  if (action.type === "companion" && c.wildShape && !next.formId && next.hp > 0 && !next.incapacitated && next.remaining[action.resource] > 0) {
    next.remaining[action.resource] -= 1;
    next.companion = true;
  }
  if (action.type === "dismiss-companion") next.companion = false;
  if (action.type === "hp") next.hp = action.value;
  if (action.type === "temporary-hp") next.temporaryHp = action.value;
  if (action.type === "hit-dice") next.hitDice = action.value;
  if (action.type === "resource") next.remaining[action.id] = action.value;
  if (action.type === "rest") {
    // 长休须以至少 1 HP 开始；先记录治疗，再确认完成长休。
    if (action.kind === "long" && next.hp === 0) return normalizePlayState(next, c);
    // 短休不会自动治疗；生命骰的实际治疗量由玩家掷骰后记录。
    // 手动标记的失能可能来自持续效果；长休不擅自解除其来源。
    if (action.kind === "long") next = { ...normalizePlayState(undefined, c), incapacitated: state.incapacitated, warlockArmor: c.pactMagic ? state.warlockArmor === "leather" ? "leather" : "unarmored" : undefined };
    else {
      // 三级形态上限为一小时，完成至少一小时短休后已结束。
      next.formId = undefined;
      // 黯冰狱铠持续一小时；换用其他来源临时 HP 本身不会终止它。
      next.agathys = false;
      for (const resource of c.resources) next.remaining[resource.id] += resource.shortRestRestore ?? 0;
      // Recovery is atomic: insufficient expended slots never consume the daily use.
      if (c.spellcasting && next.remaining["arcane-recovery"] > 0 && action.recover) {
        const id = action.recover === "one-second" ? "spell-slot-2" : "spell-slot-1";
        const amount = action.recover === "two-first" ? 2 : 1;
        const max = c.resources.find((r) => r.id === id)!.max;
        if (next.remaining[id] + amount <= max) {
          next.remaining[id] += amount;
          next.remaining["arcane-recovery"] -= 1;
        }
      }
    }
  }
  return normalizePlayState(next, c);
}
