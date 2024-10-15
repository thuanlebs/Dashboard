import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  blue: 'rgb(54, 162, 235)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  purple: 'rgb(153, 102, 255)',
  orange: 'rgb(255, 159, 64)',
  pink: 'rgb(255, 182, 193)',
  brown: 'rgb(165, 42, 42)',
  cyan: 'rgb(0, 255, 255)',
  magenta: 'rgb(255, 0, 255)',
  lime: 'rgb(0, 255, 0)',
  navy: 'rgb(0, 0, 128)',
  teal: 'rgb(0, 128, 128)',
  olive: 'rgb(128, 128, 0)',
  maroon: 'rgb(128, 0, 0)',
  silver: 'rgb(192, 192, 192)',
  gold: 'rgb(255, 215, 0)',
  coral: 'rgb(255, 127, 80)',
  lavender: 'rgb(230, 230, 250)',
  indigo: 'rgb(75, 0, 130)'
};

const transparentize = (color, opacity) => {
  const alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
};

const ChartComponent = () => {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const [barChartInstance, setBarChartInstance] = useState(null);
  const [pieChartInstance, setPieChartInstance] = useState(null);
  const [lineChartInstance, setLineChartInstance] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4001/cubejs-api/v1/load', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "query": {
              "limit": 5000,
              "filters": [
                {
                  "member": "trips.passenger_count",
                  "operator": "set"
                }
              ],
              "dimensions": [
                "trips.tolls_amount",
                "trips.tip_amount",
                "trips.pickup_ntaname"
              ]
            }
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const labels = result.data.map((item) => item['trips.pickup_ntaname']);
        const tollsDataPoints = result.data.map((item) => item['trips.tolls_amount']);
        const tipsDataPoints = result.data.map((item) => item['trips.tip_amount']);

        const barCtx = barChartRef.current.getContext('2d');
        const pieCtx = pieChartRef.current.getContext('2d');
        const lineCtx = lineChartRef.current.getContext('2d');

        const data = {
          labels: labels,
          datasets: [
            {
              label: 'Tolls Amount',
              data: tollsDataPoints,
              borderColor: CHART_COLORS.blue,
              backgroundColor: transparentize(CHART_COLORS.blue, 0.5)
            },
            {
              label: 'Tip Amount',
              data: tipsDataPoints,
              borderColor: CHART_COLORS.red,
              backgroundColor: transparentize(CHART_COLORS.red, 0.5)
            }
          ]
        };

        const barChartConfig = {
          type: 'bar',
          data: data,
          options: {
            plugins: {
              legend: false
            },
            elements: {
              bar: {
                borderWidth: 2
              }
            }
          }
        };

        const newBarChartInstance = new Chart(barCtx, barChartConfig);
        setBarChartInstance(newBarChartInstance);

        const pieData = {
          labels: labels,
          datasets: [
            {
              label: 'Tolls Amount',
              data: tollsDataPoints,
              backgroundColor: Object.values(CHART_COLORS),
              borderColor: Object.values(CHART_COLORS),
              borderWidth: 1
            }
          ]
        };

        const pieChartConfig = {
          type: 'pie',
          data: pieData,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top'
              },
              title: {
                display: true,
                text: 'Tolls Amount Distribution'
              }
            }
          }
        };

        const newPieChartInstance = new Chart(pieCtx, pieChartConfig);
        setPieChartInstance(newPieChartInstance);

        const lineData = {
          labels: labels,
          datasets: [
            {
              label: 'Tip Amount',
              data: tipsDataPoints,
              borderColor: CHART_COLORS.green,
              backgroundColor: transparentize(CHART_COLORS.green, 0.5),
              fill: false
            }
          ]
        };

        const lineChartConfig = {
          type: 'line',
          data: lineData,
          options: {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
              legend: {
                position: 'top'
              },
              title: {
                display: true,
                text: 'Tip Amount Over Time'
              }
            }
          }
        };

        const newLineChartInstance = new Chart(lineCtx, lineChartConfig);
        setLineChartInstance(newLineChartInstance);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {
      if (barChartInstance) {
        barChartInstance.destroy();
      }
      if (pieChartInstance) {
        pieChartInstance.destroy();
      }
      if (lineChartInstance) {
        lineChartInstance.destroy();
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        <div style={{ width: '50%', margin: '10px' }}>
          <canvas ref={barChartRef} width="300" height="300" />
        </div>
        <div style={{ width: '50%', margin: '10px' }}>
          <canvas ref={pieChartRef} width="300" height="300" />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        <div style={{ width: '100%', margin: '10px' }}>
          <canvas ref={lineChartRef} width="300" height="1000" />
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;