const dotenv = require("dotenv").config();
const { Router } = require("express");
const jobRouter = Router();
const {
  jobExport,
  deleteAll,
  jobLookup,
  findJobItemsAssigned,
  findJobsByDateRange,
  submitItemCodes,
  itemCodeLookup,
  addPriceLevelName,
  getPriceLevelName,
  enterPriceLevel,
  getAllItemCodes,
  priceLevelLookup,
  priceLevelDelete,
  priceLevelDeleteMany,
  getItemCodes,
  getItemDetails,
  getSubItemDetails,
  subItemCodeLookup,
  itemCodeLookupById,
  getSubItemCodes,
  getSubItemDetailsByCode,
  putItemCode,
  putSubItemCode,
  deleteItemCode,
  deleteSubItemCode,
  getItemDetailsWithTimeblocks,
  itemCodeAvailability,
  addJobItem,
  deleteJobItem,
  getJobItem,
  getJobItemsWithDetails,
} = require("../controllers/jobControllers");

jobRouter.post("/export", jobExport);
jobRouter.delete("/deleteAll", deleteAll);
jobRouter.get("/lookup", jobLookup);
jobRouter.get("/items/:contextType/:contextKey", findJobItemsAssigned);
jobRouter.get("/dateRange/:start/:end", findJobsByDateRange);
jobRouter.put("/dateRange/:start/:end", findJobsByDateRange);
jobRouter.put("/itemCodes", submitItemCodes);
jobRouter.get("/itemCodes", getItemCodes);
jobRouter.get("/itemCodes/:itemCode", itemCodeLookup);
jobRouter.get("/itemCodeById/:id", itemCodeLookupById);
jobRouter.get("/itemCodes/subItem/:id", subItemCodeLookup);
jobRouter.post("/priceLevelName/:levelName", addPriceLevelName);
jobRouter.get("/priceLevelName", getPriceLevelName);
jobRouter.put("/priceLevel", enterPriceLevel);
jobRouter.get("/priceLevel/:id", priceLevelLookup);
jobRouter.delete("/priceLevel/:id", priceLevelDelete);
jobRouter.delete("/priceLevel", priceLevelDeleteMany);
jobRouter.get("/itemDetails/:id", getItemDetails);
jobRouter.post("/itemDetails", getItemDetailsWithTimeblocks);
jobRouter.get("/subItemDetails/:id", getSubItemDetails);
jobRouter.get("/subItemDetails/code/:code", getSubItemDetailsByCode);
jobRouter.get("/subItemCodes", getSubItemCodes);
jobRouter.put("/itemCode/entry", putItemCode);
jobRouter.put("/subItemCode/entry", putSubItemCode);
jobRouter.delete("/itemCode/:id", deleteItemCode);
jobRouter.delete("/subItemCode/:id", deleteSubItemCode);
jobRouter.post("/itemCode/availability", itemCodeAvailability);
jobRouter.put("/jobItem", addJobItem);
jobRouter.delete("/jobItem", deleteJobItem);
jobRouter.get("/jobItems/:jobId", getJobItem);
jobRouter.get("/jobItems/details/:id", getJobItemsWithDetails);

module.exports = { jobRouter };
