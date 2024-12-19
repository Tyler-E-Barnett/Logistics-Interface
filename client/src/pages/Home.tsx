import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { CrewContextProvider } from "../context/CrewContext";
import CrewCardInterface from "../Components/crewScheduling/CrewCardInterface";
import ScheduleInterface from "../old/ScheduleInterface";
import ItemAssignment from "../Components/ItemScheduling/ItemAssignment";
import JobItemAssignment from "./JobItemAssignment";

import Timecard from "./Timecard";
import { useState } from "react";

import RunPage from "./RunPage";

import Upload from "./Upload";
import InventoryPage from "./InventoryPage";
import ItemCodeForm from "../old/ItemCodes/ItemCodeForm";
import ItemCodeEntry from "../Components/ItemCodeAssignment/ItemCodeEntry";
import ItemCodePage from "./ItemCodePage";

const Home = () => {
  const [date, setDate] = useState();
  const navigate = useNavigate();

  return (
    <div>
      <CrewContextProvider>
        <Routes>
          <Route path="/runStaffing/:urlDate" element={<CrewCardInterface />} />
          <Route path="/timecard/*" element={<Timecard />} />
          <Route path="/run" element={<RunPage />} />
          <Route path="/fileUpload" element={<Upload />} />
          <Route path="/itemCodeEntry/*" element={<ItemCodePage />} />
          <Route path="/itemAssignment" element={<JobItemAssignment />} />
        </Routes>
      </CrewContextProvider>
    </div>
  );
};

export default Home;
