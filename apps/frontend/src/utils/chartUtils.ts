import { getTailwindColor } from "./projectUtils";

 export function getChartColors() {
    return {
      lineColor: getTailwindColor("--color-blue2"),
      backgroundColor: getTailwindColor("--color-blue2"),
      gridColor: getTailwindColor("--color-gray7"),
      tooltipTextColor: "#fff",
      tooltipBackgroundColor: getTailwindColor("--color-gray9"),
      mainGrid: getTailwindColor("--color-lightWhite8"),
    };
  }
