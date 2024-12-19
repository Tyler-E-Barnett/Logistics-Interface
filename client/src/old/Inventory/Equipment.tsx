import React, { useState } from "react";
import DataFetcher from "../../Components/Common/DataFetcher";
import EquipmentCard from "./EquipmentCard"; // Import the new component

function Equipment({ assemblyId }) {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = (inventoryId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [inventoryId]: !prev[inventoryId],
    }));
  };

  return (
    <div className="flex justify-start w-full h-full">
      <div className="mt-4">
        <div className="flex flex-col gap-4 overflow-scroll">
          <DataFetcher url={`/api/inventory/equipment/assembly/${assemblyId}`}>
            {(data) =>
              Array.isArray(data) && data.length > 0 ? (
                data.map((item) => (
                  <EquipmentCard
                    key={item.id}
                    item={item}
                    toggleItem={toggleItem}
                    isExpanded={expandedItems[item.id]}
                  />
                ))
              ) : (
                <div>No Items found</div>
              )
            }
          </DataFetcher>
        </div>
      </div>
    </div>
  );
}

export default Equipment;
