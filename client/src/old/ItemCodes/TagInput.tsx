import React from "react";
import { PlusIcon, XIcon } from "../../assets/icons";

const TagInput: React.FC<{
  tags: string[];
  newTag: string;
  handleTagChange: (index: number, value: string) => void;
  handleRemoveTag: (index: number) => void;
  handleNewTagChange: (value: string) => void;
  handleAddTag: () => void;
}> = ({
  tags,
  newTag,
  handleTagChange,
  handleRemoveTag,
  handleNewTagChange,
  handleAddTag,
}) => {
  return (
    <div className="mb-4">
      <label className="text-sm font-medium text-gray-700">Tags</label>
      <div className="flex items-center w-1/4 mt-2">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={newTag}
          onChange={(e) => handleNewTagChange(e.target.value)}
        />
        <button
          type="button"
          className="p-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleAddTag}
        >
          <PlusIcon color={"#00B41E"} style={"w-6 h-6"} />
        </button>
      </div>
      <div className="flex flex-wrap w-full gap-4">
        {tags.map((tag, index) => (
          <div key={index} className="flex items-center mt-2">
            <input
              type="text"
              className="w-24 h-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={tag}
              onChange={(e) => handleTagChange(index, e.target.value)}
            />
            <button
              type="button"
              className="p-1 rounded-md  focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => handleRemoveTag(index)}
            >
              <XIcon color={"#000000"} style={"w-6 h-6"} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
