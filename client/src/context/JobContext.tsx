import React, { useState, createContext, ReactNode, useMemo } from "react";

interface JobContextType {
  id: string;
  setId: (id: string) => void;
  jobId: string;
  setJobId: (id: string) => void;
  facilityId: {};
  setFacilityId: (id: {}) => void;
  jobStart: string;
  setJobStart: (time: string) => void;
  jobEnd: string;
  setJobEnd: (time: string) => void;
  jobItemId: string;
  setJobItemId: (id: string) => void;
  update: boolean;
  setUpdate: (refresh: boolean) => void;
  toggleUpdate: () => void;
  timeBlocks: any[]; // Add timeBlocks to the interface
  setTimeBlocks: (blocks: any[]) => void; // Setter for timeBlocks
  job: {
    id: string;
    jobId: string;
    facilityId: {};
    start: string;
    end: string;
    fmRecordId: string;
  };
}

export const JobContext = createContext<JobContextType | null>(null);

interface JobContextProviderProps {
  children: ReactNode;
}

export const JobContextProvider: React.FC<JobContextProviderProps> = ({
  children,
}) => {
  const [id, setId] = useState("");
  const [jobId, setJobId] = useState("");
  const [facilityId, setFacilityId] = useState({});
  const [jobStart, setJobStart] = useState("");
  const [jobEnd, setJobEnd] = useState("");
  const [jobItemId, setJobItemId] = useState("");
  const [update, setUpdate] = useState(false);
  const [timeBlocks, setTimeBlocks] = useState<any[]>([]); // Initialize timeBlocks as an array

  const toggleUpdate = () => {
    setUpdate((prevUpdate) => !prevUpdate);
  };

  const job = useMemo(
    () => ({
      id,
      jobId,
      facilityId,
      start: jobStart,
      end: jobEnd,
      fmRecordId: jobItemId,
    }),
    [id, jobId, facilityId, jobStart, jobEnd, jobItemId]
  );

  return (
    <JobContext.Provider
      value={{
        id,
        setId,
        jobId,
        setJobId,
        facilityId,
        setFacilityId,
        jobStart,
        setJobStart,
        jobEnd,
        setJobEnd,
        jobItemId,
        setJobItemId,
        update,
        setUpdate,
        toggleUpdate,
        timeBlocks, // Include timeBlocks in the context value
        setTimeBlocks, // Provide the setter for timeBlocks
        job, // Pass the derived job object
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
