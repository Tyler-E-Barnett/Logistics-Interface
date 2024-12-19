const { Router } = require("express");
const logisticsRouter = Router();
const {
  aggregateRunsOperationsJobs,
  aggregateRunstoJobstoOperations,
  getUserScheduleWorkWeek,
  getScheduleWorkWeek,
  aggregateJobsWithItems,
  aggregateJobsWithItemsbyId,
  timeblockRangeLookup,
  findTimeBlockByContextAndRange,
  findTimeBlockByContextId,
  aggregateJobsWithItemsbyIdWithAssemblies,
} = require("../controllers/logisticControllers");

logisticsRouter.get("/runBreakdown/:run", aggregateRunsOperationsJobs);
logisticsRouter.get(
  "/runBreakdowntoJobs/:run",
  aggregateRunstoJobstoOperations
);
logisticsRouter.get("/availability/:date/:userId", getUserScheduleWorkWeek);
logisticsRouter.get("/availability/:date", getScheduleWorkWeek);
logisticsRouter.get("/jobItems", aggregateJobsWithItemsbyId);
// need to pick one of these.  either go with params or queries
logisticsRouter.get("/timeblock/lookup", timeblockRangeLookup);
// need to change this to use queries
logisticsRouter.get(
  "/timeblock/:contextType/:itemId/:start/:end",
  findTimeBlockByContextAndRange
);
logisticsRouter.get(
  "/timeblock/context/:contextType/:contextKey",
  findTimeBlockByContextId
);
logisticsRouter.get(
  "/jobItems/facility",
  aggregateJobsWithItemsbyIdWithAssemblies
);

module.exports = { logisticsRouter };
