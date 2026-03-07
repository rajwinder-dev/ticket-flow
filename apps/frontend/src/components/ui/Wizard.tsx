import React, { useEffect, useRef } from "react";
import { ProgressDot, TickIcon } from "./Icons";

interface props {
  heading?: string;
  description?: string;
  count: number;
  data: {
    stepName: string;
    title: string;
    description: string;
    component: React.ReactNode;
  }[];
}
function Wizard({ heading, description, data, count }: props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [count]);
  return (
    <div className="grid grid-cols-[1fr_2fr] max-w-[900px]  bg-lightWhite4 rounded-lg mx-auto ">
      <div className="bg-blue/10 p-8">
        {(heading || description) && (
          <div className="border-b border-b-gray-400 flex flex-col gap-4">
            <h2 className="text-lg text-blue2">{heading}</h2>
            <p className="text-sm pb-4">{description}</p>
          </div>
        )}
        <ul className="py-8 flex flex-col gap-8">
          {data.map((item, index) => (
            <li key={index} className="grid grid-cols-[auto_1fr] gap-x-2">
              {renderStatusIcon(index, count)}
              <p className="font-semibold">{item.stepName}</p>
              {renderStatusText(index, count)}
            </li>
          ))}
        </ul>
      </div>
      <div ref={scrollRef} className="p-4 flex flex-col gap-4  overflow-y-auto h-[calc(100vh-7.5rem)] ">
        <div className="flex flex-col gap-4">
          <div className="col-span-2 text-center">
            <h2 className="text-center text-xl font-semibold mb-2">
              {data[count - 1].title}
            </h2>
            <p>{data[count - 1].description}</p>
          </div>
          <div className="flex-1">
            {data[count - 1].component || (
              <div className="bg-blue-100 h-full">ADD YOUR COMPONENT</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Wizard;

function renderStatusIcon(index: number, count: number) {
  if (index + 1 < count)
    return (
      <div className="h-12 w-12 bg-green1 flex justify-center items-center rounded-full row-span-2">
        <TickIcon />
      </div>
    );
  if (index + 1 === count)
    return (
      <div className="h-12 w-12 border-[3px] border-blue2 flex justify-center items-center rounded-full row-span-2">
        <ProgressDot />
      </div>
    );
  return (
    <div className="h-12 w-12 border-[3px] border-gray-400 flex justify-center items-center rounded-full row-span-2"></div>
  );
}
function renderStatusText(index: number, count: number) {
  if (index + 1 < count) return <p className="text-green1">Completed</p>;
  if (index + 1 === count) return <p className="text-blue2">In Progress</p>;
  return <p className="text-gray-400">Not Started</p>;
}
