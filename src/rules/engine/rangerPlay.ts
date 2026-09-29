import { primalForm, type PrimalChoice } from "../../data/ranger";
import type { DerivedCharacter } from "../types";
import { isRecord } from "../validator/buildShape";
import type { PlayAction, PlayState } from "./playState";

export interface PrimalState { choice: PrimalChoice; hp: number; temporaryHp: number; hitDice: number; status: "alive" | "dead" | "reviving" | "absent"; canReplace: boolean }
const bounded = (value: unknown, max: number, fallback: number) => typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(max, Math.trunc(value))) : fallback;
export function normalizePrimal(value: unknown, c: DerivedCharacter): PrimalState | undefined {
  if (!c.primalCompanion) return undefined;
  const raw = isRecord(value) ? value : {};
  const choice = isRecord(raw.choice) ? raw.choice : c.primalCompanion;
  const form = primalForm(String(choice.form)) ?? primalForm(c.primalCompanion.form) ?? primalForm("land")!;
  const status = ["dead", "reviving", "absent"].includes(String(raw.status)) ? raw.status as PrimalState["status"] : "alive";
  return { choice: { form: form.id, damage: form.damageTypes.includes(choice.damage as PrimalChoice["damage"]) ? choice.damage as PrimalChoice["damage"] : form.damageTypes[0], appearance: typeof choice.appearance === "string" ? choice.appearance.slice(0, 40) : "伙伴" }, status,
    hp: status === "alive" ? bounded(raw.hp, form.hp, form.hp) : 0, temporaryHp: status === "alive" ? bounded(raw.temporaryHp, 999, 0) : 0, hitDice: bounded(raw.hitDice, c.level, c.level), canReplace: raw.canReplace === true };
}
// 死亡与 0 HP 分开；复活在扣位后进入等待状态，须再确认一分钟已经过去。
export function applyRangerAction(state: PlayState, action: PlayAction, c: DerivedCharacter): PlayState {
  const b = normalizePrimal(state.primal, c);
  if (!b) return state;
  const next = { ...state, primal: { ...b }, remaining: { ...state.remaining } };
  // 替换限于长休结束时；开始其他冒险操作后不保留可随时治疗的召唤额度。
  if (action.type !== "primal-replace" && !(action.type === "rest" && action.kind === "long")) next.primal.canReplace = false;
  const canAct = state.hp > 0 && !state.incapacitated;
  if (action.type === "ranger-cast" && canAct && c.spellcasting?.prepared.includes(action.spellId)) {
    const resource = action.free && action.spellId === "hunters-mark" ? "favored-enemy" : "spell-slot-1";
    if (action.free && action.spellId !== "hunters-mark") return next;
    if (next.remaining[resource] > 0) { next.remaining[resource] -= 1; if (["hunters-mark", "ensnaring-strike", "entangle", "detect-magic"].includes(action.spellId)) next.rangerConcentration = action.spellId; }
  }
  if (action.type === "end-ranger-concentration") next.rangerConcentration = undefined;
  if (action.type === "primal-hp" && b.status === "alive") next.primal.hp = bounded(action.value, primalForm(b.choice.form)!.hp, b.hp);
  if (action.type === "primal-hit-dice") next.primal.hitDice = bounded(action.value, 3, b.hitDice);
  if (action.type === "primal-temp" && b.status === "alive") next.primal.temporaryHp = bounded(action.value, 999, b.temporaryHp);
  if (action.type === "primal-damage" && b.status === "alive") {
    const damage = bounded(action.amount, 9999, 0);
    next.primal.hp = Math.max(0, b.hp - Math.max(0, damage - b.temporaryHp)); next.primal.temporaryHp = Math.max(0, b.temporaryHp - damage);
  }
  if (action.type === "primal-dead" && b.status === "alive") { next.primal.status = "dead"; next.primal.hp = 0; next.primal.temporaryHp = 0; }
  if (action.type === "ranger-dead") { next.hp = 0; next.incapacitated = true; next.primal.status = "absent"; next.primal.canReplace = false; next.rangerConcentration = undefined; }
  if (action.type === "primal-revive" && canAct && b.status === "dead" && action.withinHour && next.remaining["spell-slot-1"] > 0) { next.remaining["spell-slot-1"] -= 1; next.primal.status = "reviving"; }
  if (action.type === "primal-revive-complete" && b.status === "reviving") { next.primal.status = "alive"; next.primal.hp = primalForm(b.choice.form)!.hp; }
  if (action.type === "primal-replace" && canAct && b.canReplace && primalForm(action.choice.form)?.damageTypes.includes(action.choice.damage) && action.choice.appearance.trim().length > 0 && action.choice.appearance.length <= 40) {
    next.primal = { choice: { ...action.choice }, hp: primalForm(action.choice.form)!.hp, temporaryHp: 0, hitDice: 3, status: "alive", canReplace: false };
  }
  return next;
}
