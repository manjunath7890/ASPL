import dayjs from "dayjs";

export const SOC_LABELS = [
  "0-10%",
  "10-20%",
  "20-30%",
  "30-40%",
  "40-50%",
  "50-60%",
  "60-70%",
  "70-80%",
  "80-90%",
  "90-100%",
];

export const MODE_LABELS = { 1: "Park", 2: "ECO", 3: "Drive", 4: "Reverse" };
export const MODE_COLORS_IDX = [1400, 500, 1300, 1100];

export const QUICK_FILTERS = [
  { label: "Today", fn: () => [dayjs(), dayjs()] },
  { label: "Last 7d", fn: () => [dayjs().subtract(7, "day"), dayjs()] },
  { label: "Last 30d", fn: () => [dayjs().subtract(30, "day"), dayjs()] },
  { label: "Custom", fn: null },
];

export const gradeColorMap = {
  A: "#2ECC71",
  "B+": "#27AE60",
  B: "#F1C40F",
  C: "#E67E22",
  D: "#D35400",
  F: "#E74C3C",
};

export const xCat = (cats, fg) => ({
  categories: cats,
  labels: { style: { colors: fg, fontSize: "10px" } },
});

export const xSoc = (fg) => ({
  categories: SOC_LABELS,
  labels: { style: { colors: fg, fontSize: "9px" }, rotate: -35 },
});

export const yAx = (label, fg) => ({
  title: { text: label, style: { color: fg, fontWeight: "400" } },
  labels: { style: { colors: fg } },
});

export const getBaseChartOptions = (fg, themeFontStr) => ({
  toolbar: { show: false },
  foreColor: fg,
  background: "transparent",
  fontFamily: themeFontStr,
});
