import { BACKGROUNDS } from "../../data/backgrounds";
import { features, itemNames } from "../../data/characterDetails";
import { spell } from "../../data/spells";
import { signed } from "../../rules/engine/format";
import type { PlayState } from "../../rules/engine/playState";
import type { CharacterBuild, DerivedCharacter } from "../../rules/types";
import { abilityNames } from "../../translations/zh-CN";
import { Header } from "./CharacterSheets";

export function OriginSummary({ c }: { c: DerivedCharacter }) {
  const feat = ["savage-attacker", "healer", "lucky", "magic-initiate"].find((id) => c.features.includes(id));
  if (!feat) return null;
  return <section><h3>背景专长 · {features[feat].name}</h3><p>{features[feat].text}</p>{feat === "healer" && !c.equipment.some((e) => e.id === "healers-kit") && <p className="sheet-note">起始装备没有医疗包，战地医师暂时不能使用；治疗骰重掷仍可用于你的治疗法术。</p>}{feat === "magic-initiate" && <p className="sheet-note">具体选择、施法属性与成分见背景法术附页。</p>}</section>;
}

export function OriginSpellSheet({ build, c, play }: { build: CharacterBuild; c: DerivedCharacter; play: PlayState }) {
  const magic = c.originMagic;
  if (!magic) return null;
  // 背景法术独立成附页，非施法职业也能打印；不混入职业准备或法术书名额。
  return <article className="sheet-page" data-sheet-page>
    <Header build={build} title="背景法术附页 · 魔法学徒" page="附页 1 / 1" />
    <p className="casting-strip">{BACKGROUNDS[build.backgroundId].name} · {abilityNames[magic.ability]}施法 · 攻击 {signed(magic.attack)} · DC {magic.dc}</p>
    <p>一环法术免费施展：剩余 {play.remaining["magic-initiate"]} / 1，长休恢复。也可以消耗你已有的法术位；本专长不额外提供法术位。施法时仍须满足动作、反应触发与成分要求。</p>
    <div className="spell-card-grid">{[...magic.cantrips, magic.spell].map((id) => {
      const s = spell(id)!;
      return <section className="spell-card" key={id}><h3>{s.name} <small>{s.level === 0 ? "戏法" : "一环"} · {s.school}</small></h3><div className="spell-source">{s.level === 0 ? "背景专长戏法 · 不耗法术位" : "背景专长 · 始终准备 · 免费一次或用法术位"}</div><p><b>{s.time}</b> · {s.range}<br />{s.components}<br />{s.concentration ? "专注 · " : ""}{s.duration}{s.ritual ? " · 可仪式" : ""}</p><p>{s.text}</p></section>;
    })}</div>
    <section><h3>施法前检查</h3><p>V：需要能出声；S：需要自由手；M：需要法术注明的材料或适用的法器。专长本身不授予法器使用权或额外材料包，起始装备中的书法工具不能代替施法材料。</p><p>{build.classId === "wizard" ? "所选专长法术来自法师列表，可按职业规则使用奥术法器；带标价或会消耗的材料仍需实物。" : "只有职业规则允许用于该法术的法器才可替代材料。没有适用法器时，请准备法术注明的材料；带标价或会消耗的材料仍需实物。"}</p>{c.wildShape && <p>三级月亮结社的兽形不能施展这些背景法术；只有结社明确允许的法术例外。</p>}<p>标有仪式的法术可额外花 10 分钟施展而不耗位或免费次数，施法期间需专注。同一时间只能专注一个效果，一回合只能消耗一个法术位施法。免费施法仍遵守其他施法限制。</p></section>
    <footer className="sheet-footer">背景附页独立编号 · 专长法术不占职业准备名额 · 工具熟练：{c.tools.map((id) => itemNames[id] ?? id).join("、")}</footer>
  </article>;
}
