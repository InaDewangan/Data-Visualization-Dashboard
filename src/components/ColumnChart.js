import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./Charts.css";

const ColumnChart = ({ feature, data, onClose }) => {
  // Filter data for the selected feature
  const filteredData = data.map((item) => ({
    date: item.Day,
    value: item[feature],
  }));

  // Sort data by date
  const sortedData = filteredData.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("/");
    const [dayB, monthB, yearB] = b.date.split("/");
    return new Date(`${yearA}-${monthA}-${dayA}`) - new Date(`${yearB}-${monthB}-${dayB}`);
  });

  const chartData = {
    labels: sortedData.map((item) => item.date), // Dates for X-axis
    datasets: [
      {
        label: `${feature} Time Spent`,
        data: sortedData.map((item) => item.value),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="chart-container" style={{
      width: "90%", // Full width of the parent container
      maxWidth: "700px", // Optional: Maximum width for the chart
      height: "40vh", // Set a specific height
      margin: "40px auto", // Center align the chart
      position: "relative" /* Required for dynamic resizing in Chart.js */
    }}>
      <button className="close-button" onClick={onClose}>
        Close
      </button>
      <Bar
        data={chartData}
        options={{
          maintainAspectRatio: false, // Allows the chart to resize dynamically
          responsive: true, // Ensures responsiveness
          plugins: {
            title: {
              display: true,
              text: `Time Spent on ${feature} by Date`,
            },
          },
          scales: {
            x: {
              ticks: {
                font: {
                  size: window.innerWidth < 480 ? 10 : 12, // Adjust font size for smaller screens
                },
              },
            },
            y: {
              ticks: {
                font: {
                  size: window.innerWidth < 480 ? 10 : 12, // Adjust font size for smaller screens
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default ColumnChart;
