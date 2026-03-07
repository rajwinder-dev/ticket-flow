import { useNavigate } from "react-router";
import { formatDate } from "../../utils/projectUtils";
import { DeleteIcon, EditIcon, OpenEye } from "./Icons";
import React from "react";
interface props {
  data: {
    title: string;
    startDate: string;
    endDate: string;
    description: string;
    id: number;
    status: "ongoing" | "pending" | "completed";
    department: string;
    assignedTo: number | string;
    lastUpdated: string;
  };
  children: React.ReactNode;
}
function Card({ data, children }: props) {
  const navigate =  useNavigate();
  let statusStyle;
  if (data.status === "ongoing") statusStyle = "bg-blue2/10 text-blue";
  if (data.status === "pending")
    statusStyle = "bg-yellow-400/10 text-yellow-400";
  if (data.status === "completed")
    statusStyle = "bg-green-400/10 text-green-400";
  return (
    <div className="bg-lightWhite6 grid min-h-[442px] grid-cols-3 gap-4 p-4">
      <div className="col-span-2 flex flex-col gap-1">
        <p className="text-gray-400">{data.department}</p>
        <div>
          <h3 className="text-[1rem] font-semibold">{data.title}</h3>
          <p className="text-gary7 text-red1">
            From: {data.startDate.split("T")[0]} To: {data.endDate.split("T")[0]}
          </p>
        </div>
      </div>
      <div className="text-end">
        <p
          className={`${statusStyle} inline-block rounded-md p-2 capitalize`}
        >
          {data.status}
        </p>
      </div>
      <div className="col-span-3 h-[1px] w-full bg-gray-300"></div>
      {children}
      <div className="from-gradient1 to-gradient2 shadow-sm2 col-span-3 flex items-start gap-3 rounded-md border border-gray-200 bg-gradient-to-r px-4 py-2 text-sm text-gray-800">
        <img src="/DotIcon.png" width={30} height={30} alt="ai icon" />
        <p className="text-gray8">{data.description}</p>
      </div>
      <div className="col-span-3 text-sm">
        <p className="text-gray-400">Assigned To: {data.assignedTo}</p>
        <p >
          Last Update:
          {String(formatDate(data.lastUpdated, "yyyy-MM-dd hh:mm a"))}
        </p>
      </div>
      <div className="col-span-3 flex justify-between">
        <DeleteIcon />
        <div className="flex items-center gap-4">
          <EditIcon  />
          <a onClick={() => navigate(`/goals/${data.id}`)}>
            <OpenEye />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Card;
interface cardStatusProps {
  title: string;
  value: number;
  unit?: "%" | "";
}
function CardState({ title, value, unit }: cardStatusProps) {
  return (
    <div className="flex flex-col gap-1 text-center">
      <span className="text-gray-500">{title}</span>
      <span className="text-md font-bold">
        {value}
        {unit}
      </span>
    </div>
  );
}

Card.States = CardState;
