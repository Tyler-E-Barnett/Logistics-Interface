import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import MobilePunchOverviewContainer from "./MobilePunchOverviewConainter";
import MobileTimeline from "./MobileTimeline";
import PageButton from "../Common/PageButton";
import { pageStyle } from "../../modules/pageStyling";

function MobilePunchOverviewInterface() {
  const currentDate = new Date();
  const todayDate = currentDate.toLocaleDateString("en-us");
  const location = useLocation();

  const isActive = (path) => {
    // This checks if the current path includes the path parameter
    return location.pathname.includes(path);
  };

  return (
    <div className={pageStyle}>
      <div className="p-6 rounded-lg ">
        <h1 className="font-serif text-4xl font-bold text-onBackground">
          Mobile Punches
        </h1>
        <h3 className="text-2xl text-onBackground">{todayDate}</h3>
      </div>
      <div className="ml-10">
        <PageButton isActive={isActive("mobileToday")}>
          <Link to="mobileToday">Today</Link>
        </PageButton>
        <PageButton isActive={isActive("mobileTimeline")}>
          <Link to="mobileTimeline">Timeline</Link>
        </PageButton>
      </div>

      <Routes>
        <Route path="mobileToday" element={<MobilePunchOverviewContainer />} />
        <Route path="mobileTimeline" element={<MobileTimeline />} />
      </Routes>
    </div>
  );
}

export default MobilePunchOverviewInterface;
