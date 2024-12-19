const { Router } = require("express");
const microsoftRouter = Router();
const {
  getShopShifts,
  getTimeOffs,
  shopShiftsToTimeBlock,
  timeOffsToTimeBlock,
} = require("../controllers/teamsShiftsControllers");

microsoftRouter.get("/shopShifts", getShopShifts);
microsoftRouter.get("/timeOffs", getTimeOffs);
microsoftRouter.put("/shopShiftsToTimeBlocks/:date", shopShiftsToTimeBlock);
microsoftRouter.put("/timeOffsToTimeBlocks/:date", timeOffsToTimeBlock);

module.exports = { microsoftRouter };
