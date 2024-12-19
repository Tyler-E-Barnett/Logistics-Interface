import React from "react";

const EquipmentCard = ({ item, toggleItem, isExpanded }) => {
  const itemStyle = "text-onSurface text-xs";
  return (
    <div className="flex flex-col items-start justify-start">
      <div className="flex items-center">
        <button
          onClick={() => toggleItem(item.id)}
          className={`${
            item.status === "Active"
              ? "bg-gray-100 text-onSecondary"
              : "bg-error text-white"
          } rounded text-onSurface p-1 text-xs hover:scale-105 hover:brightness-90 focus:outline-none transition duration-300 ease-in-out max-w-full`}
        >
          {item.model}
        </button>
      </div>
      <div
        className={`transition-all flex duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-96 opacity-100 p-2" : "h-0 opacity-0 p-0"
        }`}
      >
        {isExpanded && (
          <div className="flex flex-col items-start w-full rounded">
            <div className={itemStyle}>
              Status:{" "}
              <span className={item.status !== "Active" && "text-error"}>
                {item.status}
              </span>
            </div>
            <div className={itemStyle}>Manufacturer: {item.manufacturer}</div>
            <div className={itemStyle}>Description: {item.description}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentCard;
