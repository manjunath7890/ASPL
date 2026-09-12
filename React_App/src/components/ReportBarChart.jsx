import React, { useState, useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import "../scenes/bar/index.css"

const BarChart = ({ d, role }) => {
  const chartRef = useRef(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const getDataValue = (value) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value[0] : 0;
    }
    return isNaN(value) ? 0 : value;
  };

  const defaultData = {
    avgCurrentat10SOC: 0,
    avgCurrentat20SOC: 0,
    avgCurrentat30SOC: 0,
    avgCurrentat40SOC: 0,
    avgCurrentat50SOC: 0,
    avgCurrentat60SOC: 0,
    avgCurrentat70SOC: 0,
    avgCurrentat80SOC: 0,
    avgCurrentat90SOC: 0,
    avgCurrentat100SOC: 0,
    avgSpeedat10SOC: 0,
    avgSpeedat20SOC: 0,
    avgSpeedat30SOC: 0,
    avgSpeedat40SOC: 0,
    avgSpeedat50SOC: 0,
    avgSpeedat60SOC: 0,
    avgSpeedat70SOC: 0,
    avgSpeedat80SOC: 0,
    avgSpeedat90SOC: 0,
    avgSpeedat100SOC: 0,
    tripAt10Soc: 0,
    tripAt20Soc: 0,
    tripAt30Soc: 0,
    tripAt40Soc: 0,
    tripAt50Soc: 0,
    tripAt60Soc: 0,
    tripAt70Soc: 0,
    tripAt80Soc: 0,
    tripAt90Soc: 0,
    tripAt100Soc: 0,
    avgControllerTemperatureat10SOC: 0,
    avgControllerTemperatureat20SOC: 0,
    avgControllerTemperatureat30SOC: 0,
    avgControllerTemperatureat40SOC: 0,
    avgControllerTemperatureat50SOC: 0,
    avgControllerTemperatureat60SOC: 0,
    avgControllerTemperatureat70SOC: 0,
    avgControllerTemperatureat80SOC: 0,
    avgControllerTemperatureat90SOC: 0,
    avgControllerTemperatureat100SOC: 0,
    avgMotorTemperatureat10SOC: 0,
    avgMotorTemperatureat20SOC: 0,
    avgMotorTemperatureat30SOC: 0,
    avgMotorTemperatureat40SOC: 0,
    avgMotorTemperatureat50SOC: 0,
    avgMotorTemperatureat60SOC: 0,
    avgMotorTemperatureat70SOC: 0,
    avgMotorTemperatureat80SOC: 0,
    avgMotorTemperatureat90SOC: 0,
    avgMotorTemperatureat100SOC: 0,
  };

  const [data, setData] = useState(defaultData);

  useEffect(() => {
    if (d) {
      setData(d);
    }
  }, [d]);

  useEffect(() => {
    const createSeriesData = (name, dataFields) => ({
      name,
      data: dataFields.map(getDataValue),
    });

    const series = [
      ...(role !== 'customer' ? [createSeriesData("average current", [
        data.avgCurrentat10SOC,
        data.avgCurrentat20SOC,
        data.avgCurrentat30SOC,
        data.avgCurrentat40SOC,
        data.avgCurrentat50SOC,
        data.avgCurrentat60SOC,
        data.avgCurrentat70SOC,
        data.avgCurrentat80SOC,
        data.avgCurrentat90SOC,
        data.avgCurrentat100SOC,
      ])] : []),
      createSeriesData("average speed", [
        data.avgSpeedat10SOC,
        data.avgSpeedat20SOC,
        data.avgSpeedat30SOC,
        data.avgSpeedat40SOC,
        data.avgSpeedat50SOC,
        data.avgSpeedat60SOC,
        data.avgSpeedat70SOC,
        data.avgSpeedat80SOC,
        data.avgSpeedat90SOC,
        data.avgSpeedat100SOC,
      ]),
      createSeriesData("distance traveled", [
        data.tripAt10Soc,
        data.tripAt20Soc,
        data.tripAt30Soc,
        data.tripAt40Soc,
        data.tripAt50Soc,
        data.tripAt60Soc,
        data.tripAt70Soc,
        data.tripAt80Soc,
        data.tripAt90Soc,
        data.tripAt100Soc,
      ]),
      createSeriesData("controller temperature", [
        data.avgControllerTemperatureat10SOC,
        data.avgControllerTemperatureat20SOC,
        data.avgControllerTemperatureat30SOC,
        data.avgControllerTemperatureat40SOC,
        data.avgControllerTemperatureat50SOC,
        data.avgControllerTemperatureat60SOC,
        data.avgControllerTemperatureat70SOC,
        data.avgControllerTemperatureat80SOC,
        data.avgControllerTemperatureat90SOC,
        data.avgControllerTemperatureat100SOC,
      ]),
      createSeriesData("motor temperature", [
        data.avgMotorTemperatureat10SOC,
        data.avgMotorTemperatureat20SOC,
        data.avgMotorTemperatureat30SOC,
        data.avgMotorTemperatureat40SOC,
        data.avgMotorTemperatureat50SOC,
        data.avgMotorTemperatureat60SOC,
        data.avgMotorTemperatureat70SOC,
        data.avgMotorTemperatureat80SOC,
        data.avgMotorTemperatureat90SOC,
        data.avgMotorTemperatureat100SOC,
      ]),
    ];

    const options = {
      series,
      chart: {
        type: "bar",
        height: "90%",
        foreColor: colors.palette[150],
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "10%",
          "20%",
          "30%",
          "40%",
          "50%",
          "60%",
          "70%",
          "80%",
          "90%",
          "100%",
        ],
        labels: {
          style: {
            colors: colors.palette[100],
          },
        },
      },
      yaxis: {
        // title: {
        //   text: "values",
        //   style: {
        //     color: colors.palette[1100],
        //   },
        // },
        labels: {
          style: {
            colors: colors.palette[100],
          },
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [data, colors.palette, role]);

  return <div ref={chartRef} />;
};

export default BarChart;
