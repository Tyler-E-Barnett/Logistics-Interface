import React, { useRef, useEffect, useContext, useState } from "react";
import { JobContext } from "../../context/JobContext";
import { TimelineContext } from "../../context/TimelineContext";
import TimeBlockBasic from "../Common/TimeBlockBasic";
import AssemblyAssignmentForm from "./AssemblyAssignmentForm";
import axios from "axios";

// child of AssignedSubItem
const AssignedAssembly = ({ assembly, unavailDetail, onIsAssignedChange }) => {
  const { timelineWidth, setTimelineWidth } = useContext(TimelineContext)!;
  const { jobId, job } = useContext(JobContext)!;
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [timeBlockData, setTimeBlockData] = useState(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const isAssigned = assembly.timeblocks.some(
    (block) => block.contextKey === job.id
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
        setTimeBlockData(null);
        setShowDeleteButton(false);
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

  const handleAssemblyIdClick = () => {
    setTimeBlockData(null);
    setShowDeleteButton(false);
    setShowAssignmentForm(true);
  };

  const handleTimeBlockClick = async (blockId) => {
    try {
      const response = await axios.get(`/api/inventory/assignment/${blockId}`);
      setTimeBlockData(response.data);
      setShowDeleteButton(true);
      setShowAssignmentForm(true);
    } catch (error) {
      console.error("Error fetching time block data:", error);
    }
  };

  const isDown = assembly.status !== "Working" && assembly.status !== "Usable";

  const closeForm = () => {
    setShowAssignmentForm(false);
    setTimeBlockData(null);
    setShowDeleteButton(false);
  };

  return (
    <div className={`relative flex w-full rounded shadow`}>
      <button
        onClick={handleAssemblyIdClick}
        className={`px-3 py-1 w-24 text-white text-xs font-medium bg-gray-200 rounded-l ${statusFormat()}`}
      >
        {assembly.assemblyId}
      </button>

      <div
        ref={containerRef}
        className="relative flex flex-wrap items-center w-full bg-white border rounded"
      >
        {assembly.timeblocks.map((block) => (
          <button
            key={block._id}
            onClick={() => handleTimeBlockClick(block._id)}
            className="flex items-center h-full"
          >
            <TimeBlockBasic
              type={""}
              start={block.start}
              end={block.end}
              style={`${
                block.contextKey === job.id ? "bg-sky-500" : "bg-red-500"
              } flex z-30  hover:z-40 items-center shadow hover:brightness-125 border-black h-[20px] opacity-80`}
              title={`${block.fmRecordId}`}
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
          className="absolute z-50 p-4 bg-white border rounded shadow-lg "
        >
          <AssemblyAssignmentForm
            id={timeBlockData ? timeBlockData._id : assembly._id}
            contextType={"jobAssembly"}
            timeBlockData={timeBlockData}
            showDeleteButton={showDeleteButton}
            closeForm={closeForm}
          />
        </div>
      )}
    </div>
  );
};

export default AssignedAssembly;
