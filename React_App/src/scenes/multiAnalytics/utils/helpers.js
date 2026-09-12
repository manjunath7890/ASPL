import dayjs from "dayjs";

export function exportCSV(rows) {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]).join(",");
  const body = rows
    .map((r) =>
      Object.values(r)
        .map((v) => {
            if (typeof v === "object") {
                return `"${JSON.stringify(v).replace(/"/g, '""')}"`;
            }
            return `"${v}"`;
        })
        .join(","),
    )
    .join("\n");
  const blob = new Blob([headers + "\n" + body], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `analytics_export_${dayjs().format("YYYY-MM-DD")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export const getGrade = (stats) => {
  const {
    whr,
    mtrAvg = 0,
    mtrMax = 0,
    ctrlAvg = 0,
    ctrlMax = 0,
    mosAvg = 0,
    mosMax = 0,
    faults = [],
    eco = 0,
    socMin = 100,
  } = stats;

  const hasFaults =
    faults.length > 0 &&
    faults.some((f) => f !== "None" && f !== "—" && f !== "" && f !== "0");
  let score = hasFaults ? 0 : 40;

  if (whr > 0) {
    if (whr < 80) score += 30;
    else if (whr < 100) score += 20;
    else if (whr < 120) score += 10;
  } else {
    score += 30;
  }

  let thermalScore = 20;
  if (mtrMax > 100 || mtrAvg > 70) thermalScore -= 7;
  if (ctrlMax > 55 || ctrlAvg > 40) thermalScore -= 7;
  if (mosMax > 40 || (mosAvg > 0 && mosAvg > 35)) thermalScore -= 6;
  score += Math.max(0, thermalScore);

  if (eco > 70) score += 10;
  else if (eco > 30) score += 5;

  if (socMin < 5) score -= 20;
  else if (socMin < 15) score -= 10;
  else if (socMin < 20) score -= 5;

  score = Math.max(0, Math.min(100, score));

  let grade = "F";
  if (score >= 90) grade = "A";
  else if (score >= 80) grade = "B+";
  else if (score >= 70) grade = "B";
  else if (score >= 60) grade = "C";
  else if (score >= 40) grade = "D";

  return { grade, score };
};
