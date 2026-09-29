import { useBuilder } from "../store/builder";
import { LAND_TYPES, STAR_FORMS, STAR_MAPS, HUNTERS_PREY, FEY_GIFTS, FEY_SKILLS } from "../data/primalSubclasses";
import { skillNames } from "../translations/zh-CN";
import type { DruidChoices, RangerChoices, SkillId } from "../rules/types";

// 这里只配置开卡偏好；星座、地形与猎杀技艺的桌面更换时机保留在完整卡。
export function PrimalSubclassChoices() {
  const { state, dispatch } = useBuilder(), b = state.build;
  const d = b.choices.druid, r = b.choices.ranger;
  const ranger = (patch: Partial<RangerChoices>) => dispatch({ type: "ranger", patch });
  if (b.subclassId === "land") return <section className="section"><h2>大地结社 · 地形魔法</h2><label>起始地形<select value={d?.land ?? "temperate"} onChange={(e) => dispatch({ type: "primal-druid", patch: { land: e.target.value as DruidChoices["land"] } })}>{Object.entries(LAND_TYPES).map(([id, t]) => <option key={id} value={id}>{t.name}{id === "temperate" ? " · 推荐，控制与脱身" : ""}</option>)}</select></label><p>每次长休可重选地形。更换后自动更新结社法术；如与自选名额重叠，保留其他选项并补齐空出的名额。</p></section>;
  if (b.subclassId === "stars") return <section className="section"><h2>星辰结社 · 星图与入门星座</h2><div className="form-grid"><label>星图外观<select value={d?.starMap ?? "scroll"} onChange={(e) => dispatch({ type: "druid", patch: { starMap: e.target.value } })}>{Object.entries(STAR_MAPS).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label><label>上手卡优先介绍<select value={d?.starForm ?? "archer"} onChange={(e) => dispatch({ type: "druid", patch: { starForm: e.target.value as DruidChoices["starForm"] } })}>{Object.entries(STAR_FORMS).map(([id, name]) => <option key={id} value={id}>{name}{id === "archer" ? " · 推荐，光箭攻击" : id === "chalice" ? " · 治疗" : " · 专注与检定"}</option>)}</select></label></div><p>此偏好只决定上手卡举例；每次激活星耀形态仍可选任意星座。星耀形态保留原形数值，不获得野兽变形的临时 HP，也没有三级飞行。</p></section>;
  if (b.subclassId === "hunter") return <section className="section"><h2>猎杀技艺</h2><label>起始猎杀技艺<select value={r?.huntersPrey ?? "colossus-slayer"} onChange={(e) => ranger({ huntersPrey: e.target.value as RangerChoices["huntersPrey"] })}>{Object.entries(HUNTERS_PREY).map(([id, name]) => <option key={id} value={id}>{name}{id === "colossus-slayer" ? " · 推荐，受伤目标加伤" : " · 攻击相邻另一目标"}</option>)}</select></label><p>只获得当前所选能力，短休或长休可更换。条件加伤不会直接加入每次武器伤害。</p></section>;
  if (b.subclassId === "fey-wanderer") return <section className="section"><h2>妖冶娴都与精野之赐</h2><div className="form-grid"><label>额外魅力技能<select value={r?.feySkill ?? "persuasion"} onChange={(e) => ranger({ feySkill: e.target.value as SkillId })}>{FEY_SKILLS.map((id) => <option key={id} value={id}>{skillNames[id]}</option>)}</select></label><label>精野之赐外观<select value={r?.feyGift ?? "butterflies"} onChange={(e) => ranger({ feyGift: e.target.value })}>{Object.entries(FEY_GIFTS).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label></div><p>所有魅力检定加感知调整值（至少 +1），技能数值已计入；不增加魅力豁免。外观不附带其他能力。</p></section>;
  if (b.subclassId === "great-old-one") return <section className="section"><h2>心灵法术</h2><label>人物卡伤害显示偏好<select value={b.choices.warlock?.psychicDamage ?? "original"} onChange={(e) => dispatch({ type: "warlock", patch: { psychicDamage: e.target.value as "original" | "psychic" } })}><option value="original">原伤害类型 · 推荐按抗性决定</option><option value="psychic">心灵伤害</option></select></label><p>每次施展魔契师法术仍可自由决定。惑控与幻术的职业法术卡显示免言语、免姿势后的成分；起源法术保持原成分。</p></section>;
  return null;
}
