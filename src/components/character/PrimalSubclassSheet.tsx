import type { CharacterBuild, DerivedCharacter } from "../../rules/types";
import { primalSubclass, LAND_TYPES, STAR_MAPS, STAR_FORMS, FEY_GIFTS, HUNTERS_PREY, PRIMAL_FEATURES } from "../../data/primalSubclasses";
import { primalAction } from "../../rules/guides/primalGuide";
import { signed } from "../../rules/engine/format";
import { skillNames } from "../../translations/zh-CN";
import { Header } from "./CharacterSheets";

export function hasPrimalAppendix(build: CharacterBuild) { return !!primalSubclass(build) && !["moon", "fiend", "beast-master"].includes(build.subclassId); }
// 专属操作单独分页，核心卡只保留共同职业能力，防止法术较多时挤出纸张。
export function PrimalSubclassSheet({ build: b, c }: { build: CharacterBuild; c: DerivedCharacter }) {
  if (!hasPrimalAppendix(b)) return null;
  const sub = primalSubclass(b)!, action = primalAction(b, c)!;
  const wis = c.abilities.wisdom.modifier, d = b.choices.druid, r = b.choices.ranger;
  return <article className="sheet-page subclass-reference" data-sheet-page><Header build={b} title="完整人物卡 · 子职能力" page="子职附页" /><p className="casting-strip">{sub.name} · 法术攻击 {signed(c.spellcasting!.attack)} · DC {c.spellcasting!.dc}</p>
    <div className="sheet-features">{sub.features.map((id) => <section key={id}><h3>{PRIMAL_FEATURES[id].name}</h3><small>{PRIMAL_FEATURES[id].timing}</small><p>{PRIMAL_FEATURES[id].text}</p></section>)}</div>
    <section><h3>本构筑操作示例 · {action.title}</h3><p>{action.how}</p><p>{action.cost}</p></section>
    {b.subclassId === "land" && <p>初始地形：{LAND_TYPES[d?.land ?? "temperate"].name}；对应自动法术见职业法术卡。</p>}
    {b.subclassId === "sea" && <p>普通荒野变形仅 CR ≤ 1/4、无飞行速度；变形获得 3 临时 HP。光环本身不提供临时 HP。</p>}
    {b.subclassId === "stars" && <><p>星图：{STAR_MAPS[(d?.starMap ?? "scroll") as keyof typeof STAR_MAPS]} · 上手偏好：{STAR_FORMS[d?.starForm ?? "archer"]}；每次激活仍可任选星座。</p><h3>三种星座 · 激活时选一种</h3><p>射手：激活时及之后每回合附赠动作，60 尺内生物，远程法术攻击 {signed(c.spellcasting!.attack)}，命中 1d8{signed(wis)} 光耀伤害。</p><p>圣杯：消耗法术位施展恢复 HP 的法术时，你或 30 尺内另一生物恢复 1d8{signed(wis)} HP。</p><p>巨龙：智力／感知检定及维持专注的体质豁免，d20 的 9 或以下视为 10；其他体质豁免照常，三级不能飞行。</p></>}
    {b.subclassId === "hunter" && <p>当前仅拥有：{HUNTERS_PREY[r?.huntersPrey ?? "colossus-slayer"]}。选择不同于额外攻击：三级攻击动作仍通常只有一次攻击。</p>}
    {b.subclassId === "fey-wanderer" && <p>额外技能：{skillNames[r?.feySkill ?? "persuasion"]}；外观：{FEY_GIFTS[(r?.feyGift ?? "butterflies") as keyof typeof FEY_GIFTS]}。没有原初行侣。</p>}
    {b.subclassId === "great-old-one" && <p>伤害显示偏好：{b.choices.warlock?.psychicDamage === "psychic" ? "心灵" : "原类型"}；每次施法仍可另选。职业卡的惑控／幻术成分已调整，起源附页保持原成分。材料有标价或需消耗时仍须实物。</p>}
    <footer className="sheet-footer">PHB 2024 · 仅列三级能力 · 资源方框见能力与资源页</footer></article>;
}
