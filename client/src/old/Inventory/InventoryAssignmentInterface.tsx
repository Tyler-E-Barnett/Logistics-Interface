import JobItemInterface from "./JobItemInterface";
import AssembliesInterface from "./grid/AssembliesInterface";
import { pageStyle } from "../../modules/pageStyling";
import { JobContextProvider } from "../../context/JobContext";
import AssembliesInterfaceAssignment from "./assignment/AssembliesInterfaceAssignment";
import TimeBlockInterface from "../../Components/Common/TimeBlockInterface";

function InventoryAssignmentInterface() {
  return (
    <JobContextProvider>
      <div className={pageStyle}>
        <div className="flex w-full h-[800px] gap-4">
          {/* <JobItemInterface /> */}
          <TimeBlockInterface>
            <AssembliesInterfaceAssignment />
          </TimeBlockInterface>
        </div>
      </div>
    </JobContextProvider>
  );
}

export default InventoryAssignmentInterface;
