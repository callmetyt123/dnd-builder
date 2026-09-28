export async function exportCharacter(root: HTMLElement, format: "pdf" | "png", name: string): Promise<{ url: string; filename: string }> {
  const { toCanvas } = await import("html-to-image");
  await document.fonts.ready;
  const pages = [...root.querySelectorAll<HTMLElement>("[data-sheet-page]")];
  if (!pages.length) throw new Error("未找到可导出的页面");
  // 使用独立的固定宽度排版，导出不受手机视口、滚动位置或交互控件影响。
  const canvases: HTMLCanvasElement[] = [];
  for (const page of pages) {
    canvases.push(await toCanvas(page, { pixelRatio: 2, backgroundColor: "#ffffff", skipFonts: true }));
  }
  const filename = name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").slice(0, 60) || "冒险者";
  if (format === "pdf") {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });
    canvases.forEach((canvas, index) => {
      if (index) pdf.addPage();
      const scale = Math.min(190 / canvas.width, 277 / canvas.height);
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", (210 - canvas.width * scale) / 2, 10, canvas.width * scale, canvas.height * scale);
    });
    return { url: pdf.output("datauristring"), filename: `${filename}.pdf` };
  } else {
    // 多页合成一张 PNG，避免浏览器拦截连续文件下载。
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(...canvases.map((page) => page.width));
    canvas.height = canvases.reduce((sum, page) => sum + page.height, 0);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("浏览器无法生成图片");
    let top = 0;
    for (const page of canvases) { context.drawImage(page, 0, top); top += page.height; }
    // data URL 让内置浏览器也能从可见链接保存，不依赖 Blob URL 的下载支持。
    return { url: canvas.toDataURL("image/png"), filename: `${filename}.png` };
  }
}
