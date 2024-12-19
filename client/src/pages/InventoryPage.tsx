import { Routes, Route, Link, useLocation } from "react-router-dom";
import InventoryAssignmentInterface from "../old/Inventory/InventoryAssignmentInterface";
import AssembliesInterface from "../old/Inventory/grid/AssembliesInterface";
import PageButton from "../Components/Common/PageButton";

const InventoryPage = () => {
  const location = useLocation();
  const isActive = (path) => {
    // Adjust to check if the current path ends with the specific path to handle nested routes correctly
    return location.pathname.endsWith(path);
  };

  return (
    <div className="">
      <PageButton isActive={isActive("/grid")}>
        <Link to="grid">Grid</Link> {/* Relative link */}
      </PageButton>
      <PageButton isActive={isActive("/inventoryAssignment")}>
        <Link to="inventoryAssignment">Inventory Assignment</Link>{" "}
        {/* Relative link */}
      </PageButton>

      <Routes>
        <Route path="grid" element={<AssembliesInterface />} />
        <Route
          path="inventoryAssignment"
          element={<InventoryAssignmentInterface />}
        />
      </Routes>
    </div>
  );
};

export default InventoryPage;
