const dotenv = require("dotenv").config();
const { Router } = require("express");
const runRouter = Router();
const {
  getRunData,
  runExport,
  deleteAll,
  triggerRunExport,
  getJobWindowFromOperations,
} = require("../controllers/runControllers");

runRouter.get("/runData/:date", getRunData);
runRouter.put("/export", runExport);
runRouter.post("/triggerRunExport", triggerRunExport);
runRouter.delete("/deleteAll", deleteAll);
runRouter.get("/jobWindow/:jobNumber", getJobWindowFromOperations);

module.exports = { runRouter };
