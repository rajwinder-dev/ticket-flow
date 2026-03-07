"use client";
import { useState, type ReactNode } from "react";

interface props {
  elements: { label: string; component?: ReactNode ,icon?: ReactNode }[];
  invertColor?: boolean;
  style?: "minimal"| "advance"
}
function MultiTabs({ elements, invertColor , style = "minimal"}: props) {
  const [activeTab, setActiveTab] = useState(0); // Default to first tab
  if(style === "minimal")
  return (
    <div className={invertColor ? "rounded-md bg-white p-4" : ""}>
      <div
        className={` ${
          invertColor ? "bg-blue2/10" : "bg-white"
        } mb-4 inline-block space-x-1 rounded-md p-1 text-gray-600`}
      >
        {elements.map((tab, index) =>
          invertColor ? (
            <button
              key={index}
              className={`w-52 py-2 ${
                activeTab === index
                  ? "text-blue font-medium"
                  : "bg-white hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(index)}
            >
              {tab.label}
            </button>
          ) : (
            <button
              key={index}
              className={`w-52 py-2 ${
                activeTab === index
                  ? "bg-blue/10 text-blue font-medium"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(index)}
            >
              {tab.label}
            </button>
          ),
        )}
      </div>
      <div>
        {elements[activeTab].component || `Assign component: ${activeTab}`}
      </div>
    </div>
  );
  if(style === "advance")
    return <div className="rounded-md bg-white p-4 text-gray-500">
        <div className="flex gap-2 border-b border-b-gray-300 pb-4 text-xl">
          {elements.map((tab, index) => (
            <button
              key={index}
              className={`flex items-center gap-2 px-4 py-2 ${
                activeTab === index ? "bg-blue/10 text-gray-600" : ""
              }`}
              onClick={() => setActiveTab(index)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        <div>{elements[activeTab].component}</div>
      </div>
}

export default MultiTabs;
