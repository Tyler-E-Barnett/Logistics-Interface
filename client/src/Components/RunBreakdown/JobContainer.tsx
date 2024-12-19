import TimeBlock from "../Common/TimeBlock";
import { useContext } from "react";
import { TimelineContext } from "../../context/TimelineContext";
import DataFetcher from "../Common/DataFetcher";
import Job from "./Job";
import OperationsContainer from "./OperationsContainer";

function JobContainer({ jobs }) {
  const { timelineWidth } = useContext(TimelineContext);
  return (
    <div className="top-5">
      {jobs &&
        jobs.map((job) => {
          if (job.jobDetails !== null) {
            return (
              <div
                key={job.jobDetails._id}
                className="relative h-12 text-white top-5"
              >
                <TimeBlock
                  start={job.jobDetails.start}
                  end={job.jobDetails.end}
                  style={"bg-yellow-700 z-30 hover:z-40 h-[40px]"}
                  title={job.jobDetails.jobId}
                  type={"job"}
                  timeLineWidth={timelineWidth}
                />
                <OperationsContainer
                  operations={job.operations}
                  type={"jobOperation"}
                />
              </div>
            );
          }
        })}
    </div>
  );
}

export default JobContainer;
