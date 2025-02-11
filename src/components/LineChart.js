import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { Chart } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "./Charts.css";

Chart.register(zoomPlugin); // Register the plugin

const LineChart = ({ data }) => {
  const chartRef = useRef(null);

  // Sort the data by date (converting DD/MM/YYYY to proper format for sorting)
  const sortedData = data.sort((a, b) => {
    const [dayA, monthA, yearA] = a.Day.split("/");
    const [dayB, monthB, yearB] = b.Day.split("/");
    return new Date(`${yearA}-${monthA}-${dayA}`) - new Date(`${yearB}-${monthB}-${dayB}`);
  });

  const chartData = {
    labels: sortedData.map((item) => item.Day), // Filtered dates (X-axis)
    datasets: ["A", "B", "C", "D", "E", "F"].map((feature) => ({
      label: feature,
      data: sortedData.map((item) => item[feature]), // Filtered feature data (Y-axis: Feature values)
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
      zoom: {
        pan: {
          enabled: true, // Allow panning
          mode: "y", // Move in both X and Y directions
          modifierKey: "ctrl", // Press "Ctrl" to pan
          threshold: 5, // Prevent accidental pan
        },
        zoom: {
          wheel: {
            enabled: true, // Enable zoom with scroll
            speed: 0.05, // Smooth zooming
          },
          pinch: {
            enabled: true, // Enable pinch zooming (for touchscreens)
          },
          mode: "y", // Zoom both axes
          scaleMode: "y", // Ensure zoom happens for both axes
          limits: {
            y: { min: 1, max: 3 },
          },
        },
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

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  return (
    <div className="chart-container" style={{
      width: "90%", // Full width of the parent container
      maxWidth: "700px", // Optional: Maximum width for the chart
      height: "40vh", // Set a specific height
      margin: "20px auto", // Center align the chart
      paddingBottom: "40px"
    }}>
       <button onClick={resetZoom} className="resetZoom-btn">
        Reset Zoom
      </button>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
