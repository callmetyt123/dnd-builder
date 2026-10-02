import { useRef, useState } from "react";
import { SPECIES } from "../data/species";
import { deriveCharacter } from "../rules/engine/deriveCharacter";
import { CharacterSheets, type SheetMode } from "../components/character/CharacterSheets";
import { zhCN } from "../translations/zh-CN";
import { useBuilder } from "../store/builder";
import { exportCharacter } from "../utils/exportCharacter";

// 三种产物的标签、用途说明与文件名后缀集中在一处，预览与导出共用。
const CARDS: { id: SheetMode; tab: string; file: string; status: string }[] = [
  { id: "quick", tab: "新人上手卡 · 1 页", file: "新人上手卡", status: "当前预览：仅一页新人上手卡。它只回答“轮到我时能做什么”，不含完整法术与规则文本。" },
  { id: "standard", tab: "常规人物卡 · 打印用", file: "常规人物卡", status: "当前预览：两页常规人物卡。核心数值、当前 HP 与已用资源都在上面，能力与法术只列名称，适合打印出来跑团。" },
  { id: "reference", tab: "资料速查卡 · 查阅用", file: "资料速查卡", status: "当前预览：资料速查卡。收录职业、子职、起源、法术与伙伴的完整描述，供线上或桌边查规则细节。" },
];

export function CharacterPage() {
  const { state, dispatch } = useBuilder();
  const c = deriveCharacter(state.build);
  const [mode, setMode] = useState<SheetMode>("quick");
  const [downloadFile, setDownloadFile] = useState<{ url: string; filename: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const exportRef = useRef<HTMLDivElement>(null);
  const current = CARDS.find((card) => card.id === mode)!;
  async function download(format: "pdf" | "png") {
    if (!exportRef.current || busy) return;
    setBusy(true); setDownloadFile(null); setMessage(`正在生成 ${format.toUpperCase()}…`);
    try {
      const file = await exportCharacter(exportRef.current, format, `${state.build.identity.name}-${current.file}`);
      setDownloadFile(file);
      setMessage(`${format.toUpperCase()} 已生成，点击下方链接保存。`);
    } catch { setMessage("导出失败，请重试；也可以使用「打印 / 另存为 PDF」。"); }
    finally { setBusy(false); }
  }
  return <div className="character-page">
    <header className="character-header no-print"><button className="button secondary" disabled={busy} onClick={() => dispatch({ type: "step", step: "review" })}>← 返回检查与修改</button><span>D&D 5R · 车卡完成</span></header>
    <section className="character-hero no-print"><div className="eyebrow">你的角色已准备好</div><h1>{state.build.identity.name}</h1><p>{zhCN.class[state.build.classId]} 3 级 · {zhCN.subclass[state.build.subclassId]} · {SPECIES[state.build.speciesId].name} · {zhCN.background[state.build.backgroundId]}</p><p>三张卡分工不同：先用上手卡学会怎么玩，再打印常规卡带去跑团，需要查规则时翻速查卡。</p></section>
    <section className="handoff-intro no-print" aria-label="三张卡怎么用"><div><h2>先读：新人上手卡</h2><p>一页告诉你擅长什么、轮到你时怎么做，以及几个常用选择。内容根据你的角色生成。</p></div><div><h2>随身带：常规人物卡</h2><p>两页打印件，保留当前 HP、资源与法术位的勾选位置；能力与法术只列名称，不塞满规则正文。</p></div><div><h2>要查时：资料速查卡</h2><p>收录法术、职业与子职能力、起源和伙伴的完整描述，手机上也能快速检索。</p></div></section>
    <div className="sheet-toolbar no-print"><div className="sheet-tabs" role="group" aria-label="人物卡视图">{CARDS.map((card) => <button key={card.id} aria-pressed={mode === card.id} disabled={busy} onClick={() => { setMode(card.id); setDownloadFile(null); setMessage(""); }}>{card.tab}</button>)}</div><div className="export-actions"><button className="button secondary" disabled={busy} onClick={() => download("pdf")}>导出当前卡 PDF</button><button className="button secondary" disabled={busy} onClick={() => download("png")}>导出当前卡 PNG</button><button className="button secondary" disabled={busy} onClick={() => window.print()}>打印当前卡</button></div></div>
    <p className="export-status no-print" role="status">{message || current.status}</p>
    {downloadFile && <a className="button primary download-link no-print" href={downloadFile.url} download={downloadFile.filename}>保存 {downloadFile.filename}</a>}
    <div className="sheet-preview"><CharacterSheets build={state.build} character={c} mode={mode} /></div>
    <div className="export-root" ref={exportRef} aria-hidden="true"><CharacterSheets build={state.build} character={c} mode={mode} /></div>
  </div>;
}
