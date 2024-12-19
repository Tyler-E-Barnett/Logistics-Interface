import React, { useState, useEffect } from "react";
import { PlusIcon, RefreshIcon } from "../../assets/icons";
import axios from "axios";
import {
  parentItemCodeCategories,
  costingDepartmenCategories,
} from "../../modules/dropdownValues";
import SubCodes from "./SubCodes";
import Pricing from "./Pricing";
import { ItemDetails } from "../../../types";

interface PricingLevel {
  unitPrice: number | string;
  defaultQuantity: number;
  minimumQuantity: number;
  maximumQuantity: number;
  basePrice: number;
  baseAdjust: number | string;
  baseDiscount: number | string;
  unitAdjust: number | string;
  unitDiscount: number | string;
  termFactor: {
    "2D": number;
    "3D": number;
    BW: number;
    FW: number;
    "10D": number;
    M: number;
  };
  _id?: string; // added optional _id for existing pricing levels
}

const quantityPricingDefault = {
  unitPrice: "",
  defaultQuantity: 1,
  minimumQuantity: 1,
  maximumQuantity: 10,
  basePrice: "",
  baseAdjust: "",
  baseDiscount: "",
  unitAdjust: "",
  unitDiscount: "",
  termFactor: {
    "2D": 2,
    "3D": 3,
    BW: 5,
    FW: 7,
    "10D": 10,
    M: 28,
  },
  level: "",
};

const hourlyPricingDefault = {
  unitPrice: "",
  defaultQuantity: 1,
  minimumQuantity: 1,
  maximumQuantity: 10,
  basePrice: "",
  baseAdjust: "",
  baseDiscount: "",
  unitAdjust: "",
  unitDiscount: "",
  termFactor: {
    "2D": 1,
    "3D": 1,
    BW: 1,
    FW: 1,
    "10D": 1,
    M: 1,
  },
  level: "",
};

const ItemCodeEntry: React.FC = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [subCodes, setSubCodes] = useState([]);
  const [filteredSubCodes, setFilteredSubCodes] = useState<SubCode[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSubCode, setSelectedSubCode] = useState<string>("");
  const [subCodeIds, setSubCodeIds] = useState<string[]>([]);
  const [code, setCode] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [codeType, setCodeType] = useState<string>(""); // New state for Code Type
  const [category, setCategory] = useState<string>("");
  const [costingDepartment, setCostingDepartment] = useState<string>("");
  const [contractDescription, setContractDescription] = useState<string>("");
  const [clientNotes, setClientNotes] = useState<string>(""); // New state for Client Notes
  const [pricing, setPricing] = useState<Pricing>(quantityPricingDefault);
  const [levelNames, setLevelNames] = useState<string[]>([]);
  const [pricingLevels, setPricingLevels] = useState<PricingLevel[]>([]);
  const [removedPricingLevels, setRemovedPricingLevels] = useState<string[]>(
    []
  ); // new state for removed pricing levels
  const [itemCodes, setItemCodes] = useState([]); // to store all item codes
  const [filteredItemCodes, setFilteredItemCodes] = useState([]); // to store filtered item codes

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const resetForm = () => {
    setCode("");
    setType("");
    setCodeType(""); // Reset Code Type
    setCategory("");
    setCostingDepartment("");
    setContractDescription("");
    setClientNotes(""); // Reset Client Notes
    setTags([]);
    setSubCodeIds([]);
    setPricing(quantityPricingDefault);
    setPricingLevels([]);
    setRemovedPricingLevels([]);
  };

  const handleCodeBlur = async () => {
    if (!code) {
      resetForm();
      return;
    }

    const words = code.split(" ");
    const newTags = words.filter((word) => !tags.includes(word));
    setTags([...tags, ...newTags]);

    const selectedItem = itemCodes.find((item) => item.code === code);
    if (selectedItem) {
      resetForm();
      setCode(selectedItem.code);
      setType(selectedItem.type);
      setCodeType(selectedItem.codeType); // sets Code Type when item selected
      setCategory(selectedItem.category);
      setCostingDepartment(selectedItem.costingDepartment);
      setContractDescription(selectedItem.contractDescription);
      setClientNotes(selectedItem.clientNotes); // sets Client Notes when item selected
      setTags(selectedItem.tags);
      setSubCodeIds(selectedItem.subItems.map((item) => item));
      console.log(selectedItem.subItems.map((item) => item));

      try {
        console.log(pricing);
        const pricingResponse = await axios.get(
          `/api/jobData/priceLevel/${selectedItem._id}`
        );
        const pricingLevelsData = pricingResponse.data.map((pricing) => ({
          ...pricing,
          unitPrice: (pricing.unitPriceCents / 100).toFixed(2), // Convert cents to dollars
          defaultQuantity: pricing.defaultQuantity,
          minimumQuantity: pricing.minimumQuantity,
          level: pricing.level,
          basePrice: (pricing.basePrice / 100).toFixed(2), // Convert cents to dollars
          baseAdjust: (pricing.baseAdjust / 100).toFixed(2), // Convert cents to dollars
          baseDiscount: (pricing.baseDiscount / 100).toFixed(2), // Convert cents to dollars
          unitAdjust: (pricing.unitAdjust / 100).toFixed(2), // Convert cents to dollars
          unitDiscount: (pricing.unitDiscount / 100).toFixed(2), // Convert cents to dollars
          maximumQuantity: pricing.maximumQuantity,
          termFactor: pricing.termFactor,
          clientDescription: pricing.clientDescription,
        }));
        setPricingLevels(pricingLevelsData);
      } catch (error) {
        console.error("Error fetching pricing levels:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      code,
      type,
      codeType, // Include Code Type in the data object
      category,
      costingDepartment,
      contractDescription,
      clientNotes, // Include Client Notes in the data object
      tags,
      subItems: subCodeIds,
      pricingLevels,
    };

    console.log(data);

    try {
      const response = await axios.put("/api/jobData/ItemCode/entry", data);
      console.log("Item code submitted successfully:", response.data);

      // Add itemId to each pricing level
      const itemId = response.data._id;
      const pricingData = pricingLevels.map((price) => ({
        ...price,
        itemId: itemId,
      }));

      console.log("Updated pricing data with itemId:", pricingData);

      const priceResponse = await axios.put(
        "/api/jobData/priceLevel",
        pricingData
      );

      console.log(priceResponse);

      // Remove the deleted pricing levels from the database
      if (removedPricingLevels.length > 0) {
        console.log("removed pricing levels: ", removedPricingLevels);
        await axios.delete("/api/jobData/priceLevel", {
          data: { ids: removedPricingLevels },
        });
        setRemovedPricingLevels([]);
      }

      alert("Item code submitted successfully");
      // Handle success, e.g., display a success message, reset the form, etc.
    } catch (error) {
      console.error("Error submitting item code:", error);
      alert("Error submitting item code:", error);
      // Handle error, e.g., display an error message
    }
  };

  useEffect(() => {
    const fetchSubCodes = async () => {
      try {
        const response = await axios.get("/api/jobData/subItemCodes", {
          params: {
            category: selectedCategory || undefined, // Only include category if it is not empty
          },
        });
        setSubCodes(response.data);
        setFilteredSubCodes(response.data);
      } catch (error) {
        console.error("Error fetching sub codes:", error);
      }
    };

    fetchSubCodes();
  }, [selectedCategory]);

  useEffect(() => {
    const filterSubCodes = () => {
      if (searchTerm) {
        setFilteredSubCodes(
          subCodes.filter((subCode) =>
            subCode.code.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      } else {
        setFilteredSubCodes(subCodes);
      }
    };

    filterSubCodes();
  }, [searchTerm, subCodes]);

  useEffect(() => {
    const getLevelNames = async () => {
      try {
        const response = await axios.get("/api/jobData/priceLevelName");
        setLevelNames(response.data);
      } catch (error) {
        console.error("Error fetching level names:", error);
      }
    };

    getLevelNames();
  }, []);

  useEffect(() => {
    const fetchItemCodes = async () => {
      try {
        const response = await axios.get("/api/jobData/itemcodes");
        console.log(response.data);
        setItemCodes(response.data);
      } catch (error) {
        console.error("Error fetching item codes:", error);
      }
    };

    fetchItemCodes();
  }, []);

  useEffect(() => {
    const filterItemCodes = () => {
      if (code) {
        setFilteredItemCodes(
          itemCodes.filter((itemCode) =>
            itemCode.code.toLowerCase().includes(code.toLowerCase())
          )
        );
      } else {
        setFilteredItemCodes([]);
      }
    };

    filterItemCodes();
  }, [code, itemCodes]);

  const handleCodeTypeChange = (e) => {
    const type = e.target.value;
    console.log(type);
    setCodeType(type);
    if (type === "Hourly") {
      console.log("type is hourly");
      setPricing(hourlyPricingDefault);
      return;
    }
    setPricing(quantityPricingDefault);
  };

  return (
    <form
      className="max-w-2xl p-6 mx-auto space-y-4 bg-white rounded-lg shadow-md"
      onSubmit={handleSubmit}
    >
      <button type="button" onClick={() => resetForm()}>
        <RefreshIcon style={"w-6 h-6"} />
      </button>

      <progress className="w-full text-red-500 rounded-full" value={0.75} />

      <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
        <h2 className="mb-4 text-xl font-medium text-gray-700">Code</h2>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onBlur={handleCodeBlur}
          className="block w-full p-1 px-2 mt-1 text-lg font-medium border border-gray-500 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          list="itemCodeOptions"
        />
        <datalist id="itemCodeOptions">
          {filteredItemCodes.map((itemCode) => (
            <option key={itemCode._id} value={itemCode.code}>
              {itemCode.code}
            </option>
          ))}
        </datalist>

        <div className="flex mt-4 space-x-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full px-1 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option disabled>Select a Category</option>
              {parentItemCodeCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">
              Costing Department
            </label>
            <select
              value={costingDepartment}
              onChange={(e) => setCostingDepartment(e.target.value)}
              className="block w-full px-1 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option disabled>Select a Costing Deparment</option>
              {costingDepartmenCategories.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="block mt-4 text-sm font-medium text-gray-700">
          Type
        </label>
        <div className="flex mt-1 space-x-4">
          {["Service", "Rental", "Merchandise"].map((typeOption) => (
            <div key={typeOption} className="flex items-center">
              <input
                type="radio"
                name="type"
                value={typeOption}
                checked={type === typeOption}
                onChange={(e) => setType(e.target.value)}
                className="w-4 h-4 text-indigo-600 border border-gray-300 focus:ring-indigo-500"
              />
              <label className="block ml-2 text-sm text-gray-900">
                {typeOption}
              </label>
            </div>
          ))}
        </div>

        <label className="block mt-4 text-sm font-medium text-gray-700">
          Code Type
        </label>
        <div className="flex mt-1 space-x-4">
          {["Quantity", "Hourly"].map((codeTypeOption) => (
            <div key={codeTypeOption} className="flex items-center">
              <input
                type="radio"
                name="codeType"
                value={codeTypeOption}
                checked={codeType === codeTypeOption}
                onChange={handleCodeTypeChange}
                className="w-4 h-4 text-indigo-600 border border-gray-300 focus:ring-indigo-500"
              />
              <label className="block ml-2 text-sm text-gray-900">
                {codeTypeOption}
              </label>
            </div>
          ))}
        </div>

        <label className="block mt-4 text-sm font-medium text-gray-700">
          Contract Description
        </label>
        <textarea
          value={contractDescription}
          onChange={(e) => setContractDescription(e.target.value)}
          className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          rows={2}
        ></textarea>

        <label className="block mt-4 text-sm font-medium text-gray-700">
          Client Notes
        </label>
        <textarea
          value={clientNotes}
          onChange={(e) => setClientNotes(e.target.value)}
          className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          rows={2}
        ></textarea>

        <label className="block mt-4 text-sm font-medium text-gray-700">
          Tags
        </label>
        <div className="flex p-1 mt-2 space-x-2 rounded">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <button
            type="button"
            onClick={addTag}
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon
              style={"w-10 h-10 rounded-full hover:bg-sky-100"}
              color={"#5046e6"}
            />
          </button>
        </div>
        <div className="mt-2 space-x-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-0.5 border border-gray-500 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-indigo-600 hover:text-indigo-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <SubCodes
        subCodes={subCodes}
        filteredSubCodes={filteredSubCodes}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSubCode={selectedSubCode}
        setSelectedSubCode={setSelectedSubCode}
        subCodeIds={subCodeIds}
        setSubCodeIds={setSubCodeIds}
      />

      <Pricing
        pricing={pricing}
        setPricing={setPricing}
        pricingLevels={pricingLevels}
        setPricingLevels={setPricingLevels}
        removedPricingLevels={removedPricingLevels}
        setRemovedPricingLevels={setRemovedPricingLevels}
        levelNames={levelNames}
      />

      <div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default ItemCodeEntry;
