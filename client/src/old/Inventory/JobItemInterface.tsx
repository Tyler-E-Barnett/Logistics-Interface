import { useState, useContext } from "react";
import DataFetcher from "../../Components/Common/DataFetcher";
import JobItemsContainer from "./JobItemsContainer";
import { localDateTime } from "../../modules/dateInfo";
import { PageHeader } from "../../Components/Common/StyleComponents";
import { JobContext } from "../../context/JobContext";

function JobItemInterface() {
  // const [jobId, setJobId] = useState(124990);
  const { jobId, setJobId, setJobStart, setJobEnd, setFacilityId } =
    useContext(JobContext)!;

  return (
    <div className="flex flex-col bg-secondaryVarLight gap-6 overflow-auto hover:overflow-scroll h-full w-[300px] border rounded p-1 shadow">
      <DataFetcher url={`/api/logistics/jobItems?jobId=${jobId}`}>
        {(data) =>
          data?.map((job) => {
            setJobStart(job.start);
            setJobEnd(job.end);
            setFacilityId(job.facilityName);
            return (
              <div key={job.jobId} className="w-full p-4 ">
                <div className="p-2 mb-2">
                  <h4 className="text-sm text-onBackground">
                    {`${localDateTime(job.start)} - ${localDateTime(job.end)}`}
                  </h4>
                </div>
                <JobItemsContainer items={job.items} />
              </div>
            );
          })
        }
      </DataFetcher>
    </div>
  );
}

export default JobItemInterface;
