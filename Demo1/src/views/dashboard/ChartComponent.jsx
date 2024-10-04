import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

// Các hàm tiện ích
const months = (config) => {
  const cfg = config || {};
  const count = cfg.count || 12;
  const section = cfg.section;
  const values = [];

  for (let i = 0; i < count; ++i) {
    values.push(new Date(0, i, 1).toLocaleString('en-US', { month: 'short' }));
  }

  return values;
};

const numbers = (config) => {
  const cfg = config || {};
  const min = cfg.min || 0;
  const max = cfg.max || 100;
  const from = cfg.from || [];
  const count = cfg.count || 8;
  const decimals = cfg.decimals || 8;
  const continuity = cfg.continuity || 1;
  const dfactor = Math.pow(10, decimals) || 0;
  const data = [];
  let i, value;

  for (i = 0; i < count; ++i) {
    value = (from[i] || 0) + min + Math.random() * (max - min);
    if (Math.random() <= continuity) {
      data.push(Math.round(dfactor * value) / dfactor);
    } else {
      data.push(null);
    }
  }

  return data;
};

const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  blue: 'rgb(54, 162, 235)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  purple: 'rgb(153, 102, 255)',
  orange: 'rgb(255, 159, 64)',
};

const transparentize = (color, opacity) => {
  const alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
};

const ChartComponent = () => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const DATA_COUNT = 7;
    const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };

    const labels = months({ count: 7 });
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: numbers(NUMBER_CFG),
          borderColor: CHART_COLORS.red,
          backgroundColor: transparentize(CHART_COLORS.red, 0.5),
        },
        {
          label: 'Dataset 2',
          data: numbers(NUMBER_CFG),
          borderColor: CHART_COLORS.blue,
          backgroundColor: transparentize(CHART_COLORS.blue, 0.5),
        }
      ]
    };

    const newChartInstance = new Chart(ctx, {
      type: 'line', // hoặc 'bar', 'pie', v.v.
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Line Chart'
          }
        }
      },
    });

    setChartInstance(newChartInstance);

    return () => {
      newChartInstance.destroy();
    };
  }, []);

  const addData = () => {
    if (chartInstance) {
      const newLabel = `Label ${chartInstance.data.labels.length + 1}`;
      chartInstance.data.labels.push(newLabel);
      chartInstance.data.datasets.forEach((dataset) => {
        dataset.data.push(Math.floor(Math.random() * 100));
      });
      chartInstance.update();
    }
  };

  return (
    <div>
      <canvas ref={chartRef} />
      <button onClick={addData}>Add Data</button>
    </div>
  );
};

export default ChartComponent;