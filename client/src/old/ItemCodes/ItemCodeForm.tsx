import React, { useState, useEffect } from "react";
import axios from "axios";
import SubItem from "./SubItem";
import TagInput from "./TagInput";
import PricingLevel from "./PricingLevel";
import {
  parentItemCodeCategories,
  costingDepartmenCategories,
} from "../../modules/dropdownValues";
import { PlusIcon, XIcon } from "../../assets/icons";

const initialFormState = {
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
};

const initialPricingState = [
  {
    unitPrice: "",
    defaultQuantity: "",
    minimumQuantity: "",
    itemId: "",
    levelName: "",
    id: "",
  },
];

const ItemCodeForm: React.FC = () => {
  const [itemsState, setItemsState] = useState(initialFormState);
  const [pricingLevels, setPricingLevels] = useState(initialPricingState);
  const [codeSuggestions, setCodeSuggestions] = useState<
    { value: string; label: string }[]
  >([]);
  const [filteredCodeSuggestions, setFilteredCodeSuggestions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    // Fetch existing codes from the server
    const fetchCodes = async () => {
      try {
        const response = await axios.get("/api/jobData/itemCodes");
        const options = response.data.map((code: string) => ({
          value: code.code,
          label: code.code,
        }));
        setCodeSuggestions(options);
      } catch (error) {
        console.error("Error fetching item codes:", error);
      }
    };

    fetchCodes();
  }, []);

  useEffect(() => {
    if (itemsState.code) {
      setFilteredCodeSuggestions(
        codeSuggestions.filter((option) =>
          option.label.toLowerCase().includes(itemsState.code.toLowerCase())
        )
      );
    } else {
      setFilteredCodeSuggestions(codeSuggestions);
    }
  }, [itemsState.code, codeSuggestions]);

  const handlePricingLevelChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newPricingLevels = [...pricingLevels];
    newPricingLevels[index][field] = value;
    setPricingLevels(newPricingLevels);
  };

  const handleAddPricingLevel = () => {
    setPricingLevels([
      ...pricingLevels,
      {
        unitPrice: "",
        defaultQuantity: "",
        minimumQuantity: "",
        itemId: "",
        levelName: "",
        id: "",
      },
    ]);
  };

  const handleRemovePricingLevel = async (index: number) => {
    const newPricingLevels = pricingLevels.filter((_, i) => i !== index);
    const currentPricingLevel = pricingLevels.filter((_, i) => i === index);

    console.log(currentPricingLevel);
    try {
      const response = await axios.delete(
        `/api/jobData/priceLevel/${currentPricingLevel[0].id}`
      );
      const deletedItem = response.data;
      console.log(deletedItem);
    } catch (error) {
      console.error("Error deleting price level:", error);
    }
    setPricingLevels(newPricingLevels);
  };

  const handleAddSubItem = () => {
    setItemsState((prevState) => ({
      ...prevState,
      subItems: [
        ...prevState.subItems,
        {
          code: "",
          category: "",
          tags: [],
          newTag: "",
          assemblyIds: [],
          newAssemblyId: "",
        },
      ],
    }));
  };

  const handleItemsStateChange = async (field, value) => {
    setItemsState((prevState) => ({ ...prevState, [field]: value }));

    if (field === "code") {
      if (value === "") {
        setFilteredCodeSuggestions([]);
        setItemsState(initialFormState);
        setPricingLevels(initialPricingState);
        return;
      }

      setFilteredCodeSuggestions(
        codeSuggestions.filter((option) =>
          option.label.toLowerCase().includes(value.toLowerCase())
        )
      );

      try {
        const response = await axios.get(
          `/api/jobData/itemCodes/${value.trim()}`
        );
        if (response.status === 200 && response.data) {
          const existingItem = response.data;
          const subItemsWithAssemblies = await Promise.all(
            existingItem.subItems.map(async (subItem) => {
              const assemblyNames = await Promise.all(
                subItem.assemblyIds.map((id) => lookupAssemblyById(id))
              );
              return {
                ...subItem,
                tags: subItem.tags.map((tag) => tag.toLowerCase()), // Ensure subitem tags are lowercase
                newTag: "",
                assemblyIds: subItem.assemblyIds,
                newAssemblyId: "",
                assemblyNames: assemblyNames.filter((name) => name !== null), // Filter out null values
              };
            })
          );
          setItemsState((prevState) => ({
            ...prevState,
            code: existingItem.code,
            category: existingItem.category,
            type: existingItem.type,
            costingDepartment: existingItem.costingDepartment,
            contractDescription: existingItem.contractDescription,
            tags: existingItem.tags.map((tag) => tag.toLowerCase()), // Ensure tags are lowercase
            subItems: subItemsWithAssemblies, // Use subItems with assemblies
          }));
          fetchPricingLevels(existingItem["_id"]);
        } else {
          setItemsState((prevState) => ({
            ...prevState,
            category: "",
            type: "",
            costingDepartment: "",
            contractDescription: "",
            tags: [],
            newTag: "",
            subItems: initialFormState.subItems,
          }));
          setPricingLevels(initialPricingState);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("No item found");
          setItemsState((prevState) => ({
            ...prevState,
            category: "",
            type: "",
            costingDepartment: "",
            contractDescription: "",
            tags: [],
            newTag: "",
            subItems: initialFormState.subItems,
          }));
          setPricingLevels(initialPricingState);
        } else {
          console.error("There was an error checking the Item Code:", error);
        }
      }
    }
  };

  const handleCodeBlur = () => {
    const words = itemsState.code.trim().split(" ");
    setItemsState((prevState) => ({
      ...prevState,
      tags: [
        ...new Set([
          ...prevState.tags,
          ...words.filter(Boolean).map((word) => word.toLowerCase()),
        ]),
      ], // Ensure tags are lowercase
    }));
  };

  const fetchPricingLevels = async (itemId: string) => {
    try {
      const response = await axios.get(`/api/jobData/priceLevel/${itemId}`);
      console.log(response.data);
      if (response.status === 200 && response.data) {
        if (Array.isArray(response.data)) {
          setPricingLevels(
            response.data.map((pricingLevel: any) => ({
              unitPrice: (pricingLevel.unitPriceCents / 100).toFixed(2),
              defaultQuantity: pricingLevel.defaultQuantity,
              minimumQuantity: pricingLevel.minimumQuantity,
              itemId: pricingLevel.itemId,
              levelName: pricingLevel.level,
              id: pricingLevel["_id"],
            }))
          );
        } else {
          setPricingLevels(initialPricingState); // If response data is not an array, reset to initial state
        }
      }
    } catch (error) {
      console.error("There was an error fetching the Pricing Levels:", error);
      setPricingLevels(initialPricingState); // Reset to initial state on error
    }
  };

  const handleSubItemChange = (index: number, field: string, value: string) => {
    const newSubItems = [...itemsState.subItems];
    newSubItems[index] = { ...newSubItems[index], [field]: value };
    setItemsState((prevState) => ({ ...prevState, subItems: newSubItems }));

    // Call lookup function for assembly ID
    if (field === "newAssemblyId") {
      lookupAssemblyById(value, index);
    }
  };

  const lookupAssemblyById = async (assemblyId) => {
    try {
      const response = await axios.get(
        `/api/inventory/assembly/lookup/${assemblyId}`
      );
      if (response.status === 200 && response.data) {
        return response.data.assemblyId; // Assuming `assemblyId` is the name you want to display
      }
    } catch (error) {
      console.error(
        `Error fetching assembly by ID ${assemblyId}:`,
        error.response ? error.response.data : error.message
      );
      return null;
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...itemsState.tags];
    newTags[index] = value.toLowerCase();
    setItemsState((prevState) => ({ ...prevState, tags: newTags }));
  };

  const handleRemoveTag = (index: number) => {
    const newTags = itemsState.tags.filter((_, i) => i !== index);
    setItemsState((prevState) => ({ ...prevState, tags: newTags }));
  };

  const handleNewTagChange = (value: string) => {
    setItemsState((prevState) => ({
      ...prevState,
      newTag: value.toLowerCase(),
    }));
  };

  const handleAddTag = () => {
    if (itemsState.newTag) {
      setItemsState((prevState) => ({
        ...prevState,
        tags: [...prevState.tags, prevState.newTag.toLowerCase()],
        newTag: "",
      }));
    }
  };

  const handleSubItemTagChange = (
    subIndex: number,
    tagIndex: number,
    value: string
  ) => {
    const newSubItems = [...itemsState.subItems];
    newSubItems[subIndex].tags[tagIndex] = value.toLowerCase();
    setItemsState((prevState) => ({ ...prevState, subItems: newSubItems }));
  };

  const handleRemoveSubItemTag = (subIndex: number, tagIndex: number) => {
    const newSubItems = [...itemsState.subItems];
    newSubItems[subIndex].tags = newSubItems[subIndex].tags.filter(
      (_, i) => i !== tagIndex
    );
    setItemsState((prevState) => ({ ...prevState, subItems: newSubItems }));
  };

  const handleSubItemAssemblyIdChange = (
    subIndex: number,
    assemblyIdIndex: number,
    value: string
  ) => {
    const newSubItems = [...itemsState.subItems];
    newSubItems[subIndex].assemblyIds[assemblyIdIndex] = value;
    setItemsState((prevState) => ({ ...prevState, subItems: newSubItems }));
  };

  const handleAddSubItemAssemblyId = (subIndex: number) => {
    const newSubItems = [...itemsState.subItems];
    if (newSubItems[subIndex].newAssemblyId) {
      newSubItems[subIndex].assemblyIds.push(
        newSubItems[subIndex].newAssemblyId
      );
      newSubItems[subIndex].newAssemblyId = "";
      setItemsState((prevState) => ({ ...prevState, subItems: newSubItems }));
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
    setItemsState((prevState) => ({ ...prevState, subItems: newSubItems }));
  };

  const handleRemoveSubItem = (subIndex: number) => {
    const newSubItems = itemsState.subItems.filter((_, i) => i !== subIndex);
    setItemsState((prevState) => ({ ...prevState, subItems: newSubItems }));
  };

  const handleOptionSelect = (option: { value: string; label: string }) => {
    handleItemsStateChange("code", option.label);
    setFilteredCodeSuggestions([]);
  };

  const handleAddOption = () => {
    if (
      itemsState.code &&
      !codeSuggestions.some((option) => option.value === itemsState.code)
    ) {
      const newOption = { value: itemsState.code, label: itemsState.code };
      setCodeSuggestions((prevOptions) => [...prevOptions, newOption]);
      handleItemsStateChange("code", itemsState.code);
    }
  };

  const handleAddSubItemTag = (subIndex: number) => {
    const newSubItems = [...itemsState.subItems];
    if (newSubItems[subIndex].newTag) {
      newSubItems[subIndex].tags.push(
        newSubItems[subIndex].newTag.toLowerCase()
      );
      newSubItems[subIndex].newTag = "";
      setItemsState((prevState) => ({ ...prevState, subItems: newSubItems }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put("/api/jobData/itemCodes", itemsState);

      // Assuming the response contains the new item ID
      const itemId = response.data["_id"];

      // Update the pricing levels with the new item ID
      const updatedPricingLevels = pricingLevels.map((pricingLevel) => ({
        ...pricingLevel,
        itemId: itemId,
      }));

      console.log(updatedPricingLevels);

      // Send the updated pricing levels to the API
      const pricingResponse = await axios.put(
        "/api/jobData/priceLevel",
        updatedPricingLevels
      );

      console.log(pricingResponse.data);

      alert("Item Code and Pricing Levels saved successfully");
      // Optionally, reset the form or provide additional feedback to the user here
    } catch (error) {
      console.error("There was an error saving the Item Code:", error);

      // Display a more user-friendly error message
      if (error.response) {
        // Server responded with a status other than 2xx
        alert(
          `Error: ${error.response.data.error || error.response.statusText}`
        );
      } else if (error.request) {
        // Request was made but no response was received
        alert(
          "Error: No response received from the server. Please try again later."
        );
      } else {
        // Something else caused the error
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <form
      className="flex flex-wrap items-start justify-around max-w-6xl gap-4 p-6 mx-auto mt-6 bg-white rounded-lg shadow-lg"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          Item Code Entry
        </h2>
        <div className="flex w-full mb-4">
          <div className="relative flex-1 mr-4">
            <label className="block text-sm font-medium text-gray-700">
              Code
            </label>
            <input
              type="text"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={itemsState.code}
              onChange={(e) => handleItemsStateChange("code", e.target.value)}
              onBlur={handleCodeBlur} // Add this line
            />
            {itemsState.code && filteredCodeSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60">
                {filteredCodeSuggestions.map((option) => (
                  <li
                    key={option.value}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={itemsState.category}
              onChange={(e) =>
                handleItemsStateChange("category", e.target.value)
              }
            >
              <option value="" disabled>
                Select Category
              </option>
              {parentItemCodeCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex mb-4">
          <div className="flex-1 mr-4">
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <div className="flex mt-2 space-x-4">
              {["Service", "Rental", "Merchandise"].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value={option}
                    className="text-blue-600 form-radio"
                    checked={itemsState.type === option}
                    onChange={(e) =>
                      handleItemsStateChange("type", e.target.value)
                    }
                  />
                  <span className="ml-2 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Costing Department
            </label>
            <select
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={itemsState.costingDepartment}
              onChange={(e) =>
                handleItemsStateChange("costingDepartment", e.target.value)
              }
            >
              <option value="" disabled>
                Select Costing Department
              </option>
              {costingDepartmenCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex mb-4">
          <div className="flex-1 mr-4">
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
        </div>
        <TagInput
          tags={itemsState.tags}
          newTag={itemsState.newTag}
          handleTagChange={handleTagChange}
          handleRemoveTag={handleRemoveTag}
          handleNewTagChange={handleNewTagChange}
          handleAddTag={handleAddTag}
        />
        <div className="flex justify-start w-full">
          <button
            type="submit"
            className="w-32 px-4 py-2 mt-6 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end ">
        <label className="block w-full mb-12 text-xl font-medium text-left text-gray-700">
          Sub Items
        </label>
        {itemsState.subItems.map((subItem, subIndex) => (
          <SubItem
            key={subIndex}
            index={subIndex}
            subItem={subItem}
            item={itemsState}
            handleSubItemChange={handleSubItemChange}
            handleAddSubItemTag={handleAddSubItemTag}
            handleRemoveSubItemTag={handleRemoveSubItemTag}
            handleSubItemTagChange={handleSubItemTagChange}
            handleAddSubItemAssemblyId={handleAddSubItemAssemblyId}
            handleRemoveSubItemAssemblyId={handleRemoveSubItemAssemblyId}
            handleSubItemAssemblyIdChange={handleSubItemAssemblyIdChange}
            handleRemoveSubItem={handleRemoveSubItem}
          />
        ))}

        <button type="button" className="px-4 py-2" onClick={handleAddSubItem}>
          <PlusIcon color={"#2F6DFF"} style={"w-12 h-12 "} />
        </button>
      </div>
      <div className="flex flex-col items-end">
        <label className="block w-full mb-12 text-xl font-medium text-left text-gray-700">
          Pricing
        </label>
        {pricingLevels.map((pricingLevel, index) => (
          <PricingLevel
            key={index}
            index={index}
            pricingLevel={pricingLevel}
            handlePricingLevelChange={handlePricingLevelChange}
            handleRemovePricingLevel={handleRemovePricingLevel}
          />
        ))}
        <button
          type="button"
          className="flex items-center h-12 p-1 px-2 ml-2 "
          onClick={handleAddPricingLevel}
        >
          <PlusIcon color={"#2F6DFF"} style={"w-12 h-12 "} />
        </button>
      </div>
      <div className="w-96">{JSON.stringify(itemsState.subItems)}</div>
    </form>
  );
};

export default ItemCodeForm;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import SubItem from "./SubItem"; // Adjust the path as needed
// import TagInput from "./TagInput"; // Adjust the path as needed
// import PricingLevel from "./PricingLevel";
// import {
//   parentItemCodeCategories,
//   costingDepartmenCategories,
// } from "../../modules/dropdownValues";
// import { PlusIcon, XIcon } from "../../assets/icons";

// const initialFormState = {
//   code: "",
//   category: "",
//   type: "",
//   costingDepartment: "",
//   contractDescription: "",
//   tags: [],
//   newTag: "",
//   subItems: [
//     {
//       code: "",
//       category: "",
//       tags: [],
//       newTag: "",
//       assemblyIds: [],
//       newAssemblyId: "",
//     },
//   ],
// };

// const initialPricingState = [
//   {
//     unitPrice: "",
//     defaultQuantity: "",
//     minimumQuantity: "",
//     itemId: "",
//     levelName: "",
//     id: "",
//   },
// ];

// const ItemCodeForm: React.FC = () => {
//   const [itemsState, setItemsState] = useState(initialFormState);
//   const [pricingLevels, setPricingLevels] = useState(initialPricingState);
//   const [codeSuggestions, setCodeSuggestions] = useState<
//     { value: string; label: string }[]
//   >([]);
//   const [filteredCodeSuggestions, setFilteredCodeSuggestions] = useState<
//     { value: string; label: string }[]
//   >([]);

//   useEffect(() => {
//     // Fetch existing codes from the server
//     const fetchCodes = async () => {
//       try {
//         const response = await axios.get("/api/jobData/itemCodes");
//         const options = response.data.map((code: string) => ({
//           value: code.code,
//           label: code.code,
//         }));
//         setCodeSuggestions(options);
//       } catch (error) {
//         console.error("Error fetching item codes:", error);
//       }
//     };

//     fetchCodes();
//   }, []);

//   useEffect(() => {
//     if (itemsState.code) {
//       setFilteredCodeSuggestions(
//         codeSuggestions.filter((option) =>
//           option.label.toLowerCase().includes(itemsState.code.toLowerCase())
//         )
//       );
//     } else {
//       setFilteredCodeSuggestions(codeSuggestions);
//     }
//   }, [itemsState.code, codeSuggestions]);

//   const handlePricingLevelChange = (
//     index: number,
//     field: string,
//     value: string
//   ) => {
//     const newPricingLevels = [...pricingLevels];
//     newPricingLevels[index][field] = value;
//     setPricingLevels(newPricingLevels);
//   };

//   const handleAddPricingLevel = () => {
//     setPricingLevels([
//       ...pricingLevels,
//       {
//         unitPrice: "",
//         defaultQuantity: "",
//         minimumQuantity: "",
//         itemId: "",
//         levelName: "",
//         id: "",
//       },
//     ]);
//   };

//   const handleRemovePricingLevel = async (index: number) => {
//     const newPricingLevels = pricingLevels.filter((_, i) => i !== index);
//     const currentPricingLevel = pricingLevels.filter((_, i) => i === index);

//     console.log(currentPricingLevel);
//     try {
//       const response = await axios.delete(
//         `/api/jobData/priceLevel/${currentPricingLevel[0].id}`
//       );
//       const deletedItem = response.data;
//       console.log(deletedItem);
//     } catch (error) {
//       console.error("Error deleting price level:", error);
//     }
//     setPricingLevels(newPricingLevels);
//   };

//   const handleAddSubItem = () => {
//     setItemsState((prevState) => ({
//       ...prevState,
//       subItems: [
//         ...prevState.subItems,
//         {
//           code: "",
//           category: "",
//           tags: [],
//           newTag: "",
//           assemblyIds: [],
//           newAssemblyId: "",
//         },
//       ],
//     }));
//   };

//   const handleItemsStateChange = async (field: string, value: string) => {
//     setItemsState((prevState) => ({ ...prevState, [field]: value }));

//     if (field === "code") {
//       if (value === "") {
//         setFilteredCodeSuggestions([]);
//         setItemsState(initialFormState);
//         setPricingLevels(initialPricingState);
//         return;
//       }

//       setFilteredCodeSuggestions(
//         codeSuggestions.filter((option) =>
//           option.label.toLowerCase().includes(value.toLowerCase())
//         )
//       );

//       try {
//         const response = await axios.get(
//           `/api/jobData/itemCodes/${value.trim()}`
//         );
//         if (response.status === 200 && response.data) {
//           const existingItem = response.data;
//           setItemsState((prevState) => ({
//             ...prevState,
//             code: existingItem.code,
//             category: existingItem.category,
//             type: existingItem.type,
//             costingDepartment: existingItem.costingDepartment,
//             contractDescription: existingItem.contractDescription,
//             tags: existingItem.tags.map((tag) => tag.toLowerCase()), // Ensure tags are lowercase
//             subItems: existingItem.subItems.map((subItem: any) => ({
//               code: subItem.code,
//               category: subItem.category,
//               tags: subItem.tags.map((tag) => tag.toLowerCase()), // Ensure subitem tags are lowercase
//               newTag: "",
//               assemblyIds: subItem.assemblyIds,
//               newAssemblyId: "",
//             })),
//           }));
//           fetchPricingLevels(existingItem["_id"]);
//           console.log(existingItem["_id"]);
//         } else {
//           setItemsState((prevState) => ({
//             ...prevState,
//             category: "",
//             type: "",
//             costingDepartment: "",
//             contractDescription: "",
//             tags: [],
//             newTag: "",
//             subItems: initialFormState.subItems,
//           }));
//           setPricingLevels(initialPricingState);
//         }
//       } catch (error) {
//         if (error.response && error.response.status === 404) {
//           console.log("No item found");
//           setItemsState((prevState) => ({
//             ...prevState,
//             category: "",
//             type: "",
//             costingDepartment: "",
//             contractDescription: "",
//             tags: [],
//             newTag: "",
//             subItems: initialFormState.subItems,
//           }));
//           setPricingLevels(initialPricingState);
//         } else {
//           console.error("There was an error checking the Item Code:", error);
//         }
//       }
//     }
//   };

//   const handleCodeBlur = () => {
//     const words = itemsState.code.trim().split(" ");
//     setItemsState((prevState) => ({
//       ...prevState,
//       tags: [
//         ...new Set([
//           ...prevState.tags,
//           ...words.filter(Boolean).map((word) => word.toLowerCase()),
//         ]),
//       ], // Ensure tags are lowercase
//     }));
//   };

//   const fetchPricingLevels = async (itemId: string) => {
//     try {
//       const response = await axios.get(`/api/jobData/priceLevel/${itemId}`);
//       console.log(response.data);
//       if (response.status === 200 && response.data) {
//         if (Array.isArray(response.data)) {
//           setPricingLevels(
//             response.data.map((pricingLevel: any) => ({
//               unitPrice: (pricingLevel.unitPriceCents / 100).toFixed(2),
//               defaultQuantity: pricingLevel.defaultQuantity,
//               minimumQuantity: pricingLevel.minimumQuantity,
//               itemId: pricingLevel.itemId,
//               levelName: pricingLevel.level,
//               id: pricingLevel["_id"],
//             }))
//           );
//         } else {
//           setPricingLevels(initialPricingState); // If response data is not an array, reset to initial state
//         }
//       }
//     } catch (error) {
//       console.error("There was an error fetching the Pricing Levels:", error);
//       setPricingLevels(initialPricingState); // Reset to initial state on error
//     }
//   };

//   const handleSubItemChange = (index: number, field: string, value: string) => {
//     const newSubItems = [...itemsState.subItems];
//     newSubItems[index] = { ...newSubItems[index], [field]: value };
//     setItemsState((prevState) => ({ ...prevState, subItems: newSubItems }));

//     // Call lookup function for assembly ID
//     if (field === "newAssemblyId") {
//       lookupAssemblyById(value, index);
//     }
//   };

//   const lookupAssemblyById = async (assemblyId: string, subIndex: number) => {
//     // console.log(assemblyId);
//     try {
//       // Encode the assemblyId to handle special characters
//       const encodedAssemblyId = encodeURIComponent(assemblyId);
//       const response = await axios.get(
//         `/api/inventory/assembly/${encodedAssemblyId}`
//       );
//       if (response.status === 200 && response.data) {
//         const { _id } = response.data;

//         // Check if the _id already exists in any subItem's assemblyIds
//         const exists = itemsState.subItems.some((item) =>
//           item.assemblyIds.includes(_id)
//         );

//         if (!exists) {
//           const newSubItems = [...itemsState.subItems];
//           newSubItems[subIndex].assemblyIds.push(_id);
//           setItemsState((prevState) => ({
//             ...prevState,
//             subItems: newSubItems,
//           }));
//           alert("Assembly found and added!");
//         } else {
//           alert("Assembly already added");
//         }
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 404) {
//         alert("No assembly found with the given ID");
//       } else {
//         console.error("Error fetching assembly by ID:", error);
//       }
//     }
//   };

//   const handleTagChange = (index: number, value: string) => {
//     const newTags = [...itemsState.tags];
//     newTags[index] = value.toLowerCase();
//     setItemsState((prevState) => ({ ...prevState, tags: newTags }));
//   };

//   const handleRemoveTag = (index: number) => {
//     const newTags = itemsState.tags.filter((_, i) => i !== index);
//     setItemsState((prevState) => ({ ...prevState, tags: newTags }));
//   };

//   const handleNewTagChange = (value: string) => {
//     setItemsState((prevState) => ({
//       ...prevState,
//       newTag: value.toLowerCase(),
//     }));
//   };

//   const handleAddTag = () => {
//     if (itemsState.newTag) {
//       setItemsState((prevState) => ({
//         ...prevState,
//         tags: [...prevState.tags, prevState.newTag.toLowerCase()],
//         newTag: "",
//       }));
//     }
//   };

//   const handleSubItemTagChange = (
//     subIndex: number,
//     tagIndex: number,
//     value: string
//   ) => {
//     const newSubItems = [...itemsState.subItems];
//     newSubItems[subIndex].tags[tagIndex] = value.toLowerCase();
//     setItemsState((prevState) => ({ ...prevState, subItems: newSubItems }));
//   };

//   const handleRemoveSubItemTag = (subIndex: number, tagIndex: number) => {
//     const newSubItems = [...itemsState.subItems];
//     newSubItems[subIndex].tags = newSubItems[subIndex].tags.filter(
//       (_, i) => i !== tagIndex
//     );
//     setItemsState((prevState) => ({ ...prevState, subItems: newSubItems }));
//   };

//   const handleSubItemAssemblyIdChange = (
//     subIndex: number,
//     assemblyIdIndex: number,
//     value: string
//   ) => {
//     const newSubItems = [...itemsState.subItems];
//     newSubItems[subIndex].assemblyIds[assemblyIdIndex] = value;
//     setItemsState((prevState) => ({ ...prevState, subItems: newSubItems }));
//   };

//   const handleAddSubItemAssemblyId = (subIndex: number) => {
//     const newSubItems = [...itemsState.subItems];
//     if (newSubItems[subIndex].newAssemblyId) {
//       newSubItems[subIndex].assemblyIds.push(
//         newSubItems[subIndex].newAssemblyId
//       );
//       newSubItems[subIndex].newAssemblyId = "";
//       setItemsState((prevState) => ({ ...prevState, subItems: newSubItems }));
//     }
//   };

//   const handleRemoveSubItemAssemblyId = (
//     subIndex: number,
//     assemblyIdIndex: number
//   ) => {
//     const newSubItems = [...itemsState.subItems];
//     newSubItems[subIndex].assemblyIds = newSubItems[
//       subIndex
//     ].assemblyIds.filter((_, i) => i !== assemblyIdIndex);
//     setItemsState((prevState) => ({ ...prevState, subItems: newSubItems }));
//   };

//   const handleRemoveSubItem = (subIndex: number) => {
//     const newSubItems = itemsState.subItems.filter((_, i) => i !== subIndex);
//     setItemsState((prevState) => ({ ...prevState, subItems: newSubItems }));
//   };

//   const handleOptionSelect = (option: { value: string; label: string }) => {
//     handleItemsStateChange("code", option.label);
//     setFilteredCodeSuggestions([]);
//   };

//   const handleAddOption = () => {
//     if (
//       itemsState.code &&
//       !codeSuggestions.some((option) => option.value === itemsState.code)
//     ) {
//       const newOption = { value: itemsState.code, label: itemsState.code };
//       setCodeSuggestions((prevOptions) => [...prevOptions, newOption]);
//       handleItemsStateChange("code", itemsState.code);
//     }
//   };

//   const handleAddSubItemTag = (subIndex: number) => {
//     const newSubItems = [...itemsState.subItems];
//     if (newSubItems[subIndex].newTag) {
//       newSubItems[subIndex].tags.push(
//         newSubItems[subIndex].newTag.toLowerCase()
//       );
//       newSubItems[subIndex].newTag = "";
//       setItemsState((prevState) => ({ ...prevState, subItems: newSubItems }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await axios.put("/api/jobData/itemCodes", itemsState);

//       // Assuming the response contains the new item ID
//       const itemId = response.data["_id"];

//       // Update the pricing levels with the new item ID
//       const updatedPricingLevels = pricingLevels.map((pricingLevel) => ({
//         ...pricingLevel,
//         itemId: itemId,
//       }));

//       console.log(updatedPricingLevels);

//       // Send the updated pricing levels to the API
//       const pricingResponse = await axios.put(
//         "/api/jobData/priceLevel",
//         updatedPricingLevels
//       );

//       console.log(pricingResponse.data);

//       alert("Item Code and Pricing Levels saved successfully");
//       // Optionally, reset the form or provide additional feedback to the user here
//     } catch (error) {
//       console.error("There was an error saving the Item Code:", error);

//       // Display a more user-friendly error message
//       if (error.response) {
//         // Server responded with a status other than 2xx
//         alert(
//           `Error: ${error.response.data.error || error.response.statusText}`
//         );
//       } else if (error.request) {
//         // Request was made but no response was received
//         alert(
//           "Error: No response received from the server. Please try again later."
//         );
//       } else {
//         // Something else caused the error
//         alert(`Error: ${error.message}`);
//       }
//     }
//   };

//   return (
//     <form
//       className="flex flex-wrap items-start justify-around max-w-6xl gap-4 p-6 mx-auto mt-6 bg-white rounded-lg shadow-lg"
//       onSubmit={handleSubmit}
//     >
//       <div className="flex flex-col">
//         <h2 className="mb-6 text-2xl font-semibold text-gray-800">
//           Item Code Entry
//         </h2>
//         <div className="flex w-full mb-4">
//           <div className="relative flex-1 mr-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Code
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               value={itemsState.code}
//               onChange={(e) => handleItemsStateChange("code", e.target.value)}
//               onBlur={handleCodeBlur} // Add this line
//             />
//             {itemsState.code && filteredCodeSuggestions.length > 0 && (
//               <ul className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60">
//                 {filteredCodeSuggestions.map((option) => (
//                   <li
//                     key={option.value}
//                     className="p-2 cursor-pointer hover:bg-gray-100"
//                     onClick={() => handleOptionSelect(option)}
//                   >
//                     {option.label}
//                   </li>
//                 ))}
//               </ul>
//             )}
//             {/* not necessary? */}
//             {/* <button
//               type="button"
//               className="mt-2 text-sm text-blue-500"
//               onClick={handleAddOption}
//             >
//               Add "{itemsState.code}"
//             </button> */}
//           </div>
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700">
//               Category
//             </label>
//             <select
//               className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               value={itemsState.category}
//               onChange={(e) =>
//                 handleItemsStateChange("category", e.target.value)
//               }
//             >
//               <option value="" disabled>
//                 Select Category
//               </option>
//               {parentItemCodeCategories.map((category) => (
//                 <option key={category} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//         <div className="flex mb-4">
//           <div className="flex-1 mr-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Type
//             </label>
//             <div className="flex mt-2 space-x-4">
//               {["Service", "Rental", "Merchandise"].map((option) => (
//                 <label key={option} className="flex items-center">
//                   <input
//                     type="radio"
//                     name="type"
//                     value={option}
//                     className="text-blue-600 form-radio"
//                     checked={itemsState.type === option}
//                     onChange={(e) =>
//                       handleItemsStateChange("type", e.target.value)
//                     }
//                   />
//                   <span className="ml-2 text-gray-700">{option}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700">
//               Costing Department
//             </label>
//             <select
//               className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               value={itemsState.costingDepartment}
//               onChange={(e) =>
//                 handleItemsStateChange("costingDepartment", e.target.value)
//               }
//             >
//               <option value="" disabled>
//                 Select Costing Department
//               </option>
//               {costingDepartmenCategories.map((category) => (
//                 <option key={category} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//         <div className="flex mb-4">
//           <div className="flex-1 mr-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Contract Description
//             </label>
//             <textarea
//               className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               value={itemsState.contractDescription}
//               onChange={(e) =>
//                 handleItemsStateChange("contractDescription", e.target.value)
//               }
//             ></textarea>
//           </div>
//         </div>
//         <TagInput
//           tags={itemsState.tags}
//           newTag={itemsState.newTag}
//           handleTagChange={handleTagChange}
//           handleRemoveTag={handleRemoveTag}
//           handleNewTagChange={handleNewTagChange}
//           handleAddTag={handleAddTag}
//         />
//         <div className="flex justify-start w-full">
//           <button
//             type="submit"
//             className="w-32 px-4 py-2 mt-6 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
//           >
//             Submit
//           </button>
//         </div>
//       </div>

//       <div className="flex flex-col items-end ">
//         <label className="block w-full mb-12 text-xl font-medium text-left text-gray-700">
//           Sub Items
//         </label>
//         {itemsState.subItems.map((subItem, subIndex) => (
//           <SubItem
//             key={subIndex}
//             index={subIndex}
//             subItem={subItem}
//             item={itemsState}
//             handleSubItemChange={handleSubItemChange}
//             handleAddSubItemTag={handleAddSubItemTag}
//             handleRemoveSubItemTag={handleRemoveSubItemTag}
//             handleSubItemTagChange={handleSubItemTagChange}
//             handleAddSubItemAssemblyId={handleAddSubItemAssemblyId}
//             handleRemoveSubItemAssemblyId={handleRemoveSubItemAssemblyId}
//             handleSubItemAssemblyIdChange={handleSubItemAssemblyIdChange}
//             handleRemoveSubItem={handleRemoveSubItem}
//           />
//         ))}

//         <button type="button" className="px-4 py-2" onClick={handleAddSubItem}>
//           <PlusIcon color={"#2F6DFF"} style={"w-12 h-12 "} />
//         </button>
//       </div>
//       <div className="flex flex-col items-end">
//         <label className="block w-full mb-12 text-xl font-medium text-left text-gray-700">
//           Pricing
//         </label>
//         {pricingLevels.map((pricingLevel, index) => (
//           <PricingLevel
//             key={index}
//             index={index}
//             pricingLevel={pricingLevel}
//             handlePricingLevelChange={handlePricingLevelChange}
//             handleRemovePricingLevel={handleRemovePricingLevel}
//           />
//         ))}
//         <button
//           type="button"
//           className="flex items-center h-12 p-1 px-2 ml-2 "
//           onClick={handleAddPricingLevel}
//         >
//           <PlusIcon color={"#2F6DFF"} style={"w-12 h-12 "} />
//         </button>
//       </div>
//     </form>
//   );
// };

// export default ItemCodeForm;
