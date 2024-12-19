import Run from "./Run";
import TimeBlockContainerDay from "../Common/TimeBlockContainerDay";
import TimeBlockContainer from "../Common/TimeBlockContainer";
import { useState, useContext } from "react";
import { TimelineContext } from "../../context/TimelineContext";
import { pageStyle } from "../../modules/pageStyling";

const RunInterface = () => {
  const [runId, setRunId] = useState(21683);
  const { gantView, setGantView } = useContext(TimelineContext);

  const handleDecrease = () => {
    const newRunId = parseInt(runId, 10) - 1;
    setRunId(newRunId.toString());
  };

  const handleIncrease = () => {
    const newRunId = parseInt(runId, 10) + 1;
    setRunId(newRunId.toString());
  };

  const toggleGantView = () => {
    setGantView(!gantView);
  };

  return (
    <div className={pageStyle}>
      <div className="p-6 rounded-lg">
        <h1 className="font-serif text-4xl font-bold text-onBackground">
          Logistics
        </h1>

        <div className="flex items-center mt-6">
          <h3 className="p-2 text-onBackground">Run:</h3>
          <input
            type="text"
            value={runId}
            onChange={(e) => setRunId(e.target.value)}
            placeholder="Enter Run Number"
            className="w-24 p-1 m-2 border rounded"
          />
          <button
            onClick={handleDecrease}
            className="px-3 py-1 font-bold text-black rounded-l bg-secondary hover:bg-secondaryVarLight"
          >
            -
          </button>
          <button
            onClick={handleIncrease}
            className="px-3 py-1 font-bold text-black rounded-r bg-secondary hover:bg-secondaryVarLight"
          >
            +
          </button>
          <button
            className="p-2 ml-5 text-white rounded shadow bg-slate-700 hover:bg-slate-500"
            onClick={toggleGantView}
          >
            Expand
          </button>
        </div>
      </div>
      <div className=""></div>
      <TimeBlockContainer period={"day"}>
        <Run runId={runId} />
      </TimeBlockContainer>
    </div>
  );
};

export default RunInterface;
