import React, { useRef, useEffect, useContext, useState } from "react";
import { JobContext } from "../../context/JobContext";
import { TimelineContext } from "../../context/TimelineContext";
import TimeBlockBasic from "../../Components/Common/TimeBlockBasic";
import AssemblyAssignmentForm from "./AssemblyAssignmentForm";

const AssignedAssembly = ({ assembly, unavailDetail }) => {
  const { timelineWidth, setTimelineWidth } = useContext(TimelineContext)!;
  const { jobId, update } = useContext(JobContext)!;
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  const isAssigned = assembly.timeblocks.some(
    (block) => block.contextKey === jobId
  );

  const statusFormat = () => {
    if (isAssigned) {
      return "bg-sky-500";
    }
    if (unavailDetail) {
      return "bg-red-500";
    }
    return "bg-green-500";
  };

  // useEffect(() => {
  //   console.log("re-rendering assigned assemblies");
  // }, [update]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setTimelineWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [containerRef, setTimelineWidth]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowAssignmentForm(false);
      }
    };

    if (showAssignmentForm) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAssignmentForm]);

  const isDown = assembly.status !== "Working" && assembly.status !== "Usable";

  return (
    <div className={`relative flex w-full rounded shadow`}>
      <button
        onClick={() => setShowAssignmentForm(!showAssignmentForm)}
        className={`px-3 py-1 w-24 text-white text-xs font-medium bg-gray-200 rounded-l ${statusFormat()}`}
      >
        {assembly.assemblyId}
      </button>

      <div
        ref={containerRef}
        className="relative flex flex-wrap w-full bg-white border rounded"
      >
        {assembly.timeblocks.map((block) => (
          <button>
            <TimeBlockBasic
              key={block._id}
              type={""}
              start={block.start}
              end={block.end}
              style={`${
                block.contextKey === jobId ? "bg-sky-500" : "bg-red-500"
              } flex z-30 top-[1px] hover:z-40 items-center shadow border-black h-[20px] opacity-80`}
              title={`${block.contextKey}`}
              timeLineWidth={timelineWidth}
            />
          </button>
        ))}
      </div>
      {isDown && (
        <div className="absolute inset-0 z-40 flex items-center justify-center font-bold text-white bg-black bg-opacity-75 rounded">
          DOWN
        </div>
      )}
      {showAssignmentForm && (
        <div
          ref={formRef}
          className="absolute z-50 p-4 bg-white border rounded shadow-lg"
        >
          <AssemblyAssignmentForm
            id={assembly._id}
            contextType={"jobAssembly"}
          />
        </div>
      )}
    </div>
  );
};

export default AssignedAssembly;
