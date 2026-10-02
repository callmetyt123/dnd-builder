import { NEW_CLASSES, isNewClass } from "./newClasses";
import { NEW_SUBCLASSES } from "./newSubclasses";
import { FIGHTER_SUBCLASSES, WIZARD_SUBCLASSES } from "./expandedSubclasses";
import { DRUID_SUBCLASSES, RANGER_SUBCLASSES, WARLOCK_SUBCLASSES } from "./primalSubclasses";
import { ROGUE_SUBCLASSES } from "./rogue";
import { PROFILES } from "./profiles";
import type { ClassId, NewSubclassId, PrimalSubclassId, RogueSubclass, FighterSubclass, WizardSubclass } from "../rules/types";

// 十二个职业的子职数据来源不同，这里统一成一种形状，供职业页的状态条、缩略选择和后续步骤的位置提示共用。
export type AnySubclassId = NewSubclassId | RogueSubclass | FighterSubclass | WizardSubclass | PrimalSubclassId;

export interface SubclassOption {
  id: AnySubclassId;
  name: string;
  complexity: string;
  recommended: boolean;
}

// 每职业的入门推荐子职来自各数据表自身的推荐标记，不再单独维护一份映射。
export function subclassOptions(classId: ClassId): SubclassOption[] {
  if (isNewClass(classId)) {
    const recommended = NEW_CLASSES[classId].subclassId;
    return Object.entries(NEW_SUBCLASSES)
      .filter(([, value]) => value.classId === classId)
      .map(([id, value]) => ({ id: id as NewSubclassId, name: value.name, complexity: value.complexity, recommended: id === recommended }));
  }
  if (classId === "fighter") return Object.entries(FIGHTER_SUBCLASSES).map(([id, value]) => ({ id: id as FighterSubclass, name: value.name, complexity: value.complexity, recommended: id === "champion" }));
  if (classId === "wizard") return Object.entries(WIZARD_SUBCLASSES).map(([id, value]) => ({ id: id as WizardSubclass, name: value.name, complexity: value.complexity, recommended: id === "evoker" }));
  if (classId === "druid") return Object.entries(DRUID_SUBCLASSES).map(([id, value]) => ({ id: id as PrimalSubclassId, name: value.name, complexity: value.complexity, recommended: id === "moon" }));
  if (classId === "warlock") return Object.entries(WARLOCK_SUBCLASSES).map(([id, value]) => ({ id: id as PrimalSubclassId, name: value.name, complexity: value.complexity, recommended: id === "fiend" }));
  if (classId === "ranger") return Object.entries(RANGER_SUBCLASSES).map(([id, value]) => ({ id: id as PrimalSubclassId, name: value.name, complexity: value.complexity, recommended: id === "hunter" }));
  return Object.entries(ROGUE_SUBCLASSES).map(([id, value]) => ({ id: id as RogueSubclass, name: value.name, complexity: value.complexity, recommended: id === "thief" }));
}

export function currentSubclassOption(classId: ClassId, subclassId: AnySubclassId): SubclassOption | undefined {
  return subclassOptions(classId).find((option) => option.id === subclassId);
}

export function className(classId: ClassId): string {
  return PROFILES[classId].name;
}

// 「职业配置」页只对部分职业需要选子职专属项，这里给出该页是否与子职相关，便于提示文案区分。
export function recommendedSubclassId(classId: ClassId): AnySubclassId {
  const options = subclassOptions(classId);
  return (options.find((option) => option.recommended) ?? options[0]).id;
}
