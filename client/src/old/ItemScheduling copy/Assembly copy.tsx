import React, { useEffect, useState, useContext } from "react";
import fetchTimeblocks from "../../Components/Common/fetchTimeblocks";
import { JobContext } from "../../context/JobContext";

const Assembly = ({ assembly, itemCode, onAvailabilityChange }) => {
  const [data, setData] = useState(null);
  const jobContext = useContext(JobContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contextType = "jobAssembly";
        const itemId = assembly.fmRecordId;

        const start = jobContext?.jobStart;
        const end = jobContext?.jobEnd;

        if (start && end) {
          const result = await fetchTimeblocks(contextType, itemId, start, end);
          setData(result);
        } else {
          console.error("Start and end dates are required");
        }
      } catch (error) {
        console.error("Error fetching timeblocks:", error);
      }
    };

    fetchData();
  }, [assembly.fmRecordId, jobContext?.jobStart, jobContext?.jobEnd, itemCode]);

  const isUnavailable = (block) => {
    const blockStart = new Date(block.start);
    const blockEnd = new Date(block.end);
    const jobStart = new Date(jobContext?.jobStart);
    const jobEnd = new Date(jobContext?.jobEnd);

    const overlapUnavailable =
      block.contextKey !== jobContext?.jobId &&
      blockStart <= jobEnd &&
      blockEnd >= jobStart;

    const statusUnavailable =
      assembly.status !== "Working" && assembly.status !== "Usable";

    return overlapUnavailable || statusUnavailable;
  };

  useEffect(() => {
    if (data) {
      const unavailable = data.some(isUnavailable);
      onAvailabilityChange(unavailable);
    } else {
      const statusUnavailable =
        assembly.status !== "Working" && assembly.status !== "Usable";
      onAvailabilityChange(statusUnavailable);
    }
  }, [data]);

  return (
    <div className="flex flex-col w-full p-2 mb-2 bg-white rounded shadow">
      <div className="flex flex-wrap items-center gap-2">
        <div className="px-2 py-1 text-sm font-medium bg-gray-200 rounded">
          {assembly.assemblyId}
        </div>
        <div
          className={`px-2 py-1 text-sm font-medium ${
            assembly.status !== "Working" && assembly.status !== "Usable"
              ? "text-red-500"
              : "text-green-500"
          }`}
        >
          {assembly.status}
        </div>
      </div>
      {data &&
        data.map((block) => (
          <div key={block._id} className="mt-2">
            {isUnavailable(block) ? (
              <div className="text-red-500">
                <span className="font-bold">Unavailable</span> - Assembly
                assigned to job# {block.contextKey} from{" "}
                {new Date(block.start).toLocaleString("en-US")} to{" "}
                {new Date(block.end).toLocaleString("en-US")}
              </div>
            ) : (
              <div className="text-blue-500">
                Assembly assigned to this job from{" "}
                {new Date(block.start).toLocaleString("en-US")} to{" "}
                {new Date(block.end).toLocaleString("en-US")}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default Assembly;
