// import React, { useState, useEffect } from "react";
// import { PlusIcon, XIcon } from "../../assets/icons";
// import { equipmentOptions } from "../../modules/dropdownValues";
// import axios from "axios";

// interface SubItemProps {
//   index: number;
//   subItem: {
//     code: string;
//     category: string;
//     tags: string[];
//     newTag: string;
//     assemblyIds: string[];
//     newAssemblyId: string;
//   };
//   item: any;
//   handleSubItemChange: (index: number, field: string, value: string) => void;
//   handleAddSubItemTag: (index: number) => void;
//   handleRemoveSubItemTag: (index: number, tagIndex: number) => void;
//   handleSubItemTagChange: (
//     index: number,
//     tagIndex: number,
//     value: string
//   ) => void;
//   handleAddSubItemAssemblyId: (index: number) => void;
//   handleRemoveSubItemAssemblyId: (
//     index: number,
//     assemblyIdIndex: number
//   ) => void;
//   handleSubItemAssemblyIdChange: (
//     index: number,
//     assemblyIdIndex: number,
//     value: string
//   ) => void;
//   handleRemoveSubItem: (index: number) => void;
// }

const SubItem: React.FC<SubItemProps> = ({
  index,
  subItem,
  item,
  handleSubItemChange,
  handleAddSubItemTag,
  handleRemoveSubItemTag,
  handleSubItemTagChange,
  handleAddSubItemAssemblyId,
  handleRemoveSubItemAssemblyId,
  handleSubItemAssemblyIdChange,
  handleRemoveSubItem,
}) => {
//   const [assemblyOptions, setAssemblyOptions] = useState<
//     { _id: string; assemblyId: string }[]
//   >([]);
//   const [assemblyNames, setAssemblyNames] = useState<string[]>([]);
//   const [subItemCodeSuggestions, setSubItemCodeSuggestions] = useState<
//     { _id: string; code: string }[]
//   >([]);
//   const [filteredSubItemCodeSuggestions, setFilteredSubItemCodeSuggestions] =
//     useState<{ _id: string; code: string }[]>([]);

//   const [currentCode, setCurrentCode] = useState("");

//   useEffect(() => {
//     if (subItem.category) {
//       fetchAssembliesByCategory(subItem.category);
//     }
//   }, [subItem.category]);

//   useEffect(() => {
//     const fetchAssemblyNames = async () => {
//       const names = await Promise.all(
//         subItem.assemblyIds.map((id) => lookupAssemblyById(id))
//       );
//       setAssemblyNames(names);
//       console.log("assembly names", names, subItem);
//     };
//     fetchAssemblyNames();
//   }, [subItem.code, item]);

//   useEffect(() => {
//     if (subItem.category) {
//       fetchSubItemCodes(subItem.category);
//     } else {
//       fetchSubItemCodes();
//     }
//   }, [subItem.category]);

//   const fetchAssembliesByCategory = async (category: string) => {
//     try {
//       const response = await axios.get(
//         `/api/inventory/assemblies/category/${category}`
//       );
//       if (response.status === 200 && response.data) {
//         setAssemblyOptions(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching assemblies by category:", error);
//     }
//   };

//   const fetchSubItemCodes = async (category?: string) => {
//     try {
//       const response = await axios.get("/api/jobData/subItemCodes", {
//         params: {
//           category,
//         },
//       });
//       if (response.status === 200 && response.data) {
//         setSubItemCodeSuggestions(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching subitem codes:", error);
//     }
//   };

//   const lookupAssemblyById = async (assemblyId: string) => {
//     if (!assemblyId) return null;
//     try {
//       const response = await axios.get(
//         `/api/inventory/assembly/lookup/${assemblyId}`
//       );
//       if (response.status === 200 && response.data) {
//         return response.data.assemblyId;
//       }
//     } catch (error) {
//       console.error("Error fetching assembly by ID:", error);
//     }
//   };

//   const handleSubItemCodeChange = async (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const value = e.target.value;
//     handleSubItemChange(index, "code", value);

//     if (value.length > 1) {
//       const filteredSuggestions = subItemCodeSuggestions.filter((code) =>
//         code.code.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredSubItemCodeSuggestions(filteredSuggestions);
//     } else {
//       setFilteredSubItemCodeSuggestions([]);
//     }
//   };

//   const handleSelectSubItemCode = async (code: string) => {
//     setCurrentCode(code)
//     try {
//       const response = await axios.get(
//         `/api/jobData/subItemDetails/code/${code}`
//       );
//       if (response.status === 200 && response.data) {
//         const subItemData = response.data;
//         console.log(subItemData);

//         // Extract assembly names (assemblyId) from the fetched assemblies
//         const assemblyNames = subItemData.assemblies.map(
//           (assembly) => assembly.assemblyId
//         );

//         // Update subItem state with fetched data
//         handleSubItemChange(index, "code", subItemData.code);
//         handleSubItemChange(index, "category", subItemData.category);
//         handleSubItemChange(
//           index,
//           "tags",
//           subItemData.tags.map((tag) => tag.toLowerCase())
//         );
//         handleSubItemChange(
//           index,
//           "assemblyIds",
//           subItemData.assemblies.map((assembly) => assembly._id)
//         );

//         // Set assembly names directly from fetched assemblies
//         setAssemblyNames(assemblyNames);

//         // Clear filtered suggestions
//         setFilteredSubItemCodeSuggestions([]);
//       }
//     } catch (error) {
//       console.error("Error fetching subitem by code:", error);
//     }
//   };

//   const handleSelectAssemblyId = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedAssemblyId = e.target.value;
//     if (selectedAssemblyId) {
//       handleSubItemChange(index, "assemblyIds", [
//         ...subItem.assemblyIds,
//         selectedAssemblyId,
//       ]);
//       handleSubItemChange(index, "newAssemblyId", selectedAssemblyId);
//     }
//   };

//   return (
//     <div className="relative flex flex-col items-start justify-start gap-4 p-4 mb-4 border rounded-md shadow-xl bg-secondary border-sky-500">
//       <div className="mb-2">
//         <label className="block text-sm font-medium text-gray-700">
//           Sub-Code
//         </label>
//         <input
//           type="text"
//           className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//           value={subItem.code}
//           onChange={handleSubItemCodeChange}
//         />
//         {filteredSubItemCodeSuggestions.length > 0 && (
//           <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-32">
//             {filteredSubItemCodeSuggestions.map((suggestion) => (
//               <li
//                 key={suggestion._id}
//                 className="p-2 cursor-pointer hover:bg-gray-100"
//                 onClick={() => handleSelectSubItemCode(suggestion.code)}
//               >
//                 {suggestion.code}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//       <div className="mb-2">
//         <label className="block text-sm font-medium text-gray-700">
//           Category
//         </label>
//         <select
//           className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//           value={subItem.category}
//           onChange={(e) =>
//             handleSubItemChange(index, "category", e.target.value)
//           }
//         >
//           <option value="" disabled>
//             Select Category
//           </option>
//           <option value="">None</option>
//           {equipmentOptions.map((category) => (
//             <option key={category} value={category}>
//               {category}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="w-full p-2 mb-2 border rounded">
//         <label className="block text-sm font-medium text-gray-700">Tags</label>
//         <div className="flex items-center ">
//           <input
//             type="text"
//             className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             value={subItem.newTag}
//             onChange={(e) =>
//               handleSubItemChange(index, "newTag", e.target.value)
//             }
//           />
//           <button
//             type="button"
//             className="p-1"
//             onClick={() => handleAddSubItemTag(index)}
//           >
//             <PlusIcon color={"#2573D9"} style={"h-6 w-6"} />
//           </button>
//         </div>
//         {subItem.tags.map((tag, tagIndex) => (
//           <div key={tagIndex} className="flex items-center mt-2">
//             <input
//               type="text"
//               className="w-1/2 p-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               value={tag}
//               onChange={(e) =>
//                 handleSubItemTagChange(index, tagIndex, e.target.value)
//               }
//             />
//             <button
//               type="button"
//               className="p-1"
//               onClick={() => handleRemoveSubItemTag(index, tagIndex)}
//             >
//               <XIcon color={"#000000"} style={"h-8 w-8"} />
//             </button>
//           </div>
//         ))}
//       </div>
//       <div className="relative w-full p-2 border rounded">
//         <label className="block text-sm font-medium text-gray-700">
//           Assembly ID
//         </label>
//         <div className="flex items-end ">
//           <select
//             className="w-full p-2 border border-gray-300 rounded-md"
//             value={subItem.newAssemblyId}
//             onChange={handleSelectAssemblyId}
//           >
//             <option value="" disabled>
//               Select Assembly
//             </option>
//             {assemblyOptions.map((assembly) => (
//               <option key={assembly._id} value={assembly._id}>
//                 {assembly.assemblyId}
//               </option>
//             ))}
//           </select>
//           <button
//             type="button"
//             className="p-1"
//             onClick={() => handleAddSubItemAssemblyId(index)}
//           >
//             <PlusIcon color={"#2573D9"} style={"h-6 w-6"} />
//           </button>
//         </div>
//         <div className="w-3/4 mt-2 ml-2 overflow-scroll max-h-32">
//           {assemblyNames?.map((assemblyId, assemblyIdIndex) => (
//             <div
//               key={assemblyIdIndex}
//               className="flex items-center justify-between gap-2"
//             >
//               <div className="w-full pl-1 rounded bg-slate-100">
//                 {assemblyId}
//               </div>
//               <button
//                 type="button"
//                 className="w-8 h-8 p-1 ml-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
//                 onClick={() =>
//                   handleRemoveSubItemAssemblyId(index, assemblyIdIndex)
//                 }
//               >
//                 <XIcon color={"#000000"} />
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//       <button
//         type="button"
//         className="absolute top-0 right-0 flex items-center w-10 h-10 p-2 ml-2"
//         onClick={() => handleRemoveSubItem(index)}
//       >
//         <XIcon color={"#000000"} />
//       </button>
//     </div>
//   );
// };

// export default SubItem;

import React, { useState, useEffect } from "react";
import { PlusIcon, XIcon } from "../../assets/icons";
import { equipmentOptions } from "../../modules/dropdownValues";
import axios from "axios";

interface SubItemProps {
  index: number;
  subItem: {
    code: string;
    category: string;
    tags: string[];
    newTag: string;
    assemblyIds: string[];
    newAssemblyId: string;
  };
  handleSubItemChange: (index: number, field: string, value: string) => void;
  handleAddSubItemTag: (index: number) => void;
  handleRemoveSubItemTag: (index: number, tagIndex: number) => void;
  handleSubItemTagChange: (
    index: number,
    tagIndex: number,
    value: string
  ) => void;
  handleAddSubItemAssemblyId: (index: number) => void;
  handleRemoveSubItemAssemblyId: (
    index: number,
    assemblyIdIndex: number
  ) => void;
  handleSubItemAssemblyIdChange: (
    index: number,
    assemblyIdIndex: number,
    value: string
  ) => void;
  handleRemoveSubItem: (index: number) => void;
}

const SubItem: React.FC<SubItemProps> = ({
  index,
  subItem,
  item,
  handleSubItemChange,
  handleAddSubItemTag,
  handleRemoveSubItemTag,
  handleSubItemTagChange,
  handleAddSubItemAssemblyId,
  handleRemoveSubItemAssemblyId,
  handleSubItemAssemblyIdChange,
  handleRemoveSubItem,
}) => {
  const [assemblyOptions, setAssemblyOptions] = useState<
    { _id: string; assemblyId: string }[]
  >([]);
  const [assemblyNames, setAssemblyNames] = useState<string[]>([]);
  const [subItemCodeSuggestions, setSubItemCodeSuggestions] = useState<
    { _id: string; code: string }[]
  >([]);
  const [filteredSubItemCodeSuggestions, setFilteredSubItemCodeSuggestions] =
    useState<{ _id: string; code: string }[]>([]);

  useEffect(() => {
    if (subItem.category) {
      fetchAssembliesByCategory(subItem.category);
    }
  }, [subItem.category]);

  useEffect(() => {
    const fetchAssemblyNames = async () => {
      const names = await Promise.all(
        subItem.assemblyIds.map((id) => lookupAssemblyById(id))
      );
      setAssemblyNames(names);
      console.log("assembly names", names, subItem);
    };
    fetchAssemblyNames();
  }, [subItem.code, item]);

  useEffect(() => {
    if (subItem.category) {
      fetchSubItemCodes(subItem.category);
    } else {
      fetchSubItemCodes();
    }
  }, [subItem.category]);

  const fetchAssembliesByCategory = async (category: string) => {
    try {
      const response = await axios.get(
        `/api/inventory/assemblies/category/${category}`
      );
      if (response.status === 200 && response.data) {
        setAssemblyOptions(response.data);
      }
    } catch (error) {
      console.error("Error fetching assemblies by category:", error);
    }
  };

  const fetchSubItemCodes = async (category?: string) => {
    try {
      const response = await axios.get("/api/jobData/subItemCodes", {
        params: {
          category,
        },
      });
      if (response.status === 200 && response.data) {
        setSubItemCodeSuggestions(response.data);
      }
    } catch (error) {
      console.error("Error fetching subitem codes:", error);
    }
  };

  const lookupAssemblyById = async (assemblyId: string) => {
    if (!assemblyId) return null;
    try {
      const response = await axios.get(
        `/api/inventory/assembly/lookup/${assemblyId}`
      );
      if (response.status === 200 && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching assembly by ID:", error);
    }
  };

  const handleSubItemCodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    handleSubItemChange(index, "code", value);

    if (value.length > 1) {
      const filteredSuggestions = subItemCodeSuggestions.filter((code) =>
        code.code.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSubItemCodeSuggestions(filteredSuggestions);
    } else {
      setFilteredSubItemCodeSuggestions([]);
    }
  };

  const handleSelectSubItemCode = (code: string) => {
    // Check if the subitem code already exists in itemsState
    const subItemExists = item.subItems.some(
      (subItem) => subItem.code.toLowerCase() === code.toLowerCase()
    );

    // handleSubItemChange(index, "code", code);
    // setFilteredSubItemCodeSuggestions([]);

    if (subItemExists) {
      alert("Subitem code already exists");
    } else {
      handleSubItemChange(index, "code", code);
      setFilteredSubItemCodeSuggestions([]);
    }
  };

  const handleSelectAssemblyId = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAssemblyId = e.target.value;
    if (selectedAssemblyId) {
      handleSubItemChange(index, "assemblyIds", [
        ...subItem.assemblyIds,
        selectedAssemblyId,
      ]);
      handleSubItemChange(index, "newAssemblyId", selectedAssemblyId);
    }
  };

  return (
    <div className="relative flex flex-col items-start justify-start gap-4 p-4 mb-4 border rounded-md shadow-xl bg-secondary border-sky-500">
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Sub-Code
        </label>
        <input
          type="text"
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={subItem.code}
          onChange={handleSubItemCodeChange}
        />
        {filteredSubItemCodeSuggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-32">
            {filteredSubItemCodeSuggestions.map((suggestion) => (
              <li
                key={suggestion._id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectSubItemCode(suggestion.code)}
              >
                {suggestion.code}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={subItem.category}
          onChange={(e) =>
            handleSubItemChange(index, "category", e.target.value)
          }
        >
          <option value="" disabled>
            Select Category
          </option>
          <option value="">None</option>
          {equipmentOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full p-2 mb-2 border rounded">
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <div className="flex items-center ">
          <input
            type="text"
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={subItem.newTag}
            onChange={(e) =>
              handleSubItemChange(index, "newTag", e.target.value)
            }
          />
          <button
            type="button"
            className="p-1"
            onClick={() => handleAddSubItemTag(index)}
          >
            <PlusIcon color={"#2573D9"} style={"h-6 w-6"} />
          </button>
        </div>
        {subItem.tags.map((tag, tagIndex) => (
          <div key={tagIndex} className="flex items-center mt-2">
            <input
              type="text"
              className="w-1/2 p-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={tag}
              onChange={(e) =>
                handleSubItemTagChange(index, tagIndex, e.target.value)
              }
            />
            <button
              type="button"
              className="p-1"
              onClick={() => handleRemoveSubItemTag(index, tagIndex)}
            >
              <XIcon color={"#000000"} style={"h-8 w-8"} />
            </button>
          </div>
        ))}
      </div>
      <div className="relative w-full p-2 border rounded">
        <label className="block text-sm font-medium text-gray-700">
          Assembly ID
        </label>
        <div className="flex items-end ">
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={subItem.newAssemblyId}
            onChange={handleSelectAssemblyId}
          >
            <option value="" disabled>
              Select Assembly
            </option>
            {assemblyOptions.map((assembly) => (
              <option key={assembly._id} value={assembly.assemblyId}>
                {assembly.assemblyId}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="p-1"
            onClick={() => handleAddSubItemAssemblyId(index)}
          >
            <PlusIcon color={"#2573D9"} style={"h-6 w-6"} />
          </button>
        </div>
        <div className="w-3/4 mt-2 ml-2 overflow-scroll max-h-32">
          {assemblyNames?.map((assembly, assemblyIdIndex) => (
            <div
              key={assemblyIdIndex}
              className="flex items-center justify-between gap-2"
            >
              <div className="w-full pl-1 rounded bg-slate-100">
                {assembly.assemblyId}
              </div>
              <button
                type="button"
                className="w-8 h-8 p-1 ml-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={() =>
                  handleRemoveSubItemAssemblyId(index, assemblyIdIndex)
                }
              >
                <XIcon color={"#000000"} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="absolute top-0 right-0 flex items-center w-10 h-10 p-2 ml-2"
        onClick={() => handleRemoveSubItem(index)}
      >
        <XIcon color={"#000000"} />
      </button>
    </div>
  );
};

export default SubItem;
