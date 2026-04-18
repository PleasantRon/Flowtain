function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function escapePdfText(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export async function copySummaryText(text) {
  if (!navigator?.clipboard) return false;
  await navigator.clipboard.writeText(text);
  return true;
}

export function downloadSummaryCsv(summary, filename = "work-summary.csv") {
  const rows = [
    ["Range", summary.rangeLabel],
    ["Total Time", summary.totalLabel],
    ...(summary.earnings > 0 ? [["Estimated Earnings", summary.earnings.toFixed(2)]] : []),
    [],
    ["Task", "Time (minutes)"],
    ...summary.breakdown.map((item) => [item.task, item.minutes]),
  ];

  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  triggerDownload(new Blob([csv], { type: "text/csv;charset=utf-8" }), filename);
}

export function downloadSummaryPdf(text, filename = "work-summary.pdf") {
  const lines = text.split("\n");
  const commands = [];
  let y = 760;

  for (const line of lines) {
    commands.push(`BT /F1 12 Tf 50 ${y} Td (${escapePdfText(line)}) Tj ET`);
    y -= 18;
  }

  const stream = commands.join("\n");
  const streamLength = stream.length;

  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj",
    `4 0 obj << /Length ${streamLength} >> stream\n${stream}\nendstream endobj`,
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  for (const object of objects) {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  triggerDownload(new Blob([pdf], { type: "application/pdf" }), filename);
}
