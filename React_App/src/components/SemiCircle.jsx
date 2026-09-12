import React, { useRef, useEffect } from "react";
import Chart from "react-apexcharts";

const SemiCircleRadialGauge = ({
  val = 0,
  value = 0,
  colorBlue,
  colorGrey,
  colorGreen,
  maxValue = 45,
  endAngle = 110,
  startAngle = -110,
  height = 180,
  heading = 'Speed',
  customFontFamily = "'Kanit', sans-serif", 

}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = chartRef.current.chart;
    if (chart && value <= maxValue) {
      chart.updateOptions({
        series: [value],
        labels: [heading],
      });
    }
  }, [value, maxValue, heading]);

  const chartOptions = {
    chart: {
      height: height,
      type: "radialBar",
      offsetY: -10,
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: false,
        top: 0,
        left: 0,
        blur: 7,
        opacity: 0.45,
        color: "#00d8dd", 
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: startAngle,
        endAngle: endAngle,
        hollow: {
          margin: 0,
          size: "64%",
          background: "transparent",
          image: undefined,
        },
        
        track: {
          background: colorBlue,
          strokeWidth: "100%",
          margin: 0,
        },
        dataLabels: {
          show: true,
          name: {
            show: true,
            offsetY: 50,
            color: colorGrey,
            fontSize: "1rem",
            fontFamily: customFontFamily, // Apply the custom font family
            fontWeight: 400

          },
          value: {
            formatter: function () {
              return parseInt(val * 10).toFixed(0);
            },
            show: true,
            color: colorGrey,
            fontSize: "3.5rem",
            fontFamily: customFontFamily, // Apply the custom font family
            offsetY: -10,
            fontWeight: 400
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: [colorGreen],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
      dashArray: 4,
    },
    labels: [heading],
    series: [value],
    colors: [colorGreen],
    title: {
      text: undefined,
    },
    tooltip: {
      enabled: false,
    },
  };

  return (
    <div>
      <Chart
        options={chartOptions}
        series={chartOptions.series}
        type={chartOptions.chart.type}
        height={chartOptions.chart.height}
        width={"100%"}
        ref={chartRef}
      />
    </div>
  );
};

export default SemiCircleRadialGauge;
