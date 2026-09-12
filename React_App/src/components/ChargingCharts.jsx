import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material';
import { tokens } from '../theme';

export const SocRadialBar = ({ initSoc, finalSoc }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === 'dark';

  const options = {
    chart: { type: 'radialBar', sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          strokeWidth: '97%',
          margin: 5,
        },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: -5,
            fontSize: '32px',
            fontWeight: 700,
            color: colors.palette[100],
            formatter: function (val) {
              return val + "%";
            }
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: isDark ? 'dark' : 'light',
        type: 'horizontal',
        gradientToColors: ['#00E396'],
        stops: [0, 100]
      }
    },
    stroke: { lineCap: 'round' },
    labels: ['Final SOC'],
  };

  return <Chart options={{...options, colors: ['#008FFB']}} series={[finalSoc]} type="radialBar" height={280} />;
};

export const TemperatureGauge = ({ temp, title }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === 'dark';

  const options = {
    chart: { type: 'radialBar', sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        track: {
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          strokeWidth: '97%',
        },
        dataLabels: {
          name: {
             show: true, 
             fontSize: '13px', 
             fontWeight: 600,
             color: colors.palette[700], 
             offsetY: 20 
          },
          value: {
            offsetY: -10,
            fontSize: '22px',
            fontWeight: 700,
            color: colors.palette[100],
            formatter: function (val) {
              return val + "°C";
            }
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: isDark ? 'dark' : 'light',
        type: 'horizontal',
        gradientToColors: ['#FF4560'],
        stops: [0, 100]
      }
    },
    stroke: { lineCap: 'round' },
    labels: [title],
  };

  return <Chart options={{...options, colors: ['#FEB019']}} series={[temp]} type="radialBar" height={250} />;
};

export const EnergyDonut = ({ consumedAh }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === 'dark';
  
  const assumedCapacity = 100; // max 100Ah
  const maxConsumed = parseFloat((Math.min(consumedAh, assumedCapacity)).toFixed(2));
  const remaining = parseFloat((Math.max(assumedCapacity - maxConsumed, 0)).toFixed(2));

  const options = {
    chart: { type: 'donut', background: 'transparent' },
    theme: { mode: isDark ? 'dark' : 'light' },
    labels: ['Ah Consumed', 'Remaining Capacity'],
    colors: ['#008FFB', '#00E396'],
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            name: { show: true, fontSize: '14px', color: colors.palette[700] },
            value: { show: true, fontSize: '24px', fontWeight: 700, color: colors.palette[100], formatter: (val) => `${val} Ah` },
            total: {
              show: true,
              showAlways: true,
              label: 'Total Capacity',
              fontSize: '14px',
              color: colors.palette[700],
              formatter: () => `${assumedCapacity} Ah`
            }
          }
        }
      }
    },
    stroke: { show: isDark, colors: isDark ? ['#1e293b'] : ['#ffffff'], width: 2 },
    legend: { show: false }
  };

  return <Chart options={options} series={[maxConsumed, remaining]} type="donut" height={280} />;
};
