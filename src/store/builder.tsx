import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { AbilityId, CharacterBuild, SkillId } from "../rules/types";

import { defaultBuild } from "../rules/defaultBuild";
import { deriveCharacter } from "../rules/engine/deriveCharacter";
import { normalizePlayState, updatePlayState, type PlayAction } from "../rules/engine/playState";
import { parseDraft, STORAGE_KEY, type BuilderState, type BuilderStep, type DraftRestore } from "./draft";
export type { BuilderState, BuilderStep } from "./draft";

type Action =
  | { type: "play"; action: PlayAction }
  | { type: "gaming-set"; id: string }
  | { type: "boosts-equal" }
  | { type: "abilities-default" }
  | { type: "step"; step: BuilderStep }
  | { type: "reset" }
  | { type: "playstyle"; tags: string[]; complexity: CharacterBuild["playstyle"]["complexity"] }
  | { type: "ability-swap"; ability: AbilityId; value: number }
  | { type: "boosts"; plusTwo: AbilityId; plusOne: AbilityId }
  | { type: "languages"; languages: string[] }
  | { type: "fighter-skills"; skills: SkillId[] }
  | { type: "weapon-masteries"; ids: string[] }
  | { type: "identity"; patch: Partial<CharacterBuild["identity"]> };

function reducer(state: BuilderState, action: Action): BuilderState {
  if (action.type === "play") {
    const character = deriveCharacter(state.build);
    return { ...state, play: updatePlayState(normalizePlayState(state.play, character), action.action, character) };
  }
  if (action.type === "gaming-set") return { ...state, build: { ...state.build, choices: { ...state.build.choices, soldierGamingSet: action.id } } };
  if (action.type === "abilities-default") return { ...state, build: { ...state.build, abilities: defaultBuild().abilities } };
  if (action.type === "boosts-equal") return { ...state, build: { ...state.build, abilities: { ...state.build.abilities, backgroundBoosts: { strength: 1, dexterity: 1, constitution: 1 } } } };
  if (action.type === "step") return { ...state, step: action.step };
  if (action.type === "reset") return { step: "home", build: defaultBuild() };
  if (action.type === "playstyle") return { ...state, build: { ...state.build, playstyle: { tags: action.tags, complexity: action.complexity } } };
  if (action.type === "languages") return { ...state, build: { ...state.build, choices: { ...state.build.choices, languages: action.languages } } };
  if (action.type === "fighter-skills") return { ...state, build: { ...state.build, choices: { ...state.build.choices, fighterSkills: action.skills } } };
  if (action.type === "weapon-masteries") return { ...state, build: { ...state.build, choices: { ...state.build.choices, weaponMasteries: action.ids } } };
  if (action.type === "identity") return { ...state, build: { ...state.build, identity: { ...state.build.identity, ...action.patch } } };
  if (action.type === "boosts") {
    return {
      ...state,
      build: {
        ...state.build,
        abilities: {
          ...state.build.abilities,
          backgroundBoosts: { [action.plusTwo]: 2, [action.plusOne]: 1 },
        },
      },
    };
  }
  if (action.type === "ability-swap") {
    const scores = { ...state.build.abilities.baseAssignment };
    const other = (Object.keys(scores) as AbilityId[]).find((id) => scores[id] === action.value);
    if (!other) return state;
    const old = scores[action.ability];
    scores[action.ability] = action.value;
    scores[other] = old;
    return { ...state, build: { ...state.build, abilities: { ...state.build.abilities, baseAssignment: scores } } };
  }
  return state;
}

interface BuilderContextValue {
  state: BuilderState;
  dispatch: React.Dispatch<Action>;
  hasDraft: boolean;
  storageError: string;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const restored = useMemo<DraftRestore>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return parseDraft(raw);
    } catch {
      return { state: null, notice: "浏览器禁止访问本地存储；本次修改可能无法保存。" };
    }
  }, []);
  const [state, dispatch] = useReducer(reducer, restored.state ?? { step: "home", build: defaultBuild() });
  const [storageError, setStorageError] = useState("");
  const [notice, setNotice] = useState(restored.notice ?? "");

  useEffect(() => {
    try {
      // 首次写入前备份损坏草稿；备份失败时不覆盖原始内容。
      if (restored.preserveOriginal) {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw && !parseDraft(raw).state) {
          window.localStorage.setItem(`${STORAGE_KEY}-recovery`, raw);
        }
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageError("");
    } catch {
      setStorageError("本地保存失败。请先导出人物卡，避免关闭页面后丢失修改。");
    }
  }, [state, restored]);

  return <BuilderContext.Provider value={{ state, dispatch, hasDraft: Boolean(restored.state && (restored.state.step !== "home" || restored.state.build.identity.name)), storageError }}>
    {(notice || storageError) && <div className="storage-notice" role="status"><span>{storageError || notice}</span>{notice && <button className="button secondary" onClick={() => setNotice("")}>知道了</button>}</div>}
    {children}
  </BuilderContext.Provider>;
}

export function useBuilder() {
  const value = useContext(BuilderContext);
  if (!value) throw new Error("useBuilder must be used inside BuilderProvider");
  return value;
}
