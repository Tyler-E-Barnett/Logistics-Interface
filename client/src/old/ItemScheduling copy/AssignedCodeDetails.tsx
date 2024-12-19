import { useState } from "react";
import AssignedSubItem from "./AssignedSubItem";
import { DownCarrot, LeftCarrot, XIcon } from "../../assets/icons";

const AssignedCodeDetails = ({
  assigned,
  removeAssignedCode,
  updateAssignedCode,
  priceLevels,
}) => {
  const data = assigned.details;
  const [expanded, setExpanded] = useState(false);
  const [editQuantity, setEditQuantity] = useState(assigned.quantity);
  const [editPricing, setEditPricing] = useState(assigned.pricing);
  const [editUnitPrice, setEditUnitPrice] = useState(
    priceLevels.find((level) => level.levelName === assigned.pricing)
      ?.unitPriceCents / 100 || 0
  );
  const [editDescription, setEditDescription] = useState(
    data.contractDescription
  );

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handlePricingChange = (e) => {
    const selectedLevel = priceLevels.find(
      (level) => level.levelName === e.target.value
    );
    setEditPricing(e.target.value);
    setEditUnitPrice(selectedLevel.unitPriceCents / 100);
    handleUpdate();
  };

  const handleUpdate = () => {
    const updatedAssigned = {
      ...assigned,
      quantity: editQuantity,
      pricing: editPricing,
      unitPrice: editUnitPrice * 100,
      details: {
        ...assigned.details,
        contractDescription: editDescription,
      },
    };
    updateAssignedCode(updatedAssigned);
  };

  return (
    <div className="flex flex-col p-2 rounded bg-gray-50">
      <div className="w-24 font-semibold">{data.code}</div>
      <div className="flex items-center justify-between w-full p-2 bg-gray-200 rounded">
        <div className="flex items-center w-full gap-2">
          <div className="text-sm">
            Quantity:{" "}
            <input
              type="number"
              value={editQuantity}
              onChange={(e) => setEditQuantity(e.target.value)}
              onBlur={handleUpdate}
              className="w-16 p-1 text-sm bg-gray-100 border rounded"
            />
          </div>
          <div className="text-sm">
            Pricing Level:{" "}
            <select
              value={editPricing}
              onChange={handlePricingChange}
              className="p-1 text-sm bg-gray-100 border rounded"
            >
              {priceLevels.map((level) => (
                <option key={level._id} value={level.levelName}>
                  {level.levelName}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm">
            Price: $
            <input
              type="number"
              value={editUnitPrice.toFixed(2)}
              onChange={(e) => setEditUnitPrice(parseFloat(e.target.value))}
              onBlur={handleUpdate}
              className="w-20 p-1 text-sm bg-gray-100 border rounded"
            />
          </div>
          <div className="text-sm">
            Description:{" "}
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onBlur={handleUpdate}
              className="p-1 text-sm bg-gray-100 border rounded"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleExpand} className="p-2 rounded">
            {expanded ? (
              <DownCarrot style={"w-5 h-5"} color={"black"} />
            ) : (
              <LeftCarrot style={"w-5 h-5"} color={"black"} />
            )}
          </button>
          <button
            onClick={() => removeAssignedCode(assigned.details._id)}
            className="p-2 ml-2 text-red-500 rounded hover:text-red-600"
          >
            <XIcon color={"#FF0000"} style={"w-5 h-5"} />
          </button>
        </div>
      </div>
      {expanded && data && (
        <div className="flex flex-col gap-2 mt-4 ml-6">
          {data.subItems.map((item, index) => (
            <AssignedSubItem key={item._id} details={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedCodeDetails;
