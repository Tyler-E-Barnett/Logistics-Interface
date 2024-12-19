import { useState, useContext, useEffect, useRef } from "react";
import AssignedAssembly from "./AssignedAssembly";
import { TimelineContext } from "../../context/TimelineContext";
import { LeftCarrot, DownCarrot } from "../../assets/icons";
import TimeBlockContainerDynamic from "../../Components/Common/TimeBlockContainerDynamic";
import { JobContext } from "../../context/JobContext";
import TimeBlockBasic from "../../Components/Common/TimeBlockBasic";

const AssignedSubItem = ({ details }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [sortCriterion, setSortCriterion] = useState("");
  const [parentHeight, setParentHeight] = useState(0);
  const parentRef = useRef(null);
  const { timelineWidth } = useContext(TimelineContext)!;
  const { jobId, jobStart, jobEnd, update } = useContext(JobContext)!;

  const {
    totalAssemblies,
    unavailableAssemblies,
    availableAssemblies,
    unavailableDetails,
  } = details.availability;

  const getColor = (availableRatio) => {
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
      setParentHeight(parentRef.current.offsetHeight - 70);
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
          (block) => block.contextKey === jobId
        )
          ? 1
          : 0;
        const bAssigned = b.timeblocks.some(
          (block) => block.contextKey === jobId
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

  return (
    <div className={`w-full `}>
      <div className="flex items-center gap-4 p-2 mb-2 bg-white rounded shadow">
        <div className={`px-3 py-1 rounded-full text-white ${colorClass}`}>
          {details.code}
        </div>
        <div className="text-gray-700">{availableAssemblies} Available</div>
        <button onClick={toggleCollapse} className="ml-auto">
          {isCollapsed ? (
            <LeftCarrot style={"w-6 h-6"} color={"black"} />
          ) : (
            <DownCarrot style={"w-6 h-6"} color={"black"} />
          )}
        </button>
      </div>
      {!isCollapsed && (
        <div
          ref={parentRef}
          className="flex flex-col p-2 mb-4 transition-transform duration-300 bg-gray-300 rounded"
        >
          <div className="flex w-full ">
            <div className="flex rounded-b grow">
              <div className="flex flex-col gap-2">
                <label htmlFor="sort" className="text-sm">
                  Sort by:
                </label>
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

              <div className="relative" style={{ width: timelineWidth }}>
                <TimeBlockBasic
                  key={jobId}
                  type={""}
                  start={jobStart}
                  end={jobEnd}
                  height={parentHeight}
                  style={`bg-sky-500 border border-sky-600 p-2 z-20 opacity-30 hover:none flex top-1 items-center shadow border-black h-full`}
                  title={"Current Job"}
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
