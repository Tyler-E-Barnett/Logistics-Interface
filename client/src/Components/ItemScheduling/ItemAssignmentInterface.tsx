import React, { useState, useContext, useEffect } from "react";
import ItemAssignment from "./ItemAssignment";
import axios from "axios";
import { MagnifyingGlass } from "../../assets/icons";
import { JobContext } from "../../context/JobContext";
import CustomDropdown from "../../Components/Common/CustomDropdown"; // Import the custom dropdown

type JobData = {
  _id: string;
  fmRecordId: string;
  jobId: string;
  start: Date;
  end: Date;
  status: string;
  typeEvent: string;
  clientId: string;
  timeblocks: string[];
  facility: {
    _id: string;
    fmRecordId: string;
    __v: number;
    address: string;
    city: string;
    createdAt: string;
    facilityName: string;
    phone: string;
    state: string;
    type: string;
    updatedAt: string;
    zipCode: string;
    zone: string;
  };
};

const start = new Date();
start.setDate(start.getDate() - 1);
const end = new Date();
end.setDate(end.getDate() + 1);

const ItemAssignmentInterface: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(
    start.toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    end.toISOString().split("T")[0]
  );
  const [jobId, setJobId] = useState<string>("");
  const [jobData, setJobData] = useState<JobData[]>([]);
  const [currentJob, setCurrentJob] = useState<JobData | null>(null);

  const jobContext = useContext(JobContext);

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleJobIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJobId(event.target.value);
  };

  const handleJobSelect = (selectedJob: JobData | null) => {
    setCurrentJob(selectedJob);

    if (selectedJob && jobContext) {
      jobContext.setId(selectedJob._id);
      jobContext.setJobId(selectedJob.jobId);
      jobContext.setFacilityId(selectedJob.facility);
      jobContext.setJobStart(new Date(selectedJob.start).toISOString());
      jobContext.setJobEnd(new Date(selectedJob.end).toISOString());
      jobContext.setJobItemId(selectedJob.fmRecordId);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get("/api/jobData/lookup", {
        params: {
          start: startDate,
          end: endDate,
          jobId: jobId || undefined,
        },
      });

      // Sort the data by the start date
      const sortedData = response.data.sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
      );

      setJobData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 pt-10 bg-gray-600">
      <div className="flex flex-wrap items-center w-full gap-4 p-4 mb-4 bg-white rounded-lg shadow max-w-7xl">
        <div className="flex flex-col flex-grow">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Start Date:
          </label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-col flex-grow">
          <label className="mb-1 text-sm font-medium text-gray-700">
            End Date:
          </label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-col flex-grow">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Job Number:
          </label>
          <input
            type="text"
            value={jobId}
            onChange={handleJobIdChange}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          onClick={fetchJobs}
          className="flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-full hover:bg-indigo-600"
        >
          <MagnifyingGlass color={"#FFF"} style={"w-10 h-10"} />
        </button>
      </div>
      <div className="w-full p-4 bg-white rounded-lg shadow max-w-7xl">
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-medium text-gray-700">Jobs</label>
          <CustomDropdown
            label="Filtered Jobs"
            options={jobData}
            selectedOption={currentJob}
            onSelect={handleJobSelect}
          />
          {currentJob && (
            <div className="flex flex-col p-4 mt-4 bg-gray-200 rounded">
              <p>
                <span className="font-medium">Job ID:</span> {currentJob.jobId}
              </p>
              <p>
                <span className="font-medium">Facility:</span>{" "}
                {currentJob.facility.facilityName}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={
                    currentJob.status === "Yes"
                      ? "text-green-700"
                      : currentJob.status === "Tentative"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }
                >
                  {currentJob.status}
                </span>
              </p>
              <p>
                {new Date(currentJob.start).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
                {" - "}
                {new Date(currentJob.end).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            </div>
          )}
        </div>

        <ItemAssignment />
      </div>
    </div>
  );
};

export default ItemAssignmentInterface;
