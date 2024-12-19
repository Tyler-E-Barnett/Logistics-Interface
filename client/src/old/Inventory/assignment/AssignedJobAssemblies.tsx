import { useContext } from "react";
import { JobContext } from "../../../context/JobContext";
import DataFetcher from "../../../Components/Common/DataFetcher";

function AssignedJobAssemblies() {
  const { jobId } = useContext(JobContext);
  return (
    <DataFetcher
      url={`/api/jobData/items/jobAssembly/${jobId}`}
      fetchKey={jobId}
    >
      {(data) => (
        <div className="flex flex-col flex-grow gap-4">
          {data?.map((item) => (
            <div className="">{item.details.assemblyId}</div>
          ))}
        </div>
      )}
    </DataFetcher>
  );
}

export default AssignedJobAssemblies;
