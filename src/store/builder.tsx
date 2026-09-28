import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { AbilityId, CharacterBuild, SkillId } from "../rules/types";

const STORAGE_KEY = "dnd5r-builder-draft-v1";

export type BuilderStep =
  | "home"
  | "playstyle"
  | "class"
  | "species"
  | "background"
  | "abilities"
  | "configuration"
  | "identity"
  | "review"
  | "character";

export interface BuilderState {
  step: BuilderStep;
  build: CharacterBuild;
}

function defaultBuild(): CharacterBuild {
  return {
    schemaVersion: 1,
    level: 3,
    classId: "fighter",
    subclassId: "champion",
    speciesId: "dwarf",
    backgroundId: "soldier",
    profileId: "fighter-heavy",
    playstyle: { tags: ["melee", "durability"], complexity: "simple" },
    abilities: {
      baseAssignment: {
        strength: 15,
        dexterity: 13,
        constitution: 14,
        intelligence: 8,
        wisdom: 12,
        charisma: 10,
      },
      backgroundBoosts: { strength: 2, constitution: 1 },
    },
    choices: {
      languages: ["dwarvish", "giant"],
      soldierGamingSet: "dice-set",
      fighterSkills: ["perception", "survival"],
      fightingStyle: "defense",
      weaponMasteries: ["greatsword", "flail", "javelin"],
    },
    equipment: { classPackage: "fighter-a", backgroundPackage: "soldier-a" },
    identity: { name: "", alignment: undefined, age: 40, personalityTraits: [] },
  };
}

type Action =
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
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const restored = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as BuilderState) : null;
    } catch {
      return null;
    }
  }, []);
  const [state, dispatch] = useReducer(reducer, restored ?? { step: "home", build: defaultBuild() });

  useEffect(() => {
    if (state.step !== "home" || state.build.identity.name || state.build.identity.alignment) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  return <BuilderContext.Provider value={{ state, dispatch, hasDraft: Boolean(restored && restored.step !== "home") }}>{children}</BuilderContext.Provider>;
}

export function useBuilder() {
  const value = useContext(BuilderContext);
  if (!value) throw new Error("useBuilder must be used inside BuilderProvider");
  return value;
}
