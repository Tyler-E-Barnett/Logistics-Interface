import React, { useState, useContext, useEffect } from "react";
import ItemAssignment from "./ItemAssignment";
import axios from "axios";
import { MagnifyingGlass } from "../../assets/icons";
import { JobContext } from "../../context/JobContext";

type JobData = {
  _id: string;
  fmRecordId: string;
  jobId: string;
  start: Date;
  end: Date;
  status: string;
  typeEvent: string;
  clientId: string;
  facilityId: string;
};

const ItemAssignmentInterface: React.FC = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [jobId, setJobId] = useState<string>("120082");
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

  const handleJobSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedJobId = event.target.value;
    const selectedJob = jobData.find((job) => job._id === selectedJobId);
    setCurrentJob(selectedJob || null);

    if (selectedJob && jobContext) {
      jobContext.setJobId(selectedJob.jobId);
      jobContext.setFacilityId(selectedJob.facilityId);
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
      setJobData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 pt-10 bg-gray-600">
      <div className="flex flex-wrap w-full max-w-6xl gap-4 p-4 mb-4 bg-white rounded-lg shadow">
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
          className="flex items-center justify-center w-10 h-10 p-2 bg-indigo-500 rounded-full hover:bg-indigo-600"
        >
          <MagnifyingGlass color={"#FFFFFF"} style={"w-6 h-6"} />
        </button>
      </div>
      <div className="w-full max-w-6xl p-4 bg-white rounded-lg shadow">
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-medium text-gray-700">Jobs</label>
          <select
            className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
            value={currentJob?._id || ""}
            onChange={handleJobSelect}
          >
            <option value="" disabled>
              Filtered Jobs
            </option>
            <option value="">None</option>
            {jobData.map((job) => (
              <option key={job._id} value={job._id}>
                {job.jobId} - {new Date(job.start).toLocaleDateString("en-US")}{" "}
                - {job.typeEvent} - {job.status}
              </option>
            ))}
          </select>
          {currentJob && (
            <div className="flex flex-col p-4 mt-4 rounded bg-gray-50">
              <p>
                <span className="font-medium">Job ID:</span> {currentJob.jobId}
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

        <ItemAssignment job={currentJob} />
      </div>
    </div>
  );
};

export default ItemAssignmentInterface;
