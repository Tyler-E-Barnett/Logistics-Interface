import RunInterface from "../Components/RunBreakdown/RunInterface";
import TimeBlockContainerDay from "../Components/Common/TimeBlockContainerDay";
import { TimelineContextProvider } from "../context/TimelineContext";

function RunPage() {
  return (
    <TimelineContextProvider>
      <RunInterface />
    </TimelineContextProvider>
  );
}

export default RunPage;
