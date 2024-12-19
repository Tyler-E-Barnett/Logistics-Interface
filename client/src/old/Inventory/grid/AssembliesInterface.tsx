import { useState } from "react";
import DataFetcher from "../../../Components/Common/DataFetcher";
import { PageHeader } from "../../../Components/Common/StyleComponents";
import AssemblyCard from "./AssemblyCard";

function AssembliesInterface() {
  const [category, setCategory] = useState("Laptops");
  const [expandedIds, setExpandedIds] = useState({}); // State to track expanded items

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const toggleEquipmentVisibility = (id) => {
    setExpandedIds((prevState) => {
      const newState = { ...prevState, [id]: !prevState[id] };
      return newState;
    });
  };

  const equipmentOptions = [
    "DJ System",
    "MDJ",
    "Mixers",
    "Speakers",
    "Powered Speakers",
    "Speaker Arrays",
    "Wireless Kits",
    "DIs",
    "Pro Audio",
    "Lectern Mics",
    "Audio - Other",
    "Video Racks",
    "Video Converters",
    "Video Distro",
    "LED Wall",
    "Studio Cameras",
    "Speciality Cameras",
    "Laptops",
    "PPT Remotes",
    "Blu-Ray Players",
    "Projector",
    "Lenses",
    "Screen",
    "Flat Screen",
    "FPD Stands",
    "Video - Other",
    "Lighting Control",
    "LED Uplights",
    "Lekos",
    "Light Kit",
    "Movers",
    "Effects",
    "LED Tree",
    "Lighting",
    "UPS",
    "AC Case",
    "Generator",
    "Power",
    "HD Stands",
    "Rigging",
    "Tents",
    "Staging",
    "Staging/Tents",
    "Communications",
    "Networking",
    "Lecterns",
    "Photography",
    "Drape & Pipe",
    "Vehicle",
    "Trailer",
    "Studio",
    "Decor",
    "Office",
  ];

  console.log(category);

  return (
    <div className="p-8">
      <PageHeader title={"Assembiles"} date={false} />
      <div className="w-64">
        <div className="flex flex-col">
          <label
            htmlFor="category-select"
            className="mb-2 text-lg font-semibold text-onBackground"
          >
            Choose a Category:
          </label>
          <select
            id="category-select"
            value={category}
            onChange={handleChange}
            className="p-2 mb-4 bg-white border rounded-md text-secondaryVar border-secondary"
          >
            <option value="">Select a category...</option>
            {equipmentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-auto hover:overflow-scroll lg:h-[580px] w-[900px] border">
        <DataFetcher url={`/api/inventory/assembly?category=${category}`}>
          {(data) => (
            <div className="flex flex-wrap flex-grow gap-2">
              {data?.map((item) => (
                <AssemblyCard
                  key={item["Assembly ID"]}
                  item={item}
                  toggleEquipmentVisibility={toggleEquipmentVisibility}
                  isExpanded={expandedIds[item["Assembly ID"]]}
                />
              ))}
            </div>
          )}
        </DataFetcher>
      </div>
    </div>
  );
}

export default AssembliesInterface;
