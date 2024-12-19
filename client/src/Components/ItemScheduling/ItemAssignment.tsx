import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { parentItemCodeCategories } from "../../modules/dropdownValues";
import SubItem from "./SubItem";
import AssignedCodeDetails from "./AssignedCodeDetails";
import { TimelineContext } from "../../context/TimelineContext";
import { JobContext } from "../../context/JobContext";
import { PlusIcon } from "../../assets/icons";
import { JobData, ItemDetails } from "../../../types"; // Import the types

const ItemAssignment: React.FC = () => {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [filteredItemCodes, setFilteredItemCodes] = useState<SubItem[]>([]);
  const [currentCode, setCurrentCode] = useState("");
  const [currentCodeName, setCurrentCodeName] = useState<string | null>(null);
  const [assignedCodes, setAssignedCodes] = useState<any[]>([]);
  const [priceLevels, setPriceLevels] = useState<any[]>([]);
  const [quantity, setQuantity] = useState("");
  const [pricing, setPricing] = useState<any>(null);
  const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
  const [itemAggregation, setItemAggregation] = useState<{
    [key: string]: any;
  } | null>(null); // New state for item aggregation
  const { setRange } = useContext(TimelineContext)!;
  const { update, job } = useContext(JobContext)!;

  useEffect(() => {
    if (category || search) {
      fetchItemCodes();
    } else {
      setFilteredItemCodes([]);
    }
  }, [category, search]);

  useEffect(() => {
    const fetchJobItems = async () => {
      try {
        const { id } = job;

        const result = await axios.get(`/api/jobData/jobItems/details/${id}`);
        const items = result.data;
        console.log(items[0]);
        if (items.length > 0) {
          setAssignedCodes(items);
        }
      } catch (error) {
        console.log("error fetching availability", error);
      }
    };

    setAssignedCodes([]);

    if (job) {
      fetchJobItems();
    }
  }, [job, update]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { jobId, start, end, id } = job;

        const data = {
          id: currentCode,
          start: start,
          end: end,
          contextType: "jobAssembly",
          contextKey: id,
        };

        const result = await axios.post("/api/jobData/itemDetails", data);
        setItemDetails(result.data);
      } catch (error) {
        console.log("error fetching availability", error);
      }
    };

    if (currentCode) {
      fetchDetails();
    }
  }, [job, currentCode, update]);

  useEffect(() => {
    const setJobRange = () => {
      const startDate = new Date(job.start);
      const endDate = new Date(job.end);

      const newStartDate = new Date(startDate.setDate(startDate.getDate() - 1));
      newStartDate.setHours(0, 0, 0, 0);

      const newEndDate = new Date(endDate.setDate(endDate.getDate() + 1));
      newEndDate.setHours(23, 59, 59, 999);

      setRange({
        startDate: newStartDate,
        endDate: newEndDate,
      });
    };

    if (job && job.start && job.end) {
      setJobRange();
    }
  }, [job]);

  const fetchItemCodes = async () => {
    try {
      const response = await axios.get("/api/jobData/itemCodes", {
        params: {
          category,
          tags: search,
        },
      });
      if (response.status === 200 && response.data) {
        setFilteredItemCodes(response.data);
      }
    } catch (error) {
      console.error("Error fetching item codes:", error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/\s+/g, ",");
    setSearch(value);
  };

  const pricingLookup = async (id) => {
    const pricing = await axios.get(`/api/jobData/priceLevel/${id}`);
    setPriceLevels(pricing.data);
    if (pricing.data.length > 0) {
      setPricing(pricing.data[0]); // Set default pricing level
    }
  };

  const handleCodeChange = (e) => {
    if (job) {
      setCurrentCode(e.target.value);
      pricingLookup(e.target.value);
      const id = e.target.value;
      setCurrentCodeName(
        filteredItemCodes.find((code) => code._id === id).code
      );
    } else {
      alert("Please select a job");
    }
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handlePricingChange = (e) => {
    const selectedIndex = e.target.value;
    const selectedLevel = priceLevels[selectedIndex];
    setPricing(selectedLevel);
  };

  const assignItem = async (e) => {
    e.preventDefault();

    if (!job.id) {
      alert("Please Select a Job");
      return;
    }

    if (!currentCode) {
      alert("Please select an item code before adding.");
      return;
    }

    if (!quantity) {
      alert("Please provide a quantity before adding.");
      return;
    }

    if (!pricing || !pricing._id) {
      alert("Please select pricing before adding.");
      return;
    }

    if (!assignedCodes.find((i) => i.details._id === currentCode)) {
      const newAssignedCode = {
        details: { ...itemDetails },
        quantity,
        pricing: pricing,
        job: job.id,
        priceLevels: [...priceLevels], // Store price levels specific to this item
      };

      const itemData = {
        codeId: itemDetails?._id,
        quantity,
        pricing: pricing._id,
        jobId: job.id,
      };

      try {
        const response = await axios.put("/api/jobData/jobItem", itemData);
        if (response.status === 200 && response.data) {
          setAssignedCodes((prevAssignedCodes) => [
            ...prevAssignedCodes,
            newAssignedCode,
          ]);
          setCurrentCode("");
          setQuantity("");
          setPricing(null);
          setPriceLevels([]);
          setCurrentCodeName("");
          setItemDetails(null);
        }
      } catch (error) {
        console.log("error adding job item", error);
      }
    } else {
      alert("Code already added.");
    }
  };

  const removeAssignedCode = async (codeToRemove) => {
    const confirm = window.confirm(
      "Do you want to delete this item? All Item assignments will also be deleted"
    );

    if (!confirm) {
      return;
    }

    const assignedCode = assignedCodes.find(
      (assigned) => assigned.details._id === codeToRemove
    );

    if (assignedCode) {
      const timeblockIds = assignedCode.details.subItems
        .flatMap((subItem) =>
          subItem.assemblies.flatMap((assembly) =>
            assembly.timeblocks.filter(
              (timeblock) => timeblock.contextKey === job.id
            )
          )
        )
        .map((timeblock) => timeblock._id);

      try {
        setAssignedCodes(
          assignedCodes.filter(
            (assigned) => assigned.details._id !== codeToRemove
          )
        );

        if (timeblockIds.length > 0) {
          await Promise.all([
            axios.post("/api/inventory/delete/assignments", { timeblockIds }),
            axios.delete("/api/jobData/jobItem", {
              data: { codeId: assignedCode.details._id, jobId: job.id },
            }),
          ]);
        } else {
          console.log("timeblocks not found so just deleting job items");
          await axios.delete("/api/jobData/jobItem", {
            data: { codeId: assignedCode.details._id, jobId: job.id },
          });
        }
      } catch (error) {
        console.error("Error deleting timeblocks or job item:", error);
        alert("Failed to remove the item and its associated timeblocks.");
        setAssignedCodes((prevAssignedCodes) => [
          ...prevAssignedCodes,
          assignedCode,
        ]);
      }
    }
  };

  const getCurrentCodeNameColor = () => {
    if (!itemDetails || !itemDetails.subItems) return "bg-gray-50";

    let totalSubItems = 0;
    let unavailableCount = 0;

    itemDetails.subItems.forEach((subItem) => {
      totalSubItems += 1;
      if (subItem.availability.availableAssemblies === 0) {
        unavailableCount += 1;
      }
    });

    if (unavailableCount === totalSubItems) return "bg-red-200";
    if (unavailableCount > 0) return "bg-yellow-200";
    return "bg-green-200";
  };

  useEffect(() => {
    if (assignedCodes.length > 0) {
      const aggregation = {};

      assignedCodes.forEach((code) => {
        console.log(code);

        const multiplyer = 1;
        // code.codeId.codeType === "Quantity" ? code.quantity : 1;

        console.log(multiplyer);

        code.details.subItems.forEach((item) => {
          // Find the index of the subItemCode under the codeId tree
          const subItemIndex = code.details.subItems.findIndex(
            (subItem) => subItem._id === item._id
          );

          // Get the corresponding quantity from the subItems
          const quantity =
            (code.details.subItems[subItemIndex]?.quantity || 1) * multiplyer;

          // Find matching timeblocks for this subItem
          const matchingTimeblocks = item.assemblies.flatMap((assembly) =>
            assembly.timeblocks.filter((block) => block.contextKey === job.id)
          );

          const timeblockCount = matchingTimeblocks.length;

          // If the subItemCode already exists in the aggregation, only add the quantity
          if (aggregation[item.code]) {
            aggregation[item.code].totalQuantity += quantity;
            aggregation[item.code].totalTimeblocks += timeblockCount;
          } else {
            // Otherwise, create a new entry with the initial timeblockCount and quantity
            aggregation[item.code] = {
              totalQuantity: quantity,
              totalTimeblocks: timeblockCount,
            };
          }
        });
      });

      setItemAggregation(aggregation);
    }
  }, [assignedCodes, job.id]); // Add job.id as a dependency to re-run this effect when the job changes

  return (
    <div className="flex flex-col w-full gap-4 p-4 m-auto mt-4 bg-white border rounded shadow-sm">
      <form className="flex items-end justify-around w-full gap-3 p-2 py-4 mx-auto bg-gray-300 rounded-t ">
        <div className="">
          <label
            className="block mb-1 text-sm font-medium text-gray-700 "
            htmlFor="category"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full p-2 leading-tight text-gray-700 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:bg-white focus:border-indigo-500"
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="">None</option>
            {parentItemCodeCategories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="">
          <label
            className="block mb-1 text-sm font-medium text-gray-700"
            htmlFor="search"
          >
            Search
          </label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={handleSearchChange}
            className="block w-full p-2 leading-tight text-gray-700 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:bg-white focus:border-indigo-500"
          />
        </div>

        <div className="">
          <label
            className="block mb-1 text-sm font-medium text-gray-700"
            htmlFor="itemCodes"
          >
            Item Codes
          </label>
          <select
            id="itemCodes"
            value={currentCode}
            onChange={handleCodeChange}
            className="block w-full p-2 leading-tight text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:bg-white focus:border-indigo-500"
          >
            <option value="" disabled>
              Select Item Code
            </option>
            <option value="">None</option>
            {filteredItemCodes.map((itemCode) => (
              <option key={itemCode._id} value={itemCode._id}>
                {itemCode.code}
              </option>
            ))}
          </select>
        </div>

        <div className="">
          <label
            className="block mb-1 text-sm font-medium text-gray-700"
            htmlFor="quantity"
          >
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className="block w-full p-2 leading-tight text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:bg-white focus:border-indigo-500"
          />
        </div>

        <div className="">
          <label
            className="block mb-1 text-sm font-medium text-gray-700"
            htmlFor="pricing"
          >
            Pricing Level
          </label>
          <select
            id="pricing"
            value={pricing ? priceLevels.indexOf(pricing) : 0}
            onChange={handlePricingChange}
            className="block w-full p-2 leading-tight text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:bg-white focus:border-indigo-500"
          >
            <option value="" disabled>
              Select Price Level
            </option>
            {priceLevels.map((level, index) => (
              <option key={index} value={index}>
                {level.level.levelName} ($
                {level.basePrice
                  ? (level.basePrice / 100).toFixed(2)
                  : (level.unitPriceCents / 100).toFixed(2)}
                )
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={assignItem}
          className="flex items-center justify-center w-12 h-full p-1 rounded-full hover:bg-sky-50"
        >
          <PlusIcon color={"#001EFF"} style={"w-12 h-12"} />
        </button>
      </form>
      {currentCode && (
        <div
          className={`p-2 font-semibold rounded ${getCurrentCodeNameColor()}`}
        >
          {currentCodeName}
        </div>
      )}
      {currentCode && (
        <div className="flex flex-col items-start w-full p-2 rounded bg-gray-50">
          {itemDetails &&
            itemDetails.subItems.map((item, index) => (
              <div className="w-full text-xs" key={index}>
                <SubItem details={item} />
              </div>
            ))}
        </div>
      )}
      <div className="flex flex-col gap-2 p-2 border-4 border-gray-200 rounded-b border-rounded">
        {assignedCodes.map((assigned, index) => (
          <AssignedCodeDetails
            key={index}
            assigned={assigned}
            removeAssignedCode={removeAssignedCode}
            updateAssignedCode={(updatedAssigned) => {
              setAssignedCodes((prevState) =>
                prevState.map((assignedCode) =>
                  assignedCode.details._id === updatedAssigned.details._id
                    ? updatedAssigned
                    : assignedCode
                )
              );
            }}
            priceLevels={assigned.priceLevels} // Use the specific price levels for each assigned code
          />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {itemAggregation &&
          Object.entries(itemAggregation).map(
            ([code, { totalQuantity, totalTimeblocks }]) => {
              const ratio = (totalTimeblocks / totalQuantity).toFixed(2);
              return (
                <div key={code} className="flex items-center gap-2">
                  <div className="px-2 py-1 text-xs text-white bg-blue-500 rounded-full">
                    {code}
                  </div>
                  <div className="px-2 py-1 text-xs text-gray-700">
                    {totalTimeblocks} / {totalQuantity} ({ratio})
                  </div>
                </div>
              );
            }
          )}
      </div>
    </div>
  );
};

export default ItemAssignment;
