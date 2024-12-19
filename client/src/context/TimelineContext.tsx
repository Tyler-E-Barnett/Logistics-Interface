import { useState, createContext, ReactNode } from "react";
import { todayDate } from "../modules/dateInfo";

interface RangeType {
  startDate: Date;
  endDate: Date;
}

interface TimelineContextType {
  timelineWidth: number;
  setTimelineWidth: (width: number) => void;
  gantView: boolean;
  setGantView: (gant: boolean) => void;
  range: RangeType;
  setRange: (range: RangeType) => void;
}

interface TimelineContextProviderProps {
  children: ReactNode;
}

export const TimelineContext = createContext<TimelineContextType | null>(null);

export const TimelineContextProvider: React.FC<
  TimelineContextProviderProps
> = ({ children }) => {
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [gantView, setGantView] = useState(false);
  const [range, setRange] = useState<RangeType>({
    startDate: new Date(todayDate),
    endDate: new Date(todayDate),
  });
  return (
    <TimelineContext.Provider
      value={{
        timelineWidth,
        setTimelineWidth,
        gantView,
        setGantView,
        range,
        setRange,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};
