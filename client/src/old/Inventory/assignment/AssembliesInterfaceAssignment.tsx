import { useState, useContext, useEffect } from "react";
import DataFetcher from "../../../Components/Common/DataFetcher";
import { PageHeader } from "../../../Components/Common/StyleComponents";
import AssemblyCardAssignment from "./AssemblyCardAssignment";
import MyDateRangePicker from "../../../Components/Common/MyDateRangePicker";
import { CalendarIcon } from "../../../assets/icons";
import TimeBlockContainer from "../../../Components/Common/TimeBlockContainer";
import { TimelineContext } from "../../../context/TimelineContext";
import { todayDate, formattedDate } from "../../../modules/dateInfo";
import JobItemInterface from "../JobItemInterface";
import { equipmentOptions } from "../../../modules/dropdownValues";
import { JobContext } from "../../../context/JobContext";
import AssignedJobAssemblies from "./AssignedJobAssemblies";
import TimeBlockContainerDynamic from "../../../Components/Common/TimeBlockContainerDynamic";

function AssembliesInterfaceAssignment() {
  const [expandedIds, setExpandedIds] = useState({});
  const [category, setCategory] = useState("Laptops");
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 6);

    return {
      startDate: today,
      endDate: endDate,
      key: "selection",
    };
  });

  const [showPicker, setShowPicker] = useState(false);
  const [toggleMode, setToggleMode] = useState(false);
  const { setRange } = useContext(TimelineContext);

  const { jobId, setJobId, jobItemId } = useContext(JobContext)!;

  useEffect(() => {
    setRange({
      startDate: new Date(dateRange.startDate.setHours(0, 0, 0, 0)),
      endDate: new Date(dateRange.endDate.setHours(23, 59, 59, 999)),
    });
  }, [dateRange, setRange]);

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  const handleDateRangeChange = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange({
      startDate: new Date(startDate.setHours(0, 0, 0, 0)),
      endDate: new Date(endDate.setHours(23, 59, 59, 999)),
      fetchKey: "selection",
    });
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  const handleToggleMode = () => {
    setToggleMode(!toggleMode);
  };

  const toggleEquipmentVisibility = (id) => {
    setExpandedIds((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  console.log(dateRange.startDate.toISOString());

  return (
    <div className="h-full">
      <PageHeader title={"Inventory Assignment"} date={false} />

      <div className="flex flex-col w-full">
        <div className="flex items-end justify-start w-full gap-3 p-4 ml-10">
          <div className="flex flex-col items-start justify-center gap-2 text-onSurface">
            <label className="font-semibold text-onBackground" htmlFor="jobId">
              Job Id:
            </label>

            <input
              type="text"
              id="jobId"
              value={jobId}
              onChange={(e) => setJobId(e.target.value.toString())}
              className="px-3 py-1 text-black border rounded w-28"
            />

            <select
              id="job-select"
              value={jobId}
              onChange={(e) => setJobId(e.target.value.toString())}
              className="p-2 bg-white border rounded-md text-secondaryVar border-secondary"
            >
              <option value="">Select a job...</option>
              <DataFetcher
                url={`/api/jobData/dateRange/${dateRange.startDate}/${dateRange.endDate}`}
                fetchKey={
                  dateRange.startDate.toISOString() +
                  dateRange.endDate.toISOString()
                }
              >
                {(data) => {
                  if (!Array.isArray(data) || data.length === 0) {
                    return <option>No jobs found</option>;
                  }
                  return data.map((job) => (
                    <option key={job.jobId} value={job.jobId}>
                      {job.jobId} - {job.typeEvent} - {job.status}
                    </option>
                  ));
                }}
              </DataFetcher>
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="category-select"
              className="font-semibold text-onBackground"
            >
              Choose a Category:
            </label>
            <select
              id="category-select"
              value={category}
              onChange={handleChangeCategory}
              className="p-2 bg-white border rounded-md text-secondaryVar border-secondary"
            >
              <option value="">Select a category...</option>
              {equipmentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <button
            className="p-2 rounded text-onPrimary bg-primary"
            onClick={handleToggleMode}
          >
            {toggleMode ? "Category" : "Job Item"}
          </button>
          <button
            onClick={togglePicker}
            className={`${
              showPicker ? "bg-primary" : "bg-secondaryVar"
            } p-2 text-white rounded-md`}
          >
            <CalendarIcon />
          </button>
          {showPicker && (
            <div className="absolute z-50 border rounded shadow-xl top-1/4 left-12">
              <MyDateRangePicker
                ranges={[dateRange]}
                onChange={handleDateRangeChange}
                closePicker={() => setShowPicker(false)}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col items-end justify-end">
          <div className="p-2 mr-6">
            {`${formattedDate(dateRange.startDate)}
             - ${formattedDate(dateRange.endDate)}`}
          </div>
          <div className="flex justify-end w-full ">
            <div className="w-[970px] mr-6">
              {/* <TimeBlockContainer period={period} /> */}
              <TimeBlockContainerDynamic />
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full">
        <div className="h-[800px] overflow-scroll gap-4 flex w-full border-2 bg-secondaryVar p-2 rounded-md shadow">
          <JobItemInterface />
          <div className="overflow-scroll">
            {toggleMode ? (
              <div className="flex flex-col flex-grow gap-2">
                <DataFetcher
                  url={`/api/inventory/assemblies/category/${category}`}
                  fetchKey={category}
                >
                  {(data) => {
                    if (!Array.isArray(data) || data.length === 0) {
                      return <div className="">No Items found</div>;
                    }
                    return data.map((item) => (
                      <AssemblyCardAssignment
                        key={item.id}
                        item={item}
                        toggleEquipmentVisibility={toggleEquipmentVisibility}
                        isExpanded={expandedIds[item.id]}
                        // period={period}
                      />
                    ));
                  }}
                </DataFetcher>
              </div>
            ) : (
              <div className="flex flex-col flex-grow gap-2">
                <DataFetcher
                  url={`/api/inventory/assemblies/itemCode/${jobItemId}`}
                  fetchKey={jobItemId}
                >
                  {(data) => {
                    if (!Array.isArray(data) || data.length === 0) {
                      return <div className="">No Items found</div>;
                    }
                    return data.map((item) => (
                      <AssemblyCardAssignment
                        key={item.id}
                        item={item}
                        toggleEquipmentVisibility={toggleEquipmentVisibility}
                        isExpanded={expandedIds[item.id]}
                        // period={period}
                      />
                    ));
                  }}
                </DataFetcher>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-96">
        <AssignedJobAssemblies />
      </div>
    </div>
  );
}

export default AssembliesInterfaceAssignment;
