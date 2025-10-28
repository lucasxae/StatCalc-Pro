import express from "express";
import multer from "multer";
import * as XLSX from "xlsx";
import cors from "cors";

const app = express();
const upload = multer();
const PORT = process.env.PORT || 5000;

app.use(cors());

function computeMetrics(rows) {
  return rows.map((r, idx) => {
    const tp = Number(r.tp ?? r.TP ?? 0);
    const fp = Number(r.fp ?? r.FP ?? 0);
    const tn = Number(r.tn ?? r.TN ?? 0);
    const fn = Number(r.fn ?? r.FN ?? 0);
    const id = r.id ?? r.ID ?? idx + 1;

    const sensitivity = tp + fn === 0 ? 0 : tp / (tp + fn);
    const specificity = tn + fp === 0 ? 0 : tn / (tn + fp);
    const tpr = sensitivity;
    const fpr = 1 - specificity;

    return { id, tp, fp, tn, fn, sensitivity, specificity, tpr, fpr };
  });
}

function computeAUC(fpr, tpr) {
  // Expect arrays sorted by fpr ascending
  if (fpr.length !== tpr.length || fpr.length < 2) return 0;
  let auc = 0;
  for (let i = 1; i < fpr.length; i++) {
    const x1 = fpr[i - 1];
    const x2 = fpr[i];
    const y1 = tpr[i - 1];
    const y2 = tpr[i];
    auc += (x2 - x1) * (y1 + y2) / 2;
  }
  return Math.max(0, Math.min(1, auc));
}

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const raw = XLSX.utils.sheet_to_json(sheet, { defval: null });

    if (!raw || raw.length === 0) {
      return res.status(400).json({ error: "Planilha vazia" });
    }

    // Compute metrics
    const rows = computeMetrics(raw);

    // build arrays for AUC
    const roc = rows
      .map((r) => ({ fpr: r.fpr, tpr: r.tpr }))
      .sort((a, b) => a.fpr - b.fpr);

    const fprArr = roc.map((r) => r.fpr);
    const tprArr = roc.map((r) => r.tpr);
    const auc = computeAUC(fprArr, tprArr);

    const avgSensitivity = rows.reduce((s, r) => s + r.sensitivity, 0) / rows.length;
    const avgSpecificity = rows.reduce((s, r) => s + r.specificity, 0) / rows.length;

    const studies = rows.map((r) => ({ id: r.id, tp: r.tp, fp: r.fp, tn: r.tn, fn: r.fn, sensitivity: r.sensitivity, specificity: r.specificity }));

    return res.json({ studies, summary: { avg_sensitivity: avgSensitivity, avg_specificity: avgSpecificity, auc } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
