import React, { useState, useEffect } from "react";
import { PlusIcon, RefreshIcon } from "../../assets/icons";
import axios from "axios";
import {
  parentItemCodeCategories,
  costingDepartmenCategories,
} from "../../modules/dropdownValues";
import SubCodes from "./SubCodes";
import Pricing from "./Pricing";

interface SubCode {
  _id: string;
  code: string;
  category: string;
  tags: string[];
  assemblyIds: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Pricing {
  unitPrice: string;
  defaultQuantity: string;
  minimumQuantity: string;
  level: string;
}

interface PricingLevel {
  unitPrice: string;
  defaultQuantity: string;
  minimumQuantity: string;
  level: string;
  _id?: string; // added optional _id for existing pricing levels
}

const ItemCodeEntry: React.FC = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [subCodes, setSubCodes] = useState<SubCode[]>([]);
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
  const [pricing, setPricing] = useState<Pricing>({
    unitPrice: "",
    defaultQuantity: "",
    minimumQuantity: "",
    level: "",
  });
  const [levelNames, setLevelNames] = useState<string[]>([]);
  const [pricingLevels, setPricingLevels] = useState<PricingLevel[]>([]);
  const [removedPricingLevels, setRemovedPricingLevels] = useState<string[]>(
    []
  ); // new state for removed pricing levels
  const [itemCodes, setItemCodes] = useState<SubCode[]>([]); // to store all item codes
  const [filteredItemCodes, setFilteredItemCodes] = useState<SubCode[]>([]); // to store filtered item codes

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
    setTags([]);
    setSubCodeIds([]);
    setPricing({
      unitPrice: "",
      defaultQuantity: "",
      minimumQuantity: "",
      level: "",
    });
    setPricingLevels([]);
  };

  const handleCodeBlur = async () => {
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
      setTags(selectedItem.tags);
      setSubCodeIds(selectedItem.subItems.map((item) => item._id));

      try {
        const pricingResponse = await axios.get(
          `/api/jobData/priceLevel/${selectedItem._id}`
        );
        const pricingLevelsData = pricingResponse.data.map((pricing) => ({
          ...pricing,
          unitPrice: (pricing.unitPriceCents / 100).toFixed(2), // Convert cents to dollars
          defaultQuantity: pricing.defaultQuantity,
          minimumQuantity: pricing.minimumQuantity,
          level: pricing.level,
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
      tags,
      subItems: subCodeIds,
      pricingLevels,
    };

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
        await axios.delete("/api/jobData/priceLevel", {
          data: { ids: removedPricingLevels },
        });
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

  return (
    <form
      className="max-w-lg p-6 mx-auto space-y-4 bg-white rounded-lg shadow-md"
      onSubmit={handleSubmit}
    >
      <button type="button" onClick={() => resetForm()}>
        <RefreshIcon style={"w-6 h-6"} />
      </button>
      <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
        <label className="block text-sm font-medium text-gray-700">Code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onBlur={handleCodeBlur}
          className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          list="itemCodeOptions"
        />
        <datalist id="itemCodeOptions">
          {filteredItemCodes.map((itemCode) => (
            <option key={itemCode._id} value={itemCode.code}>
              {itemCode.code}
            </option>
          ))}
        </datalist>

        <label className="block mt-4 text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          {parentItemCodeCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

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
                onChange={(e) => setCodeType(e.target.value)}
                className="w-4 h-4 text-indigo-600 border border-gray-300 focus:ring-indigo-500"
              />
              <label className="block ml-2 text-sm text-gray-900">
                {codeTypeOption}
              </label>
            </div>
          ))}
        </div>

        <label className="block mt-4 text-sm font-medium text-gray-700">
          Costing Department
        </label>
        <select
          value={costingDepartment}
          onChange={(e) => setCostingDepartment(e.target.value)}
          className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          {costingDepartmenCategories.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>

        <label className="block mt-4 text-sm font-medium text-gray-700">
          Contract Description
        </label>
        <textarea
          value={contractDescription}
          onChange={(e) => setContractDescription(e.target.value)}
          className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          rows={4}
        ></textarea>

        <label className="block mt-4 text-sm font-medium text-gray-700">
          Tags
        </label>
        <div className="flex p-1 mt-2 space-x-2 rounded">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
              className="inline-flex items-center px-3 py-0.5 border border-blue-500 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
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
