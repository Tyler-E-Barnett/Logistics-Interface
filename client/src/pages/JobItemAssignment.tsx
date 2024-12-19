import TimeBlockInterface from "../Components/Common/TimeBlockInterface";
import ItemAssignmentInterface from "../Components/ItemScheduling/ItemAssignmentInterface";
import { JobContextProvider } from "../context/JobContext";

const JobItemAssignment = () => {
  return (
    <JobContextProvider>
      <TimeBlockInterface>
        <ItemAssignmentInterface />
      </TimeBlockInterface>
    </JobContextProvider>
  );
};

export default JobItemAssignment;
