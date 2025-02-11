// BarChart.js
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js";
import "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin); // Register the plugin

const BarChart = ({ data, onBarClick }) => {

  // Sort data by date before calculating totals
  const sortedData = data.sort((a, b) => {
    const [dayA, monthA, yearA] = a.Day.split("/");
    const [dayB, monthB, yearB] = b.Day.split("/");
    return new Date(`${yearA}-${monthA}-${dayA}`) - new Date(`${yearB}-${monthB}-${dayB}`);
  });

  const featureTotals = sortedData.reduce(
    (acc, item) => {
      ["A", "B", "C", "D", "E", "F"].forEach((feature) => {
        acc[feature] += item[feature];
      });
      return acc;
    },
    { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 }
  );

  const chartData = {
    labels: Object.keys(featureTotals),
    datasets: [
      {
        label: "Total Time Spent",
        data: Object.values(featureTotals),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
          threshold: 10, // Smooth panning
          rangeMin: { x: null },
          rangeMax: { x: null },
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
          limits: {
            x: { min: 1, max: 3 }, // 1x (zoom out limit), 2x (zoom in limit)
            y: { min: 1, max: 3 },
          },
        },
      },
    },
    onClick: (_, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const feature = chartData.labels[index];
        alert(`Clicked on feature: ${feature}`);
        onBarClick(feature); // Pass clicked feature to parent
      }
    },
  };
  

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />;
    </div>
  );
};

export default BarChart;


