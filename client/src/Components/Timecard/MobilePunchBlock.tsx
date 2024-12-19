import TimeBlock from "../Common/TimeBlock";
import DataFetcher from "../Common/DataFetcher";
import { useContext } from "react";
import { TimelineContext } from "../../context/TimelineContext";

function MobilePunchBlock() {
  const { timelineWidth } = useContext(TimelineContext)!;
  return (
    <DataFetcher url={"/api/timecard/punchesToday"}>
      {(data) => (
        <div className="flex flex-col gap-2">
          {data &&
            data.map((item, index) => (
              <div className="" key={index}>
                <TimeBlock
                  type={"punch"}
                  start={item.timeStampIn}
                  end={item.timeStampOut}
                  style={"bg-onBackground hover:z-40 relative h-10 text-white"}
                  title={item.name}
                  timeLineWidth={timelineWidth}
                />
              </div>
            ))}
        </div>
      )}
    </DataFetcher>
  );
}

export default MobilePunchBlock;
