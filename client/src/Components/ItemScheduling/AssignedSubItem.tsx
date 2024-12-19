import { useState, useContext, useEffect, useRef } from "react";
import AssignedAssembly from "./AssignedAssembly";
import { TimelineContext } from "../../context/TimelineContext";
import { LeftCarrot, DownCarrot } from "../../assets/icons";
import TimeBlockContainerDynamic from "../Common/TimeBlockContainerDynamic";
import { JobContext } from "../../context/JobContext";
import TimeBlockBasic from "../Common/TimeBlockBasic";

// Child of assignedCodeDetails
const AssignedSubItem = ({ details }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [sortCriterion, setSortCriterion] = useState("");
  const [parentHeight, setParentHeight] = useState(0);
  const parentRef = useRef(null);
  const { timelineWidth } = useContext(TimelineContext)!;
  const { jobId, jobStart, jobEnd, update, job } = useContext(JobContext)!;

  const {
    totalAssemblies,
    unavailableAssemblies,
    availableAssemblies,
    unavailableDetails,
  } = details.availability;

  // Perform flatMap operation
  const assignedTimeBlocks = details.assemblies.flatMap((assembly) =>
    assembly.timeblocks.filter((block) => block.contextKey === job.id)
  );

  console.log(details.quantity);

  const getColor = (availableRatio) => {
    if (
      assignedTimeBlocks.length > 0 &&
      assignedTimeBlocks.length < details.quantity
    ) {
      return "bg-violet-500";
    }
    if (assignedTimeBlocks.length > 0) {
      return "bg-sky-500";
    }

    if (availableRatio >= 0.75) return "bg-green-500";
    if (availableRatio >= 0.5) return "bg-yellow-500";
    if (availableRatio >= 0.25) return "bg-orange-500";
    return "bg-red-500";
  };

  const availableRatio = availableAssemblies / totalAssemblies;
  const colorClass = getColor(availableRatio);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // useEffect(() => {
  //   console.log("re-rendering assigned assemblies");
  // }, [update]);

  useEffect(() => {
    if (parentRef.current) {
      setParentHeight(parentRef.current.offsetHeight - 45);
    }
  }, [isCollapsed]);

  const sortAssemblies = (assemblies) => {
    return assemblies.sort((a, b) => {
      if (sortCriterion === "assemblyId") {
        return a.assemblyId.localeCompare(b.assemblyId);
      } else if (sortCriterion === "status") {
        return a.status.localeCompare(b.status);
      } else if (sortCriterion === "assignedToJob") {
        const aAssigned = a.timeblocks.some(
          (block) => block.contextKey === job.id
        )
          ? 1
          : 0;
        const bAssigned = b.timeblocks.some(
          (block) => block.contextKey === job.id
        )
          ? 1
          : 0;
        return bAssigned - aAssigned;
      } else {
        return 0;
      }
    });
  };

  const sortedAssemblies = sortAssemblies(details.assemblies);
  console.log(details);

  return (
    <div className={`w-full ${!isCollapsed && " rounded-lg "}`}>
      <div className="flex items-center w-11/12 gap-4 ml-4 bg-white border rounded-full shadow">
        <div className={`px-3 py-1 rounded-full text-white ${colorClass}`}>
          {details.code}
        </div>
        <div className="text-sm text-gray-700">
          {availableAssemblies} Available
        </div>
        <div className="text-sm text-gray-600 ">
          {" "}
          {assignedTimeBlocks.length} / {details.quantity} Assigned
        </div>
        <button
          onClick={toggleCollapse}
          className="p-2 ml-auto bg-gray-200 rounded-full"
        >
          {isCollapsed ? (
            <LeftCarrot style={"w-4 h-4"} color={"black"} />
          ) : (
            <DownCarrot style={"w-4 h-4"} color={"black"} />
          )}
        </button>
      </div>
      {!isCollapsed && (
        <div
          ref={parentRef}
          className="flex flex-col w-full p-2 pt-4 mb-4 transition-transform duration-300 bg-gray-200 rounded"
        >
          <div className="flex w-full ">
            <div className="flex rounded-b grow">
              <div className="flex flex-col gap-2">
                <select
                  id="sort"
                  value={sortCriterion}
                  onChange={(e) => setSortCriterion(e.target.value)}
                  className="p-1 border rounded max-w-20 "
                >
                  <option value="">None</option>
                  <option value="assemblyId">Assembly ID</option>
                  <option value="status">Status</option>
                  <option value="assignedToJob">Assigned</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <div
                className="relative rounded"
                style={{ width: timelineWidth }}
              >
                <TimeBlockContainerDynamic />
              </div>

              {/* this shows the job window in the timeline */}
              <div className="relative" style={{ width: timelineWidth }}>
                <TimeBlockBasic
                  key={job.id}
                  type={""}
                  start={jobStart}
                  end={jobEnd}
                  height={parentHeight}
                  style={`bg-sky-500 border border-sky-600 p-2 z-20 opacity-30 hover:none flex top-1 items-end  shadow border-black h-full`}
                  title={""}
                  timeLineWidth={timelineWidth}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full gap-2 mt-4">
            {sortedAssemblies.map((assembly) => {
              const unavailable = unavailableDetails.find(
                (unavailDetail) => unavailDetail._id === assembly._id
              );
              return (
                <AssignedAssembly
                  key={assembly._id}
                  assembly={assembly}
                  unavailDetail={unavailable}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedSubItem;
