import React, { useState, useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const PolarAreaChart = ({ d }) => {
  const chartRef = useRef(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (d) {
      setData(d);
    }
  }, [d]);

  useEffect(() => {
    if (!data) return;

    // Step 1: Extract keys like avgWhrkmat211-216km
    const rangeKeys = Object.keys(data).filter((key) =>
      key.startsWith("avgWhrkmat"),
    );

    // Step 2: Sort them based on the numeric start of the range
    rangeKeys.sort((a, b) => {
      const startA = parseInt(a.match(/\d+/)[0], 10);
      const startB = parseInt(b.match(/\d+/)[0], 10);
      return startA - startB;
    });

    // Step 3: Generate simple labels like "0-5km", "5-10km", ...
    const series = [];
    const labels = [];

    rangeKeys.forEach((_, index) => {
      const key = rangeKeys[index];
      const val = data[key] ?? 0;
      const label = `${index * 5}-${(index + 1) * 5}km`;
      labels.push(`${label} ${val}`);
      series.push(val);
    });

    const options = {
      series,
      chart: {
        type: "polarArea",
        foreColor: colors.palette[150],
      },
      labels,
      fill: {
        opacity: 0.9,
      },
      plotOptions: {
        polarArea: {
          dataLabels: {
            style: {
              colors: ["#FFFFFF"],
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 700,
          options: {
            chart: {
              width: "100%",
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new ApexCharts(chartRef.current, options);
    chartInstance.current.render();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, colors.palette]);

  return (
    <Box p={"0.5rem 1rem"} fontSize={"1.3rem"} fontWeight={"500"}>
      Watt-Hr/km Chart
      <div style={{ width: "100%", height: "100%" }} ref={chartRef} />
    </Box>
  );
};

export default PolarAreaChart;
