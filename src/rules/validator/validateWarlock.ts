import { PROFILES } from "../../data/profiles";
import { GAMING_SETS } from "../../data/characterDetails";
import { WARLOCK_CANTRIPS, WARLOCK_PREPARABLE, eligibleTarget, invocation, invocationKey } from "../../data/warlock";
import { spell } from "../../data/spells";
import type { ValidationMessage, WarlockChoices } from "../types";

export function validateWarlock(w: WarlockChoices): ValidationMessage[] {
  const messages: ValidationMessage[] = [];
  const check = (ok: boolean, id: string, message: string, targetStep: string) => {
    if (!ok) messages.push({ id, domain: "rules", severity: "blocker", message, targetStep });
  };
  const unique = (ids: string[], count: number) => ids.length === count && new Set(ids).size === count;
  check(unique(w.skills, 2) && w.skills.every((s) => PROFILES.warlock.skills.includes(s)), "warlock-skills", "选择 2 项不同的魔契师职业技能。", "configuration");
  check(Object.prototype.hasOwnProperty.call(GAMING_SETS, w.gamingSet), "wayfarer-game", "请选择流浪者起始装备中的一种赌具；此背景不提供赌具熟练。", "background");
  check(unique(w.cantrips, 2) && w.cantrips.every((id) => WARLOCK_CANTRIPS.includes(id)), "warlock-cantrips", "选择 2 道不同的魔契师戏法。", "spells");
  check(unique(w.prepared, 4) && w.prepared.every((id) => WARLOCK_PREPARABLE.includes(id)), "warlock-prepared", "选择 4 道不同的职业准备法术；邪魔法术额外获得，不重复占用名额。", "spells");
  // 三级新增一道，另可替换一道旧法术；因此最多有两道二环职业法术。
  check(w.prepared.filter((id) => spell(id)?.level === 2).length <= 2, "warlock-progression", "三级最多选择 2 道二环职业法术：升级新增 1 道、替换旧法术 1 道。", "spells");
  check(unique(w.invocations.map(invocationKey), 3), "invocations-count", "选择 3 项祈唤；可复选祈唤必须绑定不同的戏法，其他祈唤不可重复。", "configuration");
  check(w.invocations.every((choice) => {
    const option = invocation(choice.id);
    return !!option && option.minLevel <= 3 && (option.target ? !!choice.target && eligibleTarget(choice.id, choice.target, w.cantrips) : choice.target === undefined);
  }), "invocation-prerequisite", "祈唤须为已录入的三级可选项，目标须为符合伤害／攻击／射程要求的已知魔契师戏法。", "configuration");
  return messages;
}
