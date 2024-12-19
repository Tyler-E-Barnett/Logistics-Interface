import TimeBlockContainer from "../Common/TimeBlockContainer";
import { TimelineContextProvider } from "../../context/TimelineContext";
import MobilePunchBlock from "./MobilePunchBlock";

function MobileTimeline() {
  return (
    <div className="mt-6 max-w-7xl">
      <TimelineContextProvider>
        <TimeBlockContainer period={"day"}>
          <MobilePunchBlock />
        </TimeBlockContainer>
      </TimelineContextProvider>
    </div>
  );
}

export default MobileTimeline;
