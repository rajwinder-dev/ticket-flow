"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { getTailwindColor } from "../../utils/projectUtils";

const doughnutOptions = {
  cutout: "85%",
  maintainAspectRatio: false,
  // outerHeight: 100,
  plugins: {
    legend: {
      display: false,
      position: "right" as const,
      labels: {
        boxWidth: 10,
      },
    },
  },
};
interface props {
  emptyColor: string;
  fillcolor: string;
  percentage: number;
}
function PiChart({
  emptyColor = "--color-lightWhite7",
  fillcolor = "--color-blue3",
  percentage = 38,
}: props) {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const doughnutData = {
    datasets: [
      {
        data: [percentage, percentage - 100],
        backgroundColor: [
          getTailwindColor(fillcolor),
          getTailwindColor(emptyColor),
        ],
        borderWidth: 0,
      },
    ],
  };
  return (
    <div className="relative">
      <Doughnut data={doughnutData} options={doughnutOptions} />
      <span
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-semibold`}
        style={{ color: fillcolor }}
      >
        {percentage}%
      </span>
    </div>
  );
}

export default PiChart;
