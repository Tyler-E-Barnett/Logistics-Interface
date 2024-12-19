import { useContext } from "react";
import { JobContext } from "../../context/JobContext";

const JobItem = ({ item, isActive, onClick }) => {
  const { setJobItemId } = useContext(JobContext);

  const handleClick = () => {
    setJobItemId(item.jobItemId);
    console.log("Clicked Job Item ID:", item.jobItemId);
    onClick();
  };

  console.log("Job Item ID:", item.jobItemId, "isActive:", isActive); // Debugging output

  return (
    <div className="relative flex w-full">
      <button
        className={`p-2 text-sm rounded-lg hover:brightness-110 transition-colors duration-300 ${
          isActive ? "bg-green-400 w-full" : "bg-gray-200"
        }`}
        onClick={handleClick}
      >
        {item.code}
      </button>
      {isActive && (
        <div className="absolute w-full h-2 transform -translate-y-1/2 bg-green-400 top-1/2 left-full"></div>
      )}
    </div>
  );
};

export default JobItem;
