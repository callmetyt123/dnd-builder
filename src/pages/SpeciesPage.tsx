import { BuilderShell } from "../components/builder/BuilderShell";
import { Card } from "../components/common/Card";
import { STANDARD_LANGUAGE_IDS } from "../data/core";
import { zhCN } from "../translations/zh-CN";
import { useBuilder } from "../store/builder";

export function SpeciesPage() {
  const { state, dispatch } = useBuilder();
  const setLanguage = (index: number, value: string) => {
    const langs = [...state.build.choices.languages];
    langs[index] = value;
    dispatch({ type: "languages", languages: langs });
  };
  const options = STANDARD_LANGUAGE_IDS.filter((id) => id !== "common");
  return (
    <BuilderShell previous="class" next="background">
      <section className="page-head"><h1>选择种族</h1><p>5R 的属性提升来自背景，因此这里优先选择你喜欢的形象和能力。</p></section>
      <Card selected><h3>矮人</h3><p>坚韧、拥有黑暗视觉，并对毒素具有更强抗性。</p><div className="facts"><span>速度 30 尺</span><span>黑暗视觉 120 尺</span><span>寿命参考：约 350 年</span></div></Card>
      <section className="section"><h2>语言</h2><p className="hint">通用语自动获得；另外选择两种不同的标准语言。</p><div className="form-grid"><label>额外语言 1<select value={state.build.choices.languages[0]} onChange={(e) => setLanguage(0, e.target.value)}>{options.map((id) => <option key={id} value={id}>{zhCN.language[id as keyof typeof zhCN.language]}</option>)}</select></label><label>额外语言 2<select value={state.build.choices.languages[1]} onChange={(e) => setLanguage(1, e.target.value)}>{options.map((id) => <option key={id} value={id}>{zhCN.language[id as keyof typeof zhCN.language]}</option>)}</select></label></div></section>
    </BuilderShell>
  );
}
