import React from "react";

interface props {
  children: React.ReactNode;
  percent: number;
  backgroundColor: "gray" | "skin" | "pink" | "sky";
}
function OverviewSmallCard({ children, percent , backgroundColor}: props) {
    const bgColor = {
    gray: "bg-gary3",
    skin: "bg-skin1",
    pink: "bg-pink1",
    sky: "bg-sky1",
  };
  return (
    <div className={`${bgColor[backgroundColor]} p-4 rounded-md text-center flex-1`}>
      <p className="text-md">{children}</p>
      <span className="font-bold text-xl">{percent}%</span>
    </div>
  );
}

export default OverviewSmallCard;
