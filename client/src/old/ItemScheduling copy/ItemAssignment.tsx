import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { parentItemCodeCategories } from "../../modules/dropdownValues";
import SubItem from "./SubItem";
import AssignedCodeDetails from "./AssignedCodeDetails";
import { TimelineContext } from "../../context/TimelineContext";
import { JobContext } from "../../context/JobContext";
import { PlusIcon, XIcon, DownCarrot, LeftCarrot } from "../../assets/icons";
import { JobData, ItemDetails } from "../../../types"; // Import the types

const ItemAssignment: React.FC<{ job: JobData }> = ({ job }) => {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [filteredItemCodes, setFilteredItemCodes] = useState<SubItem[]>([]);
  const [currentCode, setCurrentCode] = useState("");
  const [currentCodeName, setCurrentCodeName] = useState<string | null>(null);
  const [assignedCodes, setAssignedCodes] = useState<any[]>([]);
  const [priceLevels, setPriceLevels] = useState<any[]>([]);
  const [quantity, setQuantity] = useState("");
  const [pricing, setPricing] = useState("");
  const [expandedCodes, setExpandedCodes] = useState<{
    [key: string]: boolean;
  }>({});
  const [expand, setExpand] = useState(false);
  const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
  const { setRange, range } = useContext(TimelineContext)!;
  const { update } = useContext(JobContext)!;

  useEffect(() => {
    if (category || search) {
      fetchItemCodes();
    } else {
      setFilteredItemCodes([]);
    }
  }, [category, search]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { jobId, start, end } = job;

        const data = {
          id: currentCode,
          start: start,
          end: end,
          contextType: "jobAssembly",
          contextKey: jobId,
        };

        const result = await axios.post("/api/jobData/itemDetails", data);
        console.log(result.data);
        setItemDetails(result.data);
      } catch (error) {
        console.log("error fetching availability", error);
      }
    };

    console.log(update);

    if (currentCode) {
      fetchDetails();
    }
  }, [job, currentCode, update]); // Added `update` here

  useEffect(() => {
    const setJobRange = () => {
      const startDate = new Date(job.start);
      const endDate = new Date(job.end);

      // Subtract a day from start date
      const newStartDate = new Date(startDate.setDate(startDate.getDate() - 1));
      newStartDate.setHours(0, 0, 0, 0);

      // Add a day to end date
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
    setPricing(e.target.value);
  };

  const assignItem = (e) => {
    e.preventDefault();

    if (!currentCode) {
      alert("Please select an item code before adding.");
      return;
    }

    if (!quantity) {
      alert("Please provide a quantity before adding.");
      return;
    }

    if (!pricing) {
      alert("Please select pricing before adding.");
      return;
    }

    if (!assignedCodes.find((i) => i.code === currentCode)) {
      setAssignedCodes([
        ...assignedCodes,
        { details: itemDetails, quantity, pricing, job },
      ]);
      setCurrentCode("");
      setQuantity("");
      setPricing("");
      setCurrentCodeName("");
      setItemDetails(null);
    } else {
      alert("Code already added.");
    }
  };

  const toggleExpand = (code) => {
    setExpand(!expand);
    setExpandedCodes((prevState) => ({
      ...prevState,
      [code]: !prevState[code],
    }));
  };

  const removeAssignedCode = (codeToRemove) => {
    setAssignedCodes(
      assignedCodes.filter((assigned) => assigned.code !== codeToRemove)
    );
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

  return (
    <div className="flex flex-col w-full gap-4 p-4 m-auto mt-4 bg-white border rounded shadow-sm">
      <form className="flex items-end justify-around w-full gap-3 p-2 mx-auto rounded shadow">
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
            value={pricing}
            onChange={handlePricingChange}
            className="block w-full p-2 leading-tight text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:bg-white focus:border-indigo-500"
          >
            <option value="" disabled>
              Select Price Level
            </option>
            {priceLevels.map((level) => (
              <option key={level._id} value={level.levelName}>
                {level.levelName} (${(level.unitPriceCents / 100).toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={assignItem}
          className="flex items-center justify-center w-8 h-8 p-1 rounded-full hover:bg-sky-50"
        >
          <PlusIcon color={"#001EFF"} style={"w-6 h-6"} />
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
        <div className="flex flex-col items-start w-full p-4 rounded bg-gray-50">
          {itemDetails &&
            itemDetails.subItems.map((item, index) => (
              <div className="w-full" key={index}>
                <SubItem details={item} />
              </div>
            ))}
        </div>
      )}

      <div className="flex flex-col p-2 border rounded border-rounded">
        {assignedCodes.map((assigned) => (
          <AssignedCodeDetails
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
            priceLevels={priceLevels}
          />
        ))}
      </div>
    </div>
  );
};

export default ItemAssignment;
