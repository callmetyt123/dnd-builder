import { migrateBuild } from "./migrateBuild";
import type { CharacterBuild, ClassId } from "../rules/types";
import { defaultBuild } from "../rules/defaultBuild";
import { deriveCharacter } from "../rules/engine/deriveCharacter";
import { normalizePlayState, type PlayState } from "../rules/engine/playState";
import { hasBuildShape, isRecord, isSupportedBuild } from "../rules/validator/buildShape";
import { validateBuild } from "../rules/validator/validateBuild";

export const STEPS = ["home", "playstyle", "class", "species", "background", "abilities", "configuration", "spells", "identity", "review", "character"] as const;
export type BuilderStep = typeof STEPS[number];
type SavedCharacter = { build: CharacterBuild; play?: PlayState };
export interface BuilderState extends SavedCharacter { step: BuilderStep; profiles?: Partial<Record<ClassId, SavedCharacter>> }
// Preserve the other character, including spent resources, while switching class routes.
export function switchClass(state: BuilderState, classId: ClassId): BuilderState {
  if (state.build.classId === classId) return state;
  const saved = state.profiles?.[classId];
  return { step: "class", build: saved?.build ?? { ...defaultBuild(classId), identity: state.build.identity }, play: saved?.play,
    profiles: { ...state.profiles, [state.build.classId]: { build: state.build, play: state.play } } };
}
export const STORAGE_KEY = "dnd5r-builder-draft-v1";
export interface DraftRestore { state: BuilderState | null; notice?: string; preserveOriginal?: boolean }

export function parseDraft(raw: string | null): DraftRestore {
  if (!raw) return { state: null };
  try {
    const value: unknown = JSON.parse(raw);
    if (isRecord(value)) value.build = migrateBuild(value.build);
    if (!isRecord(value) || !hasBuildShape(value.build) || !isSupportedBuild(value.build)) {
      return { state: null, notice: "旧草稿的格式或角色方案不受支持，已保留原始数据。你可以重新创建角色。", preserveOriginal: true };
    }
    const step = STEPS.includes(value.step as BuilderStep) ? value.step as BuilderStep : "review";
    // 允许未完成的合法结构继续编辑，但不能从损坏草稿绕过生成人物卡的门禁。
    const checkedStep = step === "character" && !validateBuild(value.build).canGenerate ? "review" : step;
    const profiles: BuilderState["profiles"] = {};
    if (isRecord(value.profiles)) for (const id of ["fighter", "wizard", "druid", "warlock", "ranger"] as const) {
      const saved = value.profiles[id];
      if (isRecord(saved)) saved.build = migrateBuild(saved.build);
      if (isRecord(saved) && hasBuildShape(saved.build) && isSupportedBuild(saved.build) && saved.build.classId === id) {
        profiles[id] = { build: saved.build, play: saved.play === undefined ? undefined : normalizePlayState(saved.play, deriveCharacter(saved.build)) };
      }
    }
    const character = deriveCharacter(value.build);
    return { state: { step: checkedStep === "spells" && value.build.classId === "fighter" ? "configuration" : checkedStep, profiles, build: value.build, play: value.play === undefined ? undefined : normalizePlayState(value.play, character) }, notice: checkedStep !== value.step ? "草稿已恢复，请先检查尚未完成的内容。" : undefined };
  } catch {
    return { state: null, notice: "草稿无法解析，已保留原始数据。你可以重新创建角色。", preserveOriginal: true };
  }
}
