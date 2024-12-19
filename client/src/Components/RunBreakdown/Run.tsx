import DataFetcher from "../Common/DataFetcher";
import TimeBlock from "../Common/TimeBlock";
import { useContext } from "react";
import { TimelineContext } from "../../context/TimelineContext";
import JobContainer from "./JobContainer";
import OperationsContainer from "./OperationsContainer";

function Run({ runId }) {
  const { timelineWidth } = useContext(TimelineContext)!;

  return (
    <DataFetcher url={`/api/logistics/runBreakdowntoJobs/${runId}`}>
      {(data) => (
        <div className="">
          {data.map((run) => (
            <div className="" key={run.runNumber}>
              <OperationsContainer
                operations={run.allOperations}
                type={"runOperation"}
              />
              <TimeBlock
                type={"run"}
                start={run.start}
                end={run.end}
                style={"bg-sky-700 hover:z-40 h-[40px]"}
                title={"Run"}
                timeLineWidth={timelineWidth}
              />
              <div className="">
                <JobContainer jobs={run.jobs} />
              </div>
              {/* <OperationsContainer
                operations={run.allOperations}
                type={"runOperation"}
              /> */}
            </div>
          ))}
        </div>
      )}
    </DataFetcher>
  );
}

export default Run;
