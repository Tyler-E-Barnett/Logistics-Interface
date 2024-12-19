import TimeBlock from "../Common/TimeBlock";
import { useContext } from "react";
import { TimelineContext } from "../../context/TimelineContext";
import { operationColor } from "../../modules/timeblockStyling";

function OperationsContainer({ operations, type }) {
  const { timelineWidth, gantView } = useContext(TimelineContext);
  return (
    <div>
      {operations &&
        operations.map((op) => (
          <div key={op._id} className={` text-white`}>
            <TimeBlock
              type={type}
              start={op.arrival}
              end={op.departure}
              style={`${operationColor(op.operation)} ${
                type === "" && gantView
                  ? "h-96 text-transparent text-xs z-0 opacity-25 items-start hover:opacity-80 hover:scale-100 hover:z-30 hover:brightness-100"
                  : "z-40 h-8 top-[40px] items-center border border-slate-600 hover:z-50"
              }`}
              title={op.operation}
              timeLineWidth={timelineWidth}
            />
          </div>
        ))}
    </div>
  );
}

export default OperationsContainer;
