import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./Charts.css";

const LineChart = ({ data }) => {
  // Sort the data by date (converting DD/MM/YYYY to proper format for sorting)
  const sortedData = data.sort((a, b) => {
    const [dayA, monthA, yearA] = a.Day.split("/");
    const [dayB, monthB, yearB] = b.Day.split("/");
    return new Date(`${yearA}-${monthA}-${dayA}`) - new Date(`${yearB}-${monthB}-${dayB}`);
  });

  const chartData = {
    labels: sortedData.map((item) => item.Day), // Filtered dates
    datasets: ["A", "B", "C", "D", "E", "F"].map((feature) => ({
      label: feature,
      data: sortedData.map((item) => item[feature]), // Filtered feature data
      borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 1)`,
      fill: false,
    })),
  };

  return (
    <div className="chart-container">
      <Line data={chartData} />
    </div>
  );
};

export default LineChart;
