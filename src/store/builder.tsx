import { changePrimalSubclass, reconcilePrimalChoices } from "../rules/primalSubclasses";
import type { PrimalSubclassId, DruidChoices as PrimalDruidChoices } from "../rules/types";
import { changeExpandedSubclass, defaultFighterChoices } from "../rules/expandedSubclasses";
import type { FighterChoices, FighterSubclass, WizardSubclass } from "../rules/types";
import { applyRecommendation, type RecommendationStep } from "../rules/guides/onboarding";
import { changeRogueSubclass } from "../rules/rogue";
import type { RogueChoices, RogueSubclass } from "../rules/types";
import { changeSpecies } from "../rules/species";
import type { SpeciesId, SpeciesChoices } from "../rules/types";
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { AbilityId, CharacterBuild, ClassId, SkillId, DruidChoices, WizardChoices, WarlockChoices, RangerChoices, BackgroundId, OriginChoices } from "../rules/types";

import { BACKGROUNDS } from "../data/backgrounds";
import { changeBackground, defaultMagic, recommendSkills } from "../rules/origins";
import { defaultBuild } from "../rules/defaultBuild";
import { deriveCharacter } from "../rules/engine/deriveCharacter";
import { normalizePlayState, updatePlayState, type PlayAction } from "../rules/engine/playState";
import { switchClass, parseDraft, STORAGE_KEY, type BuilderState, type BuilderStep, type DraftRestore } from "./draft";
export type { BuilderState, BuilderStep } from "./draft";

type Action =
  | { type: "primal-subclass"; id: PrimalSubclassId }
  | { type: "primal-druid"; patch: Partial<PrimalDruidChoices> }
  | { type: "expanded-subclass"; id: FighterSubclass | WizardSubclass }
  | { type: "fighter"; patch: Partial<FighterChoices> }
  | { type: "recommend-step"; step: RecommendationStep }
  | { type: "rogue"; patch: Partial<RogueChoices> }
  | { type: "rogue-subclass"; id: RogueSubclass }
  | { type: "class"; id: ClassId }
  | { type: "ranger"; patch: Partial<RangerChoices> }
  | { type: "warlock"; patch: Partial<WarlockChoices> }
  | { type: "druid"; patch: Partial<DruidChoices> }
  | { type: "wizard"; patch: Partial<WizardChoices> }
  | { type: "play"; action: PlayAction }
  | { type: "species"; id: SpeciesId }
  | { type: "species-choices"; patch: Partial<SpeciesChoices> }
  | { type: "background"; id: BackgroundId }
  | { type: "origin"; patch: Partial<OriginChoices> }
  | { type: "origin-magic-default" }
  | { type: "skills-recommend" }
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
  if (action.type === "primal-subclass") return { ...state, build: changePrimalSubclass(state.build, action.id) };
  if (action.type === "primal-druid") return { ...state, build: reconcilePrimalChoices({ ...state.build, choices: { ...state.build.choices, druid: { ...state.build.choices.druid!, ...action.patch } } }) };
  if (action.type === "expanded-subclass") {
    const build = changeExpandedSubclass(state.build, action.id);
    return { ...state, build, play: state.play ? normalizePlayState(state.play, deriveCharacter(build)) : undefined };
  }
  if (action.type === "fighter" && state.build.classId === "fighter") return { ...state, build: { ...state.build, choices: { ...state.build.choices, fighter: { ...(state.build.choices.fighter ?? defaultFighterChoices()), ...action.patch } } } };
  if (action.type === "recommend-step") return { ...state, build: applyRecommendation(state.build, action.step) };
  if (action.type === "rogue" && state.build.classId === "rogue") return { ...state, build: { ...state.build, choices: { ...state.build.choices, rogue: { ...state.build.choices.rogue!, ...action.patch } } } };
  if (action.type === "rogue-subclass") return changeRogueSubclass(state, action.id);
  if (action.type === "species") return { ...state, build: changeSpecies(state.build, action.id) };
  if (action.type === "species-choices") return { ...state, build: { ...state.build, choices: { ...state.build.choices, species: { ...state.build.choices.species, ...action.patch } } } };
  if (action.type === "class") return switchClass(state, action.id);
  if (action.type === "ranger" && state.build.choices.ranger) return { ...state, build: { ...state.build, choices: { ...state.build.choices, ranger: { ...state.build.choices.ranger, ...action.patch } } } };
  if (action.type === "warlock" && state.build.choices.warlock) return { ...state, build: { ...state.build, choices: { ...state.build.choices, warlock: { ...state.build.choices.warlock, ...action.patch } } } };
  if (action.type === "druid" && state.build.choices.druid) return { ...state, build: { ...state.build, choices: { ...state.build.choices, druid: { ...state.build.choices.druid, ...action.patch } } } };
  if (action.type === "wizard" && state.build.choices.wizard) return { ...state, build: { ...state.build, choices: { ...state.build.choices, wizard: { ...state.build.choices.wizard, ...action.patch } } } };
  if (action.type === "play") {
    const character = deriveCharacter(state.build);
    return { ...state, play: updatePlayState(normalizePlayState(state.play, character), action.action, character) };
  }
  if (action.type === "background") return { ...state, build: changeBackground(state.build, action.id) };
  if (action.type === "skills-recommend") return { ...state, build: recommendSkills(state.build) };
  if (action.type === "origin") return { ...state, build: { ...state.build, choices: { ...state.build.choices, origin: { ...state.build.choices.origin, ...action.patch } } } };
  if (action.type === "origin-magic-default") return { ...state, build: { ...state.build, choices: { ...state.build.choices, origin: { ...state.build.choices.origin, magicInitiate: defaultMagic(BACKGROUNDS[state.build.backgroundId].magicList ?? "wizard", state.build.classId) } } } };
  if (action.type === "abilities-default") return { ...state, build: applyRecommendation(state.build, "abilities") };
  if (action.type === "boosts-equal") return { ...state, build: { ...state.build, abilities: { ...state.build.abilities, backgroundBoosts: Object.fromEntries(BACKGROUNDS[state.build.backgroundId].abilities.map((id) => [id, 1])) } } };
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

  // 步骤切换回到页首，避免长背景页的滚动位置让下一步标题和说明不可见。
  useEffect(() => { window.scrollTo(0, 0); }, [state.step]);

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
