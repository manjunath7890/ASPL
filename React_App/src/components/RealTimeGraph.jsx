import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
} from "chart.js";
import "chartjs-adapter-moment";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
  CategoryScale
);


const chartColors = {
  green: "rgb(48, 232, 170)",
  blue: "rgb(48, 164, 252)",
};

function App({ d1, d2 }) {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [series, setSeries] = React.useState({
    current: [],
    speed: [],
  });

  React.useEffect(() => {
    const now = Date.now();
    const nextPointCurrent = { x: now, y: d1 ?? 0 };
    const nextPointSpeed = { x: now, y: d2 ?? 0 };
    const maxPoints = 120;

    setSeries((prev) => ({
      current: [...prev.current, nextPointCurrent].slice(-maxPoints),
      speed: [...prev.speed, nextPointSpeed].slice(-maxPoints),
    }));
  }, [d1, d2]);

  const data = React.useMemo(() => ({
    datasets: [
      {
        label: "Current",
        borderColor: chartColors.green,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        data: series.current,
        tension: 0.4,
        pointRadius: 0,
        cubicInterpolationMode: "monotone",
        yAxisID: "y1",
      },
      {
        label: "Speed",
        foreColor: colors.palette[150],
        borderColor: chartColors.blue,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        data: series.speed,
        tension: 0.4,
        pointRadius: 0,
        cubicInterpolationMode: "monotone",
        yAxisID: "y2",
      },
    ],
  }), [series, colors]);

  const options = React.useMemo(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  scales: {
    x: {
      type: "time",
      display: true,
      time: {
        unit: "second",
        displayFormats: {
          second: "HH:mm:ss",
        },
      },
      ticks: {
        color: colors.palette[100],
        maxRotation: 0,
        minRotation: 0,
        maxTicksLimit: 30,
        autoSkip: true,
        callback: (value) =>
          new Date(value).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }),
      },
      grid: {
        color: colors.palette[800],
      },
    },
    y1: {
      beginAtZero: true,
      max: 150,
      position: "left",
      ticks: {
        color: colors.palette[150],
      },
      grid: {
        color: colors.palette[800],
      },
      title: {
        display: true,
        text: "Current",
        color: colors.palette[100],
      },
    },
    y2: {
      beginAtZero: true,
      max: 50,
      position: "right",
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        color: colors.palette[150],
      },
      title: {
        display: true,
        text: "Speed",
        color: colors.palette[100],
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        color: colors.palette[100],
      },
    },
    tooltip: {
      mode: "nearest",
      intersect: false,
    },
  },
}), [colors]);

  return (
    <div className="App" style={{ height: "24rem", margin: "0.5rem" }}>
      <Line data={data} options={options} />
    </div>
  );
}

export default App;
