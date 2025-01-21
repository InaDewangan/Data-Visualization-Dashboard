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

  const options = {
    responsive: true, // Ensure the chart adjusts based on screen size
    maintainAspectRatio: false, // Disable fixed aspect ratio to make it truly responsive
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Values",
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{
      width: "90%", // Full width of the parent container
      maxWidth: "700px", // Optional: Maximum width for the chart
      height: "40vh", // Set a specific height
      margin: "20px auto", // Center align the chart
    }}>
      <Line data={chartData} options={options}/>
    </div>
  );
};

export default LineChart;
