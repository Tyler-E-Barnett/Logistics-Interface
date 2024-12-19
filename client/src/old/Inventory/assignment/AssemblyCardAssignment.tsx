import { useContext, useState, useEffect, useRef } from "react";
import { TimelineContext } from "../../../context/TimelineContext";
import { JobContext } from "../../../context/JobContext";
import Equipment from "../Equipment";
import AssemblyAvailability from "../AssemblyAvailability";
import TimeBlockBasic from "../../../Components/Common/TimeBlockBasic";
import AssignmentFormAssignment from "./AssignmentFormAssignment";
import assemblyimage from "../../../assets/system-assembly.png";
import DataFetcher from "../../../Components/Common/DataFetcher";
import { PlusIcon, XIcon } from "../../../assets/icons";

const AssemblyCardAssignment = ({
  item,
  toggleEquipmentVisibility,
  isExpanded,
  period,
}) => {
  const { timelineWidth, range } = useContext(TimelineContext)!;
  const { jobId } = useContext(JobContext)!;
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const formRef = useRef(null); // Create a ref for the form

  const handleRefresh = () => {
    // Increment key to trigger re-render
    setRefreshKey((prevKey) => prevKey + 1);
    console.log(refreshKey);
  };

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formRef]); // Only re-attach if formRef changes

  useEffect(() => {
    setShowForm(false);
  }, [refreshKey]);

  return (
    <div
      className={`transition-all duration-300 ease-in-out items-start w-[1180px]
                  ${
                    isExpanded ? "h-[300px]" : "h-[80px]"
                  } flex justify-start  p-2 bg-gray-200
                  shadow  rounded-lg relative`}
    >
      <div className="flex justify-start w-[180px] relative h-full">
        <div
          className={` flex flex-col h-full transition-all duration-300 justify-center ease-in-out items-start w-[220px] rounded p-2`}
        >
          <button
            onClick={() => toggleEquipmentVisibility(item.id)}
            className={` flex gap-2 justify-center items-center`}
          >
            <img
              className={`w-12 h-12 p-1 bg-gray-300 rounded `}
              src={assemblyimage}
              alt="assembly"
            />
            <div
              className={`${
                item.status !== "Working" ? "text-error" : ""
              } text-sm w-24`}
            >
              {item.assemblyId}
            </div>
          </button>
          {isExpanded && (
            <div className="w-full h-full p-2 ml-2 overflow-scroll">
              <ul className="text-xs">
                <li>{item.status}</li>
                <li>{item.assemblyType}</li>
                <li>{item.description}</li>
              </ul>
              <Equipment assemblyId={item.assemblyId} />
            </div>
          )}
        </div>
        <div
          id="divider"
          className={`w-2 bg-gray-700 absolute right-0 -top-2 transition-all duration-300 ease-in-out ${
            isExpanded ? "h-[320px]" : "h-[80px]"
          }`}
        ></div>
      </div>

      <div className="flex flex-col items-center justify-start w-full h-full gap-2">
        <div
          className="relative w-[970px] h-8 mt-1  bg-white border rounded-md border-secondaryVar"
          // style={{ width: `${timelineWidth}px` }}
        >
          <DataFetcher
            url={`/api/logistics/timeblock/jobAssembly/${item._id}/${range.startDate}/${range.endDate}`}
            fetchKey={refreshKey}
          >
            {(data) => {
              console.log("Fetched data:", data); // Check what the actual data looks like
              if (!Array.isArray(data)) {
                return <div></div>;
              }
              return (
                <div className="flex flex-col items-end">
                  {data.map((item, index) => (
                    <TimeBlockBasic
                      key={index}
                      type={""}
                      start={item.start}
                      end={item.end}
                      style={`${
                        item.contextKey === jobId
                          ? "bg-sky-500"
                          : "bg-orange-500"
                      }  flex items-center shadow border-black hover:z-40 h-[28px] top-[1px] opacity-80`}
                      title={`${item.contextKey}`}
                      timeLineWidth={timelineWidth}
                      timeScale={period}
                    />
                  ))}
                </div>
              );
            }}
          </DataFetcher>
        </div>
        {/* <AssemblyAvailability contextType={"jobAssembly"} itemId={item.id} /> */}
      </div>
      <button
        className="absolute bottom-0 right-0 p-2 "
        onClick={handleShowForm}
      >
        {showForm ? (
          <XIcon style={"h-6 w-6"} />
        ) : (
          <PlusIcon style={"h-6 w-6"} />
        )}
      </button>
      {showForm && (
        <div ref={formRef} className="absolute z-10 right-10 top-1">
          <AssignmentFormAssignment
            id={item._id}
            contextType={"jobAssembly"}
            onRefresh={handleRefresh}
          />
        </div>
      )}
    </div>
  );
};

export default AssemblyCardAssignment;
