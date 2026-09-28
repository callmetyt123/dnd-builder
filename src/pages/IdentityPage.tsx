import { BuilderShell } from "../components/builder/BuilderShell";
import type { AlignmentId } from "../rules/types";
import { alignmentNames, alignmentSummaries } from "../translations/zh-CN";
import { useBuilder } from "../store/builder";

const alignments: AlignmentId[] = ["LG", "NG", "CG", "LN", "N", "CN", "LE", "NE", "CE"];
const traits = ["勇敢", "谨慎", "好奇", "冷静", "冲动", "善良", "贪财", "傲慢", "幽默", "沉默"];

export function IdentityPage() {
  const { state, dispatch } = useBuilder();
  const identity = state.build.identity;
  const toggleTrait = (trait: string) => {
    const current = identity.personalityTraits ?? [];
    const next = current.includes(trait) ? current.filter((v) => v !== trait) : current.length >= 3 ? current : [...current, trait];
    dispatch({ type: "identity", patch: { personalityTraits: next } });
  };
  return (
    <BuilderShell previous="configuration" next="review">
      <section className="page-head"><h1>完善你的角色</h1><p>规则性的内容已经基本完成。角色是谁，由你自己决定。</p></section>
      <div className="form-stack"><label>角色姓名 *<input maxLength={60} value={identity.name} onChange={(e) => dispatch({ type: "identity", patch: { name: e.target.value } })} /></label><label>性别（可选）<input maxLength={30} value={identity.gender ?? ""} onChange={(e) => dispatch({ type: "identity", patch: { gender: e.target.value } })} /></label><label>年龄（可选）<input type="number" min="0" step="1" value={identity.age ?? ""} onChange={(e) => dispatch({ type: "identity", patch: { age: e.target.value ? Number(e.target.value) : undefined } })} /><span className="field-note">矮人寿命参考：约 350 年。年龄不是职业限制。</span></label></div>
      <section className="section"><h2>阵营 *</h2><p className="hint">直接选择最接近你角色通常行为方式的一格。</p><div className="alignment-grid">{alignments.map((id) => <button key={id} className={identity.alignment === id ? "selected" : ""} onClick={() => dispatch({ type: "identity", patch: { alignment: id } })}><strong>{alignmentNames[id]}</strong><span>{alignmentSummaries[id]}</span></button>)}</div></section>
      <section className="section"><h2>性格特点（可选，最多 3 个）</h2><div className="choice-pills">{traits.map((trait) => <button key={trait} className={(identity.personalityTraits ?? []).includes(trait) ? "selected" : ""} onClick={() => toggleTrait(trait)}>{trait}</button>)}</div></section>
      <div className="form-stack"><label>外貌描述（可选）<textarea maxLength={300} value={identity.appearance ?? ""} onChange={(e) => dispatch({ type: "identity", patch: { appearance: e.target.value } })} /></label><label>角色简介（可选）<textarea maxLength={600} value={identity.description ?? ""} onChange={(e) => dispatch({ type: "identity", patch: { description: e.target.value } })} /></label></div>
    </BuilderShell>
  );
}
