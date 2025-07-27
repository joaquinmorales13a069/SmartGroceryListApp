
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function PantrySummaryChart({ pantryItems }) {
  const [categoryCounts, setCategoryCounts] = useState({});

  useEffect(() => {
    if (!pantryItems || pantryItems.length === 0) return;

    const counts = {};
    pantryItems.forEach(item => {
      const category = item.category || "Uncategorized";
      counts[category] = (counts[category] || 0) + 1;
    });
    setCategoryCounts(counts);
  }, [pantryItems]);

  const data = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Items per Category",
        data: Object.values(categoryCounts),
        backgroundColor: Object.keys(categoryCounts).map(() =>
         `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="w-full">
      <Bar data={data} options={options} />
    </div>
  );
}
