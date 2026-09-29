import { CANTRIP_DAMAGE } from "../../data/warlock";
import type { DerivedCharacter } from "../types";
import type { PlayState } from "./playState";
import { damageFormula } from "./format";

// 祈唤只修正绑定的戏法，避免将加伤或推离错误应用到所有法术。
export function warlockCantrip(c: DerivedCharacter, id: string) {
  const base = Object.prototype.hasOwnProperty.call(CANTRIP_DAMAGE, id) ? CANTRIP_DAMAGE[id] : undefined;
  if (!base || !c.pactMagic) return undefined;
  const has = (invocationId: string) => c.pactMagic!.invocations.some((v) => v.id === invocationId && v.target === id);
  return { damage: `${damageFormula(base.dice, has("agonizing-blast") ? c.abilities.charisma.modifier : 0)} ${base.damage}`,
    range: base.range + (has("eldritch-spear") ? c.level * 30 : 0), attack: base.attack,
    push: has("repelling-blast") && base.attack };
}

export function deriveWarlockPlay(base: DerivedCharacter, play: PlayState): DerivedCharacter {
  if (!base.pactMagic) return base;
  const mageArmor = play.warlockArmor === "mage-armor" && base.pactMagic.atWill.includes("mage-armor");
  const unarmored = play.warlockArmor === "unarmored";
  return { ...base, armorClass: (mageArmor ? 13 : unarmored ? 10 : 11) + base.abilities.dexterity.modifier,
    armorNote: mageArmor ? "未穿甲 · 法师护甲生效" : unarmored ? "未穿甲 · 10 + 敏捷" : "皮甲 · 11 + 敏捷" };
}
