import React, { useState } from "react";
import Assembly from "./Assembly";
import { LeftCarrot, DownCarrot } from "../../assets/icons";

const SubItem = ({ details }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const {
    totalAssemblies,
    unavailableAssemblies,
    availableAssemblies,
    unavailableDetails,
  } = details.availability;

  const getColor = (availableRatio) => {
    if (availableRatio >= 0.75) return "bg-green-500";
    if (availableRatio >= 0.5) return "bg-yellow-500";
    if (availableRatio >= 0.25) return "bg-orange-500";
    return "bg-red-500";
  };

  const availableRatio = availableAssemblies / totalAssemblies;
  const colorClass = getColor(availableRatio);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 p-2 mb-2 bg-white rounded shadow">
        <div className={`px-3 py-1 rounded-full text-white ${colorClass}`}>
          {details.code}
        </div>
        <div className="text-gray-700">{availableAssemblies} Available</div>
        <button onClick={toggleCollapse} className="ml-auto">
          {isCollapsed ? (
            <LeftCarrot style={"w-6 h-6"} color={"black"} />
          ) : (
            <DownCarrot style={"w-6 h-6"} color={"black"} />
          )}
        </button>
      </div>
      {!isCollapsed &&
        details.assemblies.map((assembly) => {
          const unavailable = unavailableDetails.some(
            (unavailDetail) => unavailDetail._id === assembly._id
          );
          return (
            <div className="flex p-1 ml-8" key={assembly._id}>
              <Assembly assembly={assembly} isUnavailable={unavailable} />
            </div>
          );
        })}
    </div>
  );
};

export default SubItem;
