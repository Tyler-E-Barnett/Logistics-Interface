import React, { useState, useEffect } from "react";
import { PlusIcon, XIcon } from "../../assets/icons";
import { equipmentOptions } from "../../modules/dropdownValues";
import axios from "axios";

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

interface SubCodeId {
  subItem: string;
  quantity: number;
}

const SubCodes: React.FC<{
  subCodes: SubCode[];
  filteredSubCodes: SubCode[];
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedSubCode: string;
  setSelectedSubCode: React.Dispatch<React.SetStateAction<string>>;
  subCodeIds: SubCodeId[];
  setSubCodeIds: React.Dispatch<React.SetStateAction<SubCodeId[]>>;
}> = ({
  subCodes,
  filteredSubCodes,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  selectedSubCode,
  setSelectedSubCode,
  subCodeIds,
  setSubCodeIds,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [subCodeDetails, setSubCodeDetails] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    const fetchSubCodeDetails = async () => {
      const details: Record<string, string> = {};
      await Promise.all(
        subCodeIds.map(async (subItem) => {
          try {
            const response = await axios.get(
              `/api/jobData/subItemDetails/${subItem.subItem}`
            );
            details[subItem.subItem] = response.data.code;
          } catch (error) {
            console.error(
              `Error fetching sub item details for id ${subItem.subItem}:`,
              error
            );
          }
        })
      );
      setSubCodeDetails(details);
    };

    fetchSubCodeDetails();
  }, [subCodeIds]);

  const addSubCode = () => {
    if (
      selectedSubCode &&
      !subCodeIds.some(({ subItem }) => subItem === selectedSubCode)
    ) {
      setSubCodeIds([...subCodeIds, { subItem: selectedSubCode, quantity }]);
      setSelectedSubCode("");
      setQuantity(1);
    }
  };

  const removeSubCode = (subCodeId: string) => {
    const confirmed = window.confirm("Remove Subcode?");
    if (confirmed) {
      setSubCodeIds(subCodeIds.filter(({ subItem }) => subItem !== subCodeId));
    }
  };

  const updateQuantity = (subItemId: string, newQuantity: number) => {
    setSubCodeIds(
      subCodeIds.map((subCode) =>
        subCode.subItem === subItemId
          ? { ...subCode, quantity: newQuantity }
          : subCode
      )
    );
  };

  return (
    <div className="p-4 border border-blue-300 rounded-lg bg-blue-50">
      <h2 className="mb-4 text-xl font-medium text-gray-700">SubCodes</h2>
      <div className="flex mt-2 space-x-2">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-1/2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="" disabled>
            Select a Category...
          </option>
          <option value="">All</option>
          {equipmentOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-1/2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="flex p-1 mt-2 space-x-2 rounded">
        <select
          value={selectedSubCode}
          onChange={(e) => setSelectedSubCode(e.target.value)}
          className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="" disabled>
            Select a SubCode...
          </option>
          {filteredSubCodes.map((subCode) => (
            <option key={subCode._id} value={subCode._id}>
              {subCode.code}
            </option>
          ))}
        </select>
        <div className="flex flex-col items-center">
          <label
            htmlFor="quantity"
            className="text-sm font-medium text-gray-700"
          >
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="block w-20 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <button
          type="button"
          onClick={addSubCode}
          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon
            style={"w-10 h-10 rounded-full hover:bg-sky-100"}
            color={"#5046e6"}
          />
        </button>
      </div>
      <div className="mt-2 space-x-2">
        {subCodeIds.map(({ subItem, quantity }) => (
          <div
            key={subItem}
            className="inline-flex gap-2  group items-center px-2 py-0.5 rounded-full border border-blue-500 text-sm font-medium bg-indigo-100 text-indigo-800"
          >
            <div className="">{subCodeDetails[subItem] || "Loading..."}</div>
            <input
              type="number"
              value={quantity}
              onChange={(e) => updateQuantity(subItem, Number(e.target.value))}
              className="w-10 pl-2 text-center border border-gray-300 rounded-full shadow-sm bg-indigo-50 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <button
              type="button"
              onClick={() => removeSubCode(subItem)}
              className="w-0 transition-all duration-300 opacity-0 hover:text-indigo-900 group-hover:opacity-100 group-hover:w-4"
            >
              <XIcon
                style={"w-4 h-4 rounded-full  hover:scale-105"}
                color={"#002BA3"}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubCodes;
