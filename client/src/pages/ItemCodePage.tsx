import React, { useState, useEffect } from "react";
import axios from "axios";
import ItemCodeEntry from "../Components/ItemCodeAssignment/ItemCodeEntry";
import SubItemCodeEntry from "../Components/ItemCodeAssignment/SubItemCodeEntry";
import { XIcon } from "../assets/icons";

const ItemCodePage = () => {
  const [itemCodes, setItemCodes] = useState([]);
  const [subItemCodes, setSubItemCodes] = useState([]);

  useEffect(() => {
    fetchItemCodes();
    fetchSubItemCodes();
  }, []);

  const fetchItemCodes = async () => {
    try {
      const response = await axios.get("/api/jobData/itemcodes");
      setItemCodes(response.data);
    } catch (error) {
      console.error("Error fetching item codes:", error);
    }
  };

  const fetchSubItemCodes = async () => {
    try {
      const response = await axios.get("/api/jobData/subItemCodes");
      setSubItemCodes(response.data);
    } catch (error) {
      console.error("Error fetching sub-item codes:", error);
    }
  };

  const deleteItemCode = async (id) => {
    try {
      await axios.delete(`/api/jobData/itemCode/${id}`);
      fetchItemCodes(); // Refresh the item codes after deletion
    } catch (error) {
      console.error("Error deleting item code:", error);
    }
  };

  const deleteSubItemCode = async (id) => {
    try {
      await axios.delete(`/api/jobData/subItemCode/${id}`);
      fetchSubItemCodes(); // Refresh the sub-item codes after deletion
    } catch (error) {
      console.error("Error deleting sub-item code:", error);
    }
  };

  return (
    <div className="">
      <h2 className="mt-10 ml-10 text-3xl font-bold">Item Code Entry</h2>
      <div className="flex justify-center w-full mt-10">
        <div className="flex gap-8">
          <div className="">
            <ItemCodeEntry />
          </div>
          <div className="">
            <h3 className="text-xl font-bold">Item Codes</h3>
            <ul className="mt-4 space-y-2">
              {itemCodes.map((itemCode) => (
                <li
                  key={itemCode._id}
                  className="flex justify-between gap-2 p-2 border border-gray-300 rounded"
                >
                  {itemCode.code}
                  <button
                    onClick={() => deleteItemCode(itemCode._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <XIcon color={"indianred"} style={"w-6 h-6"} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-2 h-full bg-gray-300"></div>
          <div className="">
            <SubItemCodeEntry />
          </div>
          <div className="">
            <h3 className="text-xl font-bold">Sub Item Codes</h3>
            <ul className="mt-4 space-y-2">
              {subItemCodes.map((subItemCode) => (
                <li
                  key={subItemCode._id}
                  className="flex justify-between gap-2 p-2 border border-gray-300 rounded"
                >
                  {subItemCode.code}
                  <button
                    onClick={() => deleteSubItemCode(subItemCode._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <XIcon color={"indianred"} style={"w-6 h-6"} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCodePage;
