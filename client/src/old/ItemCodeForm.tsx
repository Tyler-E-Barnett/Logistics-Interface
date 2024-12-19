import React, { useState } from "react";
import { PlusIcon, XIcon } from "../assets/icons";
import axios from "axios";

const ItemCodeForm: React.FC = () => {
  const [itemsState, setItemsState] = useState<{
    code: string;
    category: string;
    type: string;
    costingDepartment: string;
    contractDescription: string;
    tags: string[];
    newTag: string;
    subItems: {
      code: string;
      category: string;
      tags: string[];
      newTag: string;
      assemblyIds: string[];
      newAssemblyId: string;
    }[];
  }>({
    code: "",
    category: "",
    type: "",
    costingDepartment: "",
    contractDescription: "",
    tags: [],
    newTag: "",
    subItems: [
      {
        code: "",
        category: "",
        tags: [],
        newTag: "",
        assemblyIds: [],
        newAssemblyId: "",
      },
    ],
  });

  const handleAddSubItem = () => {
    setItemsState({
      ...itemsState,
      subItems: [
        ...itemsState.subItems,
        {
          code: "",
          category: "",
          tags: [],
          newTag: "",
          assemblyIds: [],
          newAssemblyId: "",
        },
      ],
    });
  };

  const handleItemsStateChange = (field: string, value: string) => {
    setItemsState({ ...itemsState, [field]: value });
  };

  const handleSubItemChange = (index: number, field: string, value: string) => {
    const newSubItems = [...itemsState.subItems];
    newSubItems[index] = { ...newSubItems[index], [field]: value };
    setItemsState({ ...itemsState, subItems: newSubItems });
  };

  const handleSubItemTagChange = (
    subIndex: number,
    tagIndex: number,
    value: string
  ) => {
    const newSubItems = [...itemsState.subItems];
    newSubItems[subIndex].tags[tagIndex] = value;
    setItemsState({ ...itemsState, subItems: newSubItems });
  };

  const handleAddSubItemTag = (subIndex: number) => {
    const newSubItems = [...itemsState.subItems];
    if (newSubItems[subIndex].newTag) {
      newSubItems[subIndex].tags.push(newSubItems[subIndex].newTag);
      newSubItems[subIndex].newTag = "";
      setItemsState({ ...itemsState, subItems: newSubItems });
    }
  };

  const handleRemoveSubItemTag = (subIndex: number, tagIndex: number) => {
    const newSubItems = [...itemsState.subItems];
    newSubItems[subIndex].tags = newSubItems[subIndex].tags.filter(
      (_, i) => i !== tagIndex
    );
    setItemsState({ ...itemsState, subItems: newSubItems });
  };

  const handleSubItemAssemblyIdChange = (
    subIndex: number,
    assemblyIdIndex: number,
    value: string
  ) => {
    const newSubItems = [...itemsState.subItems];
    newSubItems[subIndex].assemblyIds[assemblyIdIndex] = value;
    setItemsState({ ...itemsState, subItems: newSubItems });
  };

  const handleAddSubItemAssemblyId = (subIndex: number) => {
    const newSubItems = [...itemsState.subItems];
    if (newSubItems[subIndex].newAssemblyId) {
      newSubItems[subIndex].assemblyIds.push(
        newSubItems[subIndex].newAssemblyId
      );
      newSubItems[subIndex].newAssemblyId = "";
      setItemsState({ ...itemsState, subItems: newSubItems });
    }
  };

  const handleRemoveSubItemAssemblyId = (
    subIndex: number,
    assemblyIdIndex: number
  ) => {
    const newSubItems = [...itemsState.subItems];
    newSubItems[subIndex].assemblyIds = newSubItems[
      subIndex
    ].assemblyIds.filter((_, i) => i !== assemblyIdIndex);
    setItemsState({ ...itemsState, subItems: newSubItems });
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...itemsState.tags];
    newTags[index] = value;
    setItemsState({ ...itemsState, tags: newTags });
  };

  const handleRemoveTag = (index: number) => {
    const newTags = itemsState.tags.filter((_, i) => i !== index);
    setItemsState({ ...itemsState, tags: newTags });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put("/api/jobData/itemCodes", itemsState);
      alert("Item Code saved successfully:", response.data);
      // Optionally, you can reset the form or provide feedback to the user here
    } catch (error) {
      console.error("There was an error saving the Item Code:", error);
      // Optionally, handle the error by showing an error message to the user
    }
  };

  return (
    <form
      className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-lg"
      onSubmit={handleSubmit}
    >
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Create New Record
      </h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Code</label>
        <input
          type="text"
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={itemsState.code}
          onChange={(e) => handleItemsStateChange("code", e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <input
          type="text"
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={itemsState.category}
          onChange={(e) => handleItemsStateChange("category", e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <input
          type="text"
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={itemsState.type}
          onChange={(e) => handleItemsStateChange("type", e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Costing Department
        </label>
        <input
          type="text"
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={itemsState.costingDepartment}
          onChange={(e) =>
            handleItemsStateChange("costingDepartment", e.target.value)
          }
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Contract Description
        </label>
        <textarea
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={itemsState.contractDescription}
          onChange={(e) =>
            handleItemsStateChange("contractDescription", e.target.value)
          }
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <div className="flex items-center mt-2">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={itemsState.newTag}
            onChange={(e) => handleItemsStateChange("newTag", e.target.value)}
          />
          <button
            type="button"
            className="w-12 h-12 p-1 ml-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              if (itemsState.newTag) {
                setItemsState({
                  ...itemsState,
                  tags: [...itemsState.tags, itemsState.newTag],
                  newTag: "",
                });
              }
            }}
          >
            <PlusIcon color={"#00B41E"} />
          </button>
        </div>
        {itemsState.tags.map((tag, index) => (
          <div key={index} className="flex items-center mt-2">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={tag}
              onChange={(e) => handleTagChange(index, e.target.value)}
            />
            <button
              type="button"
              className="w-12 h-12 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => handleRemoveTag(index)}
            >
              <XIcon color={"#EA0000"} />
            </button>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Sub Items
        </label>
        {itemsState.subItems.map((item, subIndex) => (
          <div key={subIndex} className="p-4 mb-4 border rounded-md bg-gray-50">
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Code
              </label>
              <input
                type="text"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={item.code}
                onChange={(e) =>
                  handleSubItemChange(subIndex, "code", e.target.value)
                }
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={item.category}
                onChange={(e) =>
                  handleSubItemChange(subIndex, "category", e.target.value)
                }
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <div className="flex items-center mt-2">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={item.newTag}
                  onChange={(e) =>
                    handleSubItemChange(subIndex, "newTag", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="w-12 h-12 p-1 ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => handleAddSubItemTag(subIndex)}
                >
                  <PlusIcon color={"#00B41E"} />
                </button>
              </div>
              {item.tags.map((tag, tagIndex) => (
                <div key={tagIndex} className="flex items-center mt-2">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={tag}
                    onChange={(e) =>
                      handleSubItemTagChange(subIndex, tagIndex, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="w-12 h-12 p-1 ml-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={() => handleRemoveSubItemTag(subIndex, tagIndex)}
                  >
                    <XIcon color={"#EA0000"} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Assembly ID
              </label>
              <div className="flex items-center mt-2">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={item.newAssemblyId}
                  onChange={(e) =>
                    handleSubItemChange(
                      subIndex,
                      "newAssemblyId",
                      e.target.value
                    )
                  }
                />
                <button
                  type="button"
                  className="w-12 h-12 p-1 ml-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => handleAddSubItemAssemblyId(subIndex)}
                >
                  <PlusIcon color={"#00B41E"} />
                </button>
              </div>
              {item.assemblyIds.map((assemblyId, assemblyIdIndex) => (
                <div key={assemblyIdIndex} className="flex items-center mt-2">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={assemblyId}
                    onChange={(e) =>
                      handleSubItemAssemblyIdChange(
                        subIndex,
                        assemblyIdIndex,
                        e.target.value
                      )
                    }
                  />
                  <button
                    type="button"
                    className="w-12 h-12 p-1 ml-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={() =>
                      handleRemoveSubItemAssemblyId(subIndex, assemblyIdIndex)
                    }
                  >
                    <XIcon color={"#EA0000"} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="flex items-center h-12 p-1 px-2 ml-2 text-white bg-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => {
                const newSubItems = itemsState.subItems.filter(
                  (_, i) => i !== subIndex
                );
                setItemsState({ ...itemsState, subItems: newSubItems });
              }}
            >
              Remove Sub Item
            </button>
          </div>
        ))}
        <button
          type="button"
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleAddSubItem}
        >
          Add Sub Item
        </button>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 mt-6 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Submit
      </button>
    </form>
  );
};

export default ItemCodeForm;
