"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";

const doughnutOptions = {
  cutout: "30%",
  maintainAspectRatio: false,
  responsive: true,
  outerHeight: 100,
  plugins: {
    legend: {
      display: true,
      position: "right" as const,
      labels: {
        boxWidth: 10,
      },
    },
  },
};
interface props {
  percentage?: number;
}
function PiChartThick({

  percentage = 65,
}: props) {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const chartRef = useRef<ChartJS<"doughnut"> | null>(null);
  const [gradient, setGradient] = useState<CanvasGradient | null>(null);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = (chart as ChartJS).ctx;
    const gradientFill = ctx.createLinearGradient(0, 0, 300, 0); // top to bottom
    gradientFill.addColorStop(0, '#305AFFCC');
    gradientFill.addColorStop(1, '#EDEAFC');
    setGradient(gradientFill);
  }, []);
  const doughnutData = {
    labels: ["Referrals sent 57%", "Converted 42%"],
    datasets: [
      {
        data: [percentage, percentage - 100],
        backgroundColor: gradient ? [gradient, '#e0e0e0'] : ['#305AFFCC', '#B5D2FF'],
        borderRadius: [10, 0],
        borderWidth: 0,

      },
    ],
  };
  return (
    <div className="flex w-full justify-start">
      <div className=" my-4 px-4  h-52 flex justify-start">
        <Doughnut ref={(instance) => { chartRef.current = instance || null; }} data={doughnutData} options={doughnutOptions} />
      </div>
    </div>
  );
}

export default PiChartThick;
