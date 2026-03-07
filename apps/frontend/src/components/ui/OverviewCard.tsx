import React from "react";
import { TradeDownIcon, TradeUpIcon } from "./Icons";
import { cn } from "../../utils/cn";

interface props {
  children: React.ReactNode;
  icon: React.ReactElement;
  value: number | string;
  overview?: number;
  unit?: "%" | "$" | "";
  comparWith?: string;
  backgroundColor: "gray" | "skin" | "pink" | "sky";
  showBackground?: boolean;
}
function OverviewCard({
  children,
  icon,
  value,
  comparWith,
  unit = "",
  overview,
  backgroundColor,
  showBackground,
}: props) {
  const isIncrease = overview && overview > 0;
  const bgColor = {
    gray: "bg-gary3",
    skin: "bg-skin1",
    pink: "bg-pink1",
    sky: "bg-sky1",
  };
  const bgAccent = {
    gray: "bg-gary3/25",
    skin: "bg-skin1/25",
    pink: "bg-pink1/25",
    sky: "bg-sky1/25",
  };
  return (
    <div
      className={cn(
        `flex flex-1 items-center gap-4 rounded-md p-2 ${showBackground && bgAccent[backgroundColor]}`,
      )}
    >
      <div
        className={`${
          bgColor[backgroundColor] || ""
        } round-full flex h-14 w-14 items-center justify-center rounded-full`}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <p className="text-gary4 text-[19px] font-semibold">{children}</p>
        <span className="text-gray1 font-bold">
          {value.toLocaleString()}
          {unit}
        </span>
        {overview && (
          <p className="flex gap-4 text-xs">
            <span
              className={`flex gap-1 ${isIncrease ? "text-green3" : "text-red1"}`}
            >
              {overview}%
              <span>{isIncrease ? <TradeUpIcon /> : <TradeDownIcon />}</span>
            </span>
            {comparWith ? `vs ${comparWith}` : ""}
          </p>
        )}
      </div>
    </div>
  );
}

export default OverviewCard;
