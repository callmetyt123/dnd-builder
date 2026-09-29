import type { CharacterBuild, RogueSubclass } from "./types";
import type { BuilderState } from "../store/draft";
import { normalizePlayState } from "./engine/playState";
import { deriveCharacter } from "./engine/deriveCharacter";

// 子职切换保留玩家构筑选择，立即清掉失去的能力资源；不保留隐藏的旧资源余额。
export function changeRogueSubclass(state: BuilderState, subclassId: RogueSubclass): BuilderState {
  if (state.build.classId !== "rogue" || state.build.subclassId === subclassId) return state;
  const build: CharacterBuild = { ...state.build, subclassId };
  return { ...state, build, play: state.play ? normalizePlayState(state.play, deriveCharacter(build)) : undefined };
}
