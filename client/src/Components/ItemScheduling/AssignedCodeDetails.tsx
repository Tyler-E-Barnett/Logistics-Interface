import React, { useState, useEffect, useContext } from "react";
import AssignedSubItem from "./AssignedSubItem";
import { DownCarrot, LeftCarrot, XIcon } from "../../assets/icons";
import { JobContext } from "../../context/JobContext";
import axios from "axios";

const AssignedCodeDetails = ({
  assigned,
  removeAssignedCode,
  updateAssignedCode,
  priceLevels,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [pricingExpanded, setPricingExpanded] = useState(false); // New state for pricing menu
  const [editQuantity, setEditQuantity] = useState(assigned.quantity);
  const [pricing, setPricing] = useState(assigned.pricing);
  const [editDescription, setEditDescription] = useState(
    assigned.details.contractDescription
  );
  const [details, setDetails] = useState(assigned.details);
  const [itemId, setItemId] = useState(assigned.details._id);
  const { job, update, jobStart, jobEnd, jobId } = useContext(JobContext)!;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const adjustedStart = new Date(jobStart);
        adjustedStart.setDate(adjustedStart.getDate() - 1);
        const adjustedEnd = new Date(jobEnd);
        adjustedEnd.setDate(adjustedEnd.getDate() + 1);

        const data = {
          id: itemId,
          start: adjustedStart.toISOString(),
          end: adjustedEnd.toISOString(),
          jobStart: jobStart,
          jobEnd: jobEnd,
          contextType: "jobAssembly",
          contextKey: job.id,
        };

        console.log(data);

        const result = await axios.post("/api/jobData/itemDetails", data);
        console.log(result.data);
        setDetails(result.data);
      } catch (error) {
        console.log("Error fetching availability", error);
      }
    };

    if (itemId) {
      fetchDetails();
    }
  }, [assigned, update, itemId, jobStart, jobEnd, jobId]);

  useEffect(() => {
    setEditQuantity(assigned.quantity);
    setPricing(assigned.pricing);
    setEditDescription(assigned.details.contractDescription);
  }, [assigned]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const togglePricingExpand = () => {
    setPricingExpanded(!pricingExpanded); // Toggle pricing menu
  };

  const handleUpdate = () => {
    const updatedAssigned = {
      ...assigned,
      quantity: editQuantity,
      pricing,
      details: {
        ...assigned.details,
        contractDescription: editDescription,
      },
    };
    updateAssignedCode(updatedAssigned);
  };

  const calculatePrice = () => {
    if (!pricing) return 0;
    let price = pricing.basePrice || 0;
    if (editQuantity > pricing.minimumQuantity) {
      price +=
        (editQuantity - pricing.minimumQuantity) * pricing.unitPriceCents;
    }
    return price / 100;
  };

  const totalPrice = calculatePrice().toFixed(2);

  const assignedTimeBlocks = details.subItems.flatMap((subItem) =>
    subItem.assemblies.flatMap((assembly) =>
      assembly.timeblocks.filter((block) => block.contextKey === jobId)
    )
  );

  const statusColor = (item, current) => {
    const { totalAssemblies, availableAssemblies } = item.availability;
    const availableRatio = availableAssemblies / totalAssemblies;
    const assigned = item.assemblies.flatMap((assembly) =>
      assembly.timeblocks.filter((block) => block.contextKey === job.id)
    );

    const currentItem = current + 1;

    if (assigned.length > 0 && currentItem > assigned.length) {
      return expanded ? "bg-violet-300" : "bg-violet-500";
    }
    if (assigned.length > 0) {
      return expanded ? "bg-sky-300" : "bg-sky-500";
    }
    if (availableRatio >= 0.75)
      return expanded ? "bg-green-300" : "bg-green-500";
    if (availableRatio >= 0.5)
      return expanded ? "bg-yellow-300" : "bg-yellow-500";
    if (availableRatio >= 0.25)
      return expanded ? "bg-orange-300" : "bg-orange-500";
    return expanded ? "bg-red-300" : "bg-red-500";
  };

  return (
    <div className="relative flex flex-col p-5 mx-1 rounded shadow border-1 bg-gray-50">
      <div className="flex justify-between bg-gray-300 rounded-full">
        <div className="flex items-center">
          <div className="p-1 px-4 font-semibold text-center text-white bg-gray-400 rounded-full">
            {details.code}
          </div>
          <div className="flex items-center gap-3 ml-2 ">
            {details.subItems.map((item, index) => (
              <div className="flex gap-1 bg-gray-100 rounded-full" key={index}>
                {Array.from({ length: item.quantity }, (_, i) => (
                  <div
                    key={i} // use the index of the repeated div as key
                    className={`${statusColor(
                      item,
                      i
                    )} px-2 py-.5 text-xs text-white bg-gray-300 rounded-full`}
                  >
                    {item.code}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-200 rounded-full">
          <button onClick={toggleExpand} className="p-2 rounded">
            {expanded ? (
              <DownCarrot style={"w-5 h-5"} color={"black"} />
            ) : (
              <LeftCarrot style={"w-5 h-5"} color={"black"} />
            )}
          </button>
        </div>
      </div>

      <button
        onClick={() => removeAssignedCode(assigned.details._id)}
        className="absolute top-0 right-0 rounded-full hover:bg-red-500"
      >
        <XIcon color={"#DFDFDF"} style={"w-5 h-5 hover:bg-text-500"} />
      </button>

      <div className="flex items-center justify-start w-full ">
        <div
          className={`${
            expanded && "mt-5"
          } flex items-center justify-between w-full gap-2 p-1 px-6 rounded-full bg-gray-50`}
        >
          <div className="flex items-center px-2 text-sm bg-gray-200 rounded-lg">
            {pricing.clientDescription}
          </div>
          <div className="flex">
            <div className="flex items-center gap-2 px-2 text-sm rounded-lg">
              <label htmlFor="quantity" className="block">
                Quantity:
              </label>
              <input
                id="quantity"
                type="number"
                value={editQuantity}
                onChange={(e) => setEditQuantity(e.target.value)}
                onBlur={handleUpdate}
                className="w-12 px-1 text-sm bg-gray-100 border rounded"
              />
            </div>

            <div className="flex items-center gap-2 px-2 text-sm rounded-lg">
              <button
                onClick={togglePricingExpand}
                className="px-1 text-white bg-indigo-500 rounded-full hover:bg-indigo-600"
              >
                ${totalPrice}
              </button>
              {pricingExpanded && (
                <div className="p-2 mt-2 bg-white border rounded shadow">
                  <p>
                    <strong>Base Price:</strong> ${pricing.basePrice / 100}
                  </p>
                  <p>
                    <strong>Unit Price:</strong> ${pricing.unitPrice}
                  </p>
                  <p>
                    <strong>Minimum Quantity:</strong> {pricing.minimumQuantity}
                  </p>
                  <p>
                    <strong>Maximum Quantity:</strong> {pricing.maximumQuantity}
                  </p>
                  <p>
                    <strong>Base Adjust:</strong> {pricing.baseAdjust}
                  </p>
                  <p>
                    <strong>Unit Adjust:</strong> {pricing.unitAdjust}
                  </p>
                  <p>
                    <strong>Discounts:</strong> Base - $
                    {pricing.baseDiscount / 100}, Unit - $
                    {pricing.unitDiscount / 100}
                  </p>
                  <p>
                    <strong>Client Description:</strong>{" "}
                    {pricing.clientDescription}
                  </p>
                  <p>
                    <strong>Term Factor:</strong>{" "}
                    {Object.entries(pricing.termFactor).map(([key, value]) => (
                      <span key={key}>
                        {key}: {value}{" "}
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {expanded && details && (
        <div className="flex flex-col gap-3 mt-4 ml-6">
          {details.subItems.map((item, index) => (
            <AssignedSubItem key={item._id} details={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedCodeDetails;
