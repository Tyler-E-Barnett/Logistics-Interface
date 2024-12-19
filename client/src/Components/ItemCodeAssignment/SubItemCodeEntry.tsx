import React, { useState, useEffect } from "react";
import { equipmentOptions } from "../../modules/dropdownValues";
import axios from "axios";
import { PlusIcon, RefreshIcon } from "../../assets/icons";

const SubItemCodeEntry: React.FC = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [assemblies, setAssemblies] = useState<
    { _id: string; assemblyId: string }[]
  >([]);
  const [newAssembly, setNewAssembly] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [assemblyOptions, setAssemblyOptions] = useState<any[]>([]);
  const [selectedAssemblyIds, setSelectedAssemblyIds] = useState<string[]>([]);
  const [subCodes, setSubCodes] = useState<any[]>([]);
  const [filteredSubCodes, setFilteredSubCodes] = useState<any[]>([]);
  const [subCode, setSubCode] = useState<string>("");

  useEffect(() => {
    const fetchSubCodes = async () => {
      try {
        const response = await axios.get("/api/jobData/subItemCodes");
        setSubCodes(response.data);
      } catch (error) {
        console.error("Error fetching sub codes:", error);
      }
    };

    fetchSubCodes();
  }, []);

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const resetForm = () => {
    setSubCode("");
    setSelectedCategory("");
    setTags([]);
    setAssemblies([]);
    setSelectedAssemblyIds([]);
    setNewTag("");
    setNewAssembly("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const addAssembly = () => {
    const selectedAssembly = assemblyOptions.find(
      (option) => option._id === newAssembly
    );
    if (
      selectedAssembly &&
      !selectedAssemblyIds.includes(selectedAssembly._id)
    ) {
      setAssemblies([
        ...assemblies,
        { _id: selectedAssembly._id, assemblyId: selectedAssembly.assemblyId },
      ]);
      setSelectedAssemblyIds([...selectedAssemblyIds, selectedAssembly._id]);
      setNewAssembly("");
    }
  };

  const removeAssembly = (assemblyId: string) => {
    setAssemblies(assemblies.filter((assembly) => assembly._id !== assemblyId));
    setSelectedAssemblyIds(
      selectedAssemblyIds.filter((id) => id !== assemblyId)
    );
  };

  useEffect(() => {
    const fetchAssemblies = async () => {
      if (selectedCategory) {
        try {
          const response = await axios.get(
            `/api/inventory/assemblies/category/${selectedCategory}`
          );
          setAssemblyOptions(response.data);
        } catch (error) {
          console.error("Error fetching assemblies:", error);
        }
      } else {
        setAssemblyOptions([]);
      }
    };

    fetchAssemblies();
  }, [selectedCategory]);

  useEffect(() => {
    const filterSubCodes = () => {
      if (subCode) {
        setFilteredSubCodes(
          subCodes.filter((subCodeItem) =>
            subCodeItem.code.toLowerCase().includes(subCode.toLowerCase())
          )
        );
      } else {
        setFilteredSubCodes([]);
      }
    };

    filterSubCodes();
  }, [subCode, subCodes]);

  const handleSubCodeSelect = async (selectedSubCode: string) => {
    const selectedItem = subCodes.find((item) => item.code === selectedSubCode);
    if (selectedItem) {
      resetForm();
      setSubCode(selectedItem.code);
      setSelectedCategory(selectedItem.category);
      setTags(selectedItem.tags);

      try {
        const ids = { ids: selectedItem.assemblyIds };
        const assemblyResponse = await axios.post(
          `/api/inventory/assemblies`,
          ids
        );
        setAssemblyOptions(assemblyResponse.data);
        const selectedAssemblies = assemblyResponse.data.filter((assembly) =>
          selectedItem.assemblyIds.includes(assembly._id)
        );
        setAssemblies(
          selectedAssemblies.map((assembly) => ({
            _id: assembly._id,
            assemblyId: assembly.assemblyId,
          }))
        );
        setSelectedAssemblyIds(
          selectedAssemblies.map((assembly) => assembly._id)
        );
      } catch (error) {
        console.error("Error fetching assemblies:", error);
      }
    }
  };

  const handleSubCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSubCode(value);
    if (value === "") {
      resetForm(); // Clear the form if sub-code is cleared
    }
  };

  const handleSubCodeBlur = () => {
    if (subCode) {
      handleSubCodeSelect(subCode);
      const words = subCode.split(" ");
      const newTags = words.filter((word) => !tags.includes(word));
      setTags((prevTags) => [...prevTags, ...newTags]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      code: subCode,
      category: selectedCategory,
      tags,
      assemblyIds: selectedAssemblyIds,
    };

    try {
      const response = await axios.put("/api/jobData/subItemCode/entry", data);
      console.log("Sub item code submitted successfully:", response.data);
      alert("Sub item code submitted successfully");
      resetForm();
    } catch (error) {
      console.error("Error submitting sub item code:", error);
      alert("Error submitting sub item code");
    }
  };

  return (
    <form
      className="max-w-lg p-6 mx-auto space-y-4 bg-white rounded-lg shadow-md"
      onSubmit={handleSubmit}
    >
      <button type="button" onClick={() => resetForm()}>
        <RefreshIcon style={"w-6 h-6"} />
      </button>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Sub-Code
        </label>
        <input
          type="text"
          value={subCode}
          onChange={handleSubCodeChange}
          onBlur={handleSubCodeBlur}
          className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          list="subCodeOptions"
        />
        <datalist id="subCodeOptions">
          {filteredSubCodes.map((subCodeItem) => (
            <option key={subCodeItem._id} value={subCodeItem.code}>
              {subCodeItem.code}
            </option>
          ))}
        </datalist>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="" disabled>
            Select a Category...
          </option>
          {equipmentOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Assemblies
        </label>
        <div className="flex mt-1 space-x-2">
          <select
            value={newAssembly}
            onChange={(e) => setNewAssembly(e.target.value)}
            className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="" disabled>
              Select an Assembly...
            </option>
            {assemblyOptions.map((option) => (
              <option key={option._id} value={option._id}>
                {option.assemblyId}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addAssembly}
            className="rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon
              style={"w-10 h-10 rounded-full hover:bg-sky-100"}
              color={"#5046e6"}
            />
          </button>
        </div>
        <div className="mt-2 space-x-2">
          {assemblies.map((assembly) => (
            <span
              key={assembly._id}
              className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
            >
              {assembly.assemblyId}
              <button
                type="button"
                onClick={() => removeAssembly(assembly._id)}
                className="ml-2 text-indigo-600 hover:text-indigo-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <div className="flex mt-1 space-x-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onBlur={addTag}
            className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <button
            type="button"
            onClick={addTag}
            className="rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
              className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
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

export default SubItemCodeEntry;
