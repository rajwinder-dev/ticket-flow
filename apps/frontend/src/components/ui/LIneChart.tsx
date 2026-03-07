import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  type Plugin,
  type TooltipItem,
} from "chart.js";
import { useEffect, useState, type ReactNode } from "react";
import { Line } from "react-chartjs-2";
import { getChartColors } from "../../utils/chartUtils";

// Register elements
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
);

// ✨ Vertical hover line plugin

interface Props {
  heading?: string;
  children?: ReactNode;
  data?: object;
}
function LineChart({ heading, children }: Props) {
  const [key, setKey] = useState(0); // Add key for remounting
  const [themeColor, setThemeColor] = useState({
    lineColor: "",
    backgroundColor: "",
    gridColor: "",
    tooltipTextColor: "",
    tooltipBackgroundColor: "",
    mainGrid: "",
  });

useEffect(() => {
  setThemeColor(getChartColors());
  const observer = new MutationObserver(() => {
    setThemeColor(getChartColors());
    setKey((prev) => prev + 1); // force re-render of chart with new colors
  });

  // Watch for class change on <html>
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return () => observer.disconnect();
}, []);


  const verticalLinePlugin: Plugin = {
    id: "hoverLine",
    afterDatasetsDraw: (chart) => {
      const tooltip = chart.tooltip;
      if (tooltip && tooltip.getActiveElements().length) {
        const ctx = chart.ctx;
        const activeElement = tooltip.getActiveElements()[0];
        const x = activeElement.element.x;
        const topY = chart.scales.y.top;
        const bottomY = chart.scales.y.bottom;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x, bottomY);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = themeColor.lineColor;
        ctx.stroke();
        ctx.restore();
      }
    },
  };
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Visitors",
        data: [12, 19, 3, 5, 9, 4, 5, 40],
        borderColor: themeColor.lineColor,
        // eslint-disable-next-line no-restricted-syntax
        backgroundColor: "rgba(48, 90, 255, 0.1)",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 7,
        pointBackgroundColor: themeColor.lineColor,
        pointHoverBackgroundColor: themeColor.lineColor,
        pointBorderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: themeColor.gridColor, font: { size: 14 } },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: themeColor.mainGrid,
          borderDash: [5, 5],
          lineWidth: 1,
          drawTicks: false,
          drawBorder: false,
        },
        ticks: { color: themeColor.gridColor, font: { size: 14 } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: themeColor.tooltipBackgroundColor,
        titleColor: themeColor.tooltipTextColor,
        bodyColor: themeColor.tooltipTextColor,
        cornerRadius: 6,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function (tooltipItem: TooltipItem<"line">) {
            const label = tooltipItem.dataset.label || "Unknown";
            return ` ${label}: ${tooltipItem.formattedValue}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-lightWhite rounded-lg p-4">
      <div className="flex items-center justify-between">
        {heading && <h2 className="text-xl font-semibold">{heading}</h2>}
        {children}
      </div>
      <div className="bg-lightWhite6 relative h-96 rounded-xl p-4 shadow-md">
        <Line
          key={key} // <-- Force re-render on screen size change
          data={data}
          options={options}
          plugins={[verticalLinePlugin]}
        />
      </div>
    </div>
  );
}

export default LineChart;
