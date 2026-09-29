import { isNewClass, NEW_CLASSES } from "../../data/newClasses";
import { spell } from "../../data/spells";
import { WEAPONS } from "../../data/weapons";
import { newChoices } from "../newClasses";
import type { CharacterBuild, DerivedCharacter, NewClassId, DerivedResource } from "../types";

export const NEW_FEATURE_IDS: Record<NewClassId, string[]> = {
  barbarian: ["rage", "barbarian-defense", "danger-sense", "reckless-attack", "primal-knowledge"],
  bard: ["bardic-inspiration", "cutting-words", "bard-skills"],
  cleric: ["cleric-order", "channel-divinity-cleric", "turn-undead", "preserve-life", "disciple-of-life"],
  monk: ["martial-arts", "monk-focus", "uncanny-metabolism", "deflect-attacks", "open-hand-technique"],
  paladin: ["lay-on-hands", "paladin-smite", "channel-divinity-paladin", "sacred-weapon", "devotion-oath"],
  sorcerer: ["innate-sorcery", "sorcery-points", "metamagic", "draconic-resilience"],
};
// 保留共用起源派生，仅替换当前职业贡献；临时能力不预加到常驻数值。
export function deriveNewClass(build: CharacterBuild, c: DerivedCharacter): DerivedCharacter {
  if (!isNewClass(build.classId)) return c;
  const id = build.classId, q = newChoices(build)!, a = c.abilities, d = NEW_CLASSES[id];
  const dex = a.dexterity.modifier, str = a.strength.modifier, wis = a.wisdom.modifier, cha = a.charisma.modifier;
  let armorClass = c.armorClass, armorNote = "", speed = c.speed;
  if (id === "barbarian") { armorClass = 10 + dex + a.constitution.modifier; armorNote = "无甲防御 · 10 + 敏捷 + 体质"; }
  if (id === "bard") { armorClass = 11 + dex; armorNote = "皮甲 · 11 + 敏捷"; }
  if (id === "cleric") { armorClass = 15 + Math.min(2, dex); armorNote = "链甲衫 + 盾牌 · 15 + 敏捷（至多 +2）"; }
  if (id === "monk") { armorClass = 10 + dex + wis; armorNote = "无甲、无盾 · 10 + 敏捷 + 感知"; speed += 10; }
  if (id === "paladin") { armorClass = 18 + Number(q.style === "defense"); armorNote = "链甲 + 盾牌" + (q.style === "defense" ? " + 防御风格" : ""); if (a.strength.score < 13) speed -= 10; }
  if (id === "sorcerer") { armorClass = 10 + dex + cha; armorNote = "龙族体魄 · 10 + 敏捷 + 魅力"; }
  const skills = { ...c.skills };
  if (id === "bard") for (const [key, value] of Object.entries(skills)) if (value.proficiency === "none") skills[key as keyof typeof skills] = { ...value, modifier: value.modifier + 1 };
  if (id === "cleric" && q.order === "thaumaturge") for (const key of ["arcana", "religion"] as const) skills[key] = { ...skills[key], modifier: skills[key].modifier + Math.max(1, wis) };
  const attacks = c.attacks.map((attack) => {
    const w = WEAPONS[attack.weaponId];
    const monkWeapon = id === "monk" && w.category.endsWith("melee") && (w.category.startsWith("simple") || !!w.properties?.includes("轻型"));
    const proficient = w.category.startsWith("simple") || id === "barbarian" || id === "paladin" || (id === "cleric" && q.order === "protector") || (id === "monk" && !!w.properties?.includes("轻型"));
    const mod = monkWeapon || w.finesse ? Math.max(str, dex) : a[w.ability].modifier;
    return { ...attack, attackBonus: mod + (proficient ? 2 : 0), damageModifier: mod, damageDice: monkWeapon && ["1d4", "1"].includes(w.damageDice) ? "1d6" : w.damageDice,
      mastery: { id: w.mastery, unlocked: (id === "barbarian" || id === "paladin") && build.choices.weaponMasteries.includes(w.id) } };
  });
  const castingAbility = id === "cleric" ? wis : cha;
  const prepared = [...new Set([...q.prepared, ...d.auto])];
  const casting = d.preparedCount ? { attack: 2 + castingAbility, dc: 10 + castingAbility, cantrips: q.cantrips, prepared, ritualSpells: prepared.filter((s) => spell(s)?.ritual), book: [] } : undefined;
  const resources: DerivedResource[] = id === "barbarian" ? [{ id: "rage", max: 3, recovery: "短休恢复 1 次；长休全恢复", shortRestRestore: 1 }]
    : id === "monk" ? [{ id: "monk-focus", max: 3, recovery: "短休或长休全恢复", shortRestRestore: 3 }, { id: "uncanny-metabolism", max: 1, recovery: "长休恢复；掷先攻时可用" }]
    : id === "bard" ? [{ id: "bardic-inspiration", max: Math.max(1, cha), recovery: "d6；长休全恢复，三级不随短休恢复" }]
    : id === "cleric" ? [{ id: "channel-divinity-cleric", max: 2, recovery: "短休恢复 1 次；长休全恢复", shortRestRestore: 1 }]
    : id === "paladin" ? [{ id: "lay-on-hands", max: 15, recovery: "治疗点，长休补满；移除中毒花 5 点" }, { id: "paladin-smite", max: 1, recovery: "免费一环至圣斩，长休恢复；仍需附赠动作与言语" }, { id: "channel-divinity-paladin", max: 2, recovery: "短休恢复 1 次；长休全恢复", shortRestRestore: 1 }]
    : [{ id: "innate-sorcery", max: 2, recovery: "长休全恢复" }, { id: "sorcery-points", max: 3, recovery: "长休全恢复；三级无短休恢复" }];
  if (casting) { resources.push({ id: "spell-slot-1", max: id === "paladin" ? 3 : 4, recovery: "长休全恢复" }); if (id !== "paladin") resources.push({ id: "spell-slot-2", max: 2, recovery: "长休全恢复" }); }
  // 原派生里的法师兜底条目不属于新职业；保留原有专长与种族资源。
  const oldCore = ["spell-slot-1", "spell-slot-2", "arcane-recovery"];
  return { ...c, armorClass, armorNote, speed, maxHp: c.maxHp + (id === "sorcerer" ? 3 : 0), skills, passivePerception: 10 + skills.perception.modifier, attacks,
    spellcasting: casting, resources: [...resources, ...c.resources.filter((r) => !oldCore.includes(r.id))], features: [...NEW_FEATURE_IDS[id], ...c.features.filter((f) => !["spellcasting", "ritual-adept", "arcane-recovery", "scholar"].includes(f))] };
}
