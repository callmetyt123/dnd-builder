import { BACKGROUNDS } from "../../data/backgrounds";
import { features, itemNames } from "../../data/characterDetails";
import { SPECIES, GIANT_GIFTS, DRAGON_DAMAGE, DAMAGE_NAMES } from "../../data/species";
import { ORIGIN_FEATS, CRAFTING, TOOL_OPTIONS, INSTRUMENTS } from "../../data/originOptions";
import { wizardSpell } from "../../rules/expandedSubclasses";
import { featSources } from "../../rules/origins";
import { signed } from "../../rules/engine/format";
import type { PlayState } from "../../rules/engine/playState";
import type { CharacterBuild, DerivedCharacter, OriginFeat } from "../../rules/types";
import { abilityNames, skillNames } from "../../translations/zh-CN";
import { Header } from "./CharacterSheets";

export function isOriginResource(c: DerivedCharacter, id: string) { return c.speciesFeatures.includes(id) || ["magic-initiate", "human-magic", "species-magic", "lucky"].includes(id); }

export function SpeciesSummary({ c }: { c: DerivedCharacter }) {
  return <p className="sheet-note">{c.size === "small" ? "小型" : "中型"}类人生物 · 被动察觉 {c.passivePerception} · {c.senses.darkvision ? `黑暗视觉 ${c.senses.darkvision} 尺` : "普通视觉"} · {c.resistances.length ? c.resistances.map((id) => DAMAGE_NAMES[id] ?? id).join("、") + "伤害抗性" : "无种族伤害抗性"}。条件豁免与其他种族能力见起源附页。</p>;
}
export function OriginSummary({ c }: { c: DerivedCharacter }) {
  const feats = ORIGIN_FEATS.filter((id) => c.features.includes(id));
  return <section><h3>起源专长</h3><p>{feats.map((id) => features[id].name).join("、")}。选择、触发条件与使用方法见起源能力附页。</p></section>;
}
// 起源能力单独分页，避免人类的第二专长或阿斯莫长段能力挤出职业卡。
export function OriginDetailSheet({ build, c, play }: { build: CharacterBuild; c: DerivedCharacter; play: PlayState }) {
  const sc = build.choices.species, species = SPECIES[build.speciesId];
  const names: Record<string, string> = { ...skillNames, ...TOOL_OPTIONS };
  return <article className="sheet-page" data-sheet-page><Header build={build} title="起源能力附页" page="起源 1 / 1" />
    <h3>{species.name}{species.lineages ? ` · ${species.lineages[sc.lineage]}` : ""} · {BACKGROUNDS[build.backgroundId].name}</h3><SpeciesSummary c={c} />
    <div className="sheet-resources">{c.resources.filter((r) => isOriginResource(c, r.id)).map((r) => <div key={r.id}><b>{features[r.id].name} <span>{"□ ".repeat(r.max)} / {r.max}</span></b><small>{r.recovery}</small></div>)}</div>
    {play.formId && <p>当前为兽形：本页列出原形种族能力，兽形不保留这些种族能力。种族资源保留记录，恢复原形后可用。</p>}
    <div className="sheet-features">{c.speciesFeatures.filter((id) => id !== "darkvision" && id !== "versatile").map((id) => <div key={id}><b>{features[id].name}</b><small>{features[id].timing}</small><p>{features[id].text}</p></div>)}</div>
    {build.speciesId === "elf" && <p>敏锐感官所选：{skillNames[sc.skill]}。</p>}
    {build.speciesId === "human" && <p>额外种族技能：{skillNames[sc.skill]}。英雄激励由玩家在纸上记录：□。</p>}
    {build.speciesId === "goliath" && <p><b>{GIANT_GIFTS[sc.lineage]}</b>体质调整值 {signed(c.abilities.constitution.modifier)}。</p>}
    {build.speciesId === "dragonborn" && <p><b>当前吐息：</b>{DAMAGE_NAMES[DRAGON_DAMAGE[sc.lineage]]} · 敏捷豁免 DC {8 + c.proficiencyBonus + c.abilities.constitution.modifier} · 1d10，成功半伤。每长休两次。三级尚无龙裔飞行。</p>}
    {build.speciesId === "aasimar" && <p><b>死灵环绕：</b>魅力豁免 DC {8 + c.proficiencyBonus + c.abilities.charisma.modifier}。天堂飞翼仅变身期间飞行 {c.speed} 尺。</p>}
    {featSources(build).map((f) => <section key={f.source}><h3>{f.source} · {features[f.id].name}</h3><p>{features[f.id].text}</p>
      {f.id === "skilled" && <p>所选熟练：{f.choices.skilled.map((id) => names[id]).join("、")}。</p>}
      {f.id === "musician" && <p>乐器熟练：{f.choices.musician.map((id) => names[id]).join("、")}。随身乐器：{c.equipment.filter((e) => c.tools.includes(e.id) && Object.prototype.hasOwnProperty.call(INSTRUMENTS, e.id)).map((e) => names[e.id]).join("、") || "无，需另行取得"}。</p>}
      {f.id === "crafter" && <p>{c.tools.filter((id) => Object.prototype.hasOwnProperty.call(CRAFTING, id)).map((id) => `${names[id]}：${CRAFTING[id]}${c.equipment.some((e) => e.id === id) ? "（已持有工具）" : "（未持有工具）"}`).join("；")}。</p>}
      {f.id === "healer" && <p>医疗包：{c.equipment.some((e) => e.id === "healers-kit") ? "起始装备已持有，每包含 10 次" : "起始装备没有，战地医师需另行取得"}。</p>}
      {f.id === "tavern-brawler" && <p>徒手打击命中 {signed(c.proficiencyBonus + c.abilities.strength.modifier)} · 伤害 1d4{signed(c.abilities.strength.modifier)} 钝击。</p>}
      {f.id === "magic-initiate" && <p>法术与独立施法属性见该来源的法术附页。</p>}
    </section>)}
    <footer className="sheet-footer">工具熟练不等于持有工具 · 黑暗视觉不提供颜色辨识，也不能穿透魔法黑暗 · 条件能力不视为常驻优势</footer>
  </article>;
}
export function OriginSpellSheet({ build, c }: { build: CharacterBuild; c: DerivedCharacter; play: PlayState }) {
  return <>{c.innateMagic.map((magic, i) => <article className="sheet-page" data-sheet-page key={magic.source}>
    <Header build={build} title={magic.source === "种族法术" ? "种族法术附页" : magic.source.startsWith("人类") ? "人类专长法术附页" : "背景法术附页 · 魔法学徒"} page={`法术附页 ${i + 1} / ${c.innateMagic.length}`} />
    <p className="casting-strip">{magic.source} · {abilityNames[magic.ability]}施法 · 攻击 {signed(magic.attack)} · DC {magic.dc}</p>
    {magic.resource ? <p>一环法术免费施展：{"□ ".repeat(magic.freeUses)} / {magic.freeUses}，长休恢复。也可消耗已有法术位；此来源不额外提供法术位。</p> : <p>戏法不消耗法术位，仍须满足施法时间与成分要求。</p>}
    <div className="spell-card-grid">{[...magic.cantrips, ...magic.spells].map((id) => {
      const s = wizardSpell(build, id);
      if (!s) return null;
      const text = id === "false-life" ? "获得 2d4+4 临时 HP；二环施展额外 +5。临时 HP 不叠加。此来源不享受邪魔活力的最大值。" : s.text.replace(/感知调整值/g, "本页施法属性调整值");
      return <section className="spell-card" key={id}><h3>{s.name} <small>{s.level === 0 ? "戏法" : "一环"} · {s.school}</small></h3><div className="spell-source">{s.level === 0 ? "不耗法术位" : "始终准备 · 免费次数或用法术位"}</div><p><b>{s.time}</b> · {s.range}<br />{s.components}<br />{s.concentration ? "专注 · " : ""}{s.duration}{s.ritual ? " · 可仪式" : ""}</p><p>{text}</p>{c.features.includes("healer") && ["cure-wounds", "healing-word"].includes(id) && <p>医疗师：治疗骰为 1 可重掷，必须使用新结果。</p>}</section>;
    })}</div>
    <section><h3>施法前检查</h3><p>V 需能出声；S 需自由手；M 需指定材料或适用法器。种族与专长本身不授予法器使用权；职业法器仅适用于该职业规则允许的法术，圣徽、工具或普通长棍不能自动代替所有材料。有标价或会消耗的材料必须备齐。</p><p>本页法术独立于职业准备名额；同一法术来自不同来源时，使用该来源的属性与次数。仪式法术可额外花 10 分钟，不耗位或免费次数，施法期间需专注。一回合只能消耗一个法术位施法，同时只能专注一个效果。</p>{c.wildShape && <p>三级月亮结社兽形仅可施展结社明确允许的法术；种族能力不保留。恢复原形后再使用本页能力。</p>}</section>
    <footer className="sheet-footer">施法属性调整值 {signed(c.abilities[magic.ability].modifier)} · 条件加值和临时效果未计入常驻数值</footer>
  </article>)}</>;
}
export function classFeatureIds(c: DerivedCharacter) { return c.features.filter((id) => !c.speciesFeatures.includes(id) && !ORIGIN_FEATS.includes(id as OriginFeat)); }
