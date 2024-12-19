import OperationsContainer from "./OperationsContainer";

function Job({ data }) {
  return (
    <div>
      {data &&
        data.map((job) => (
          <div key={job.jobId}>
            <div className="text-white">{job.jobId}</div>
            {/* <OperationsContainer operations={job.operations} /> */}
          </div>
        ))}
    </div>
  );
}

export default Job;
