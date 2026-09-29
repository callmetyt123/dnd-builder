import type { Spell } from "./spells";
import type { CharacterBuild, RogueSubclass } from "../rules/types";
import { STANDARD_LANGUAGE_IDS } from "./core";
import { WEAPONS } from "./weapons";

// 仅列三级可获得能力，避免把九级以上的子职增益提前授予角色。
export const ROGUE_SUBCLASSES: Record<RogueSubclass, { name: string; complexity: string; reason: string; features: string[] }> = {
  thief: { name: "盗贼", complexity: "推荐 · 较少资源管理", reason: "擅长攀爬、开锁与使用物件，先学会偷袭和附赠动作即可开始。", features: ["fast-hands", "second-story-work"] },
  assassin: { name: "刺客", complexity: "适中 · 留意战斗首轮", reason: "先攻优势与首轮突袭适合喜欢抢占先机的玩家；无需管理额外次数。", features: ["assassinate", "assassins-tools"] },
  "arcane-trickster": { name: "诡术师", complexity: "较复杂 · 管理法术", reason: "用法师之手和少量奥术辅助潜行，需要额外理解成分、专注和法术位。", features: ["trickster-spellcasting", "mage-hand-legerdemain"] },
  soulknife: { name: "魂刃", complexity: "适中 · 管理灵能骰", reason: "以念刃作战并帮助技能检定、心灵交流；念刃本身不消耗灵能骰。", features: ["psionic-power", "psi-bolstered-knack", "psychic-whispers", "psychic-blades"] },
};
export const ROGUE_LANGUAGES = [...STANDARD_LANGUAGE_IDS, "abyssal", "celestial", "deep-speech", "druidic", "infernal", "primordial", "sylvan", "thieves-cant", "undercommon"];
export const rogueWeaponProficient = (id: string) => !!WEAPONS[id] && (WEAPONS[id].category.startsWith("simple") || !!WEAPONS[id].finesse || !!WEAPONS[id].properties?.includes("轻型"));
export const ROGUE_MASTERIES = Object.keys(WEAPONS).filter(rogueWeaponProficient);
export const rogueFeatures = (id: RogueSubclass) => ["rogue-expertise", "sneak-attack", "thieves-cant", "rogue-mastery", "cunning-action", "steady-aim", ...ROGUE_SUBCLASSES[id].features];
export const hasSpellStep = (build: CharacterBuild) => build.classId !== "fighter" && (build.classId !== "rogue" || build.subclassId === "arcane-trickster");

// 同一法术字典由多个职业共享；纸卡只补充当前子职的施法方式。
export function rogueSpellText(s: Spell): string {
  if (s.id === "mage-hand") return s.text.replace("以后用魔法动作操控", "以后可用附赠动作操控") + " 可令手隐形，并以它作敏捷（巧手）检定。";
  if (s.id === "mind-sliver") return s.text.split("此法术不用攻击检定")[0];
  if (s.id === "false-life") return "获得 2d4+4 临时 HP；临时 HP 不叠加。";
  return s.text.replace(/感知调整值/g, "智力调整值");
}
