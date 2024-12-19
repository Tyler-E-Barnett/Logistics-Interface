import Equipment from "../Equipment";
import AssignmentForm from "./AssignmentForm";
import { RightCarrot, LeftCarrot } from "../../../assets/icons";
import AssemblyAvailability from "../AssemblyAvailability";
import assemblyicon from "../../../assets/system-assembly.png";

// need to add assigned status indicator

const AssemblyCard = ({ item, toggleEquipmentVisibility, isExpanded }) => {
  // Simplified click handler that just toggles the visibility
  const handleClick = () => {
    toggleEquipmentVisibility(item["Assembly ID"]);
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isExpanded ? "w-[900px] h-[260px] flex flex-col" : "w-52 h-10"
      } p-2 border border-secondaryVarLight rounded-lg`}
    >
      <button
        className="flex items-center justify-between w-full text-sm font-bold"
        onClick={handleClick}
      >
        <div className={`${item.Status !== "Working" ? "text-error" : ""}`}>
          {item["Assembly ID"]}
        </div>
        {isExpanded ? <LeftCarrot /> : <RightCarrot />}
      </button>

      {isExpanded && (
        <div className="flex flex-grow">
          <div className="flex-initial h-[220px] p-2 overflow-y-scroll border">
            <Equipment assemblyId={item["Assembly ID"]} />
          </div>
          <div className="flex flex-col justify-between flex-grow">
            <AssemblyAvailability
              contextType={"jobAssembly"}
              contextKey={124990}
              itemId={item.id}
            />
            <AssignmentForm id={item.id} contextType={"jobAssembly"} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AssemblyCard;
