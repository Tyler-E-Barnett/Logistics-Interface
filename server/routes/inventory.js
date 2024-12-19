const { Router } = require("express");
const { TimeBlock } = require("../models/timeBlockModels");
const inventoryRouter = Router();
const {
  getAssembliesFilemaker,
  getEquipmentFilemaker,
  scheduleEquipment,
  assemblyExport,
  equipmentExport,
  findAssemblyByType,
  findEquipmentByAssemblyId,
  equipmentMappingExport,
  getAssembliesFromCode,
  getAssemblyByAssemblyId,
  getAssemblyById,
  getAssembliesByIds,
} = require("../controllers/inventoryControllers");
const {
  deleteTimeBlock,
  deleteTimeBlocks,
  getTimeBlockById,
} = require("../controllers/timeblockControllers");

// inventoryRouter.get("/assembly", getAssembliesFilemaker);
inventoryRouter.get("/equipment", getEquipmentFilemaker);
inventoryRouter.get("/assignment/:id", getTimeBlockById);
inventoryRouter.put("/assignment", scheduleEquipment);
inventoryRouter.delete("/assignment/:id", deleteTimeBlock);
inventoryRouter.post("/delete/assignments", deleteTimeBlocks);
inventoryRouter.put("/assembly/export", assemblyExport);
inventoryRouter.put("/equipment/export", equipmentExport);
inventoryRouter.put("/mapping/export", equipmentMappingExport);
inventoryRouter.get("/assemblies/category/:type", findAssemblyByType);
inventoryRouter.get("/assemblies/itemCode/:jobItemId", getAssembliesFromCode);
inventoryRouter.get(
  "/equipment/assembly/:assemblyId",
  findEquipmentByAssemblyId
);
inventoryRouter.get("/assignment/:contextType/:itemId", async (req, res) => {
  console.log("getting timeblocks by contextType and itemId");
  try {
    const timeBlock = await TimeBlock.findByContext(
      req.params.contextType,
      req.params.itemId
    );
    if (!timeBlock) {
      return res.status(404).send("TimeBlock not found");
    }

    console.log(timeBlock);
    res.status(200).send(timeBlock);
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
});
inventoryRouter.get("/assembly/:assemblyId", getAssemblyByAssemblyId);
inventoryRouter.get("/assembly/lookup/:id", getAssemblyById);
inventoryRouter.post("/assemblies", getAssembliesByIds);

module.exports = { inventoryRouter };
