const { Router } = require("express");
const { filemakerRouter } = require("./filemaker");
const { runRouter } = require("./run");
const { jobRouter } = require("./job");
const { personnelRouter } = require("./personnel");
const { microsoftRouter } = require("./microsoft");
const { logisticsRouter } = require("./logistics");
const { timecardRouter } = require("./timecard");
const { inventoryRouter } = require("./inventory");
const { fileRouter } = require("./file");
const { facilityRouter } = require("./facility");
const apiRouter = Router();

apiRouter.use("/filemaker", filemakerRouter);
apiRouter.use("/runData", runRouter);
apiRouter.use("/jobData", jobRouter);
apiRouter.use("/personnel", personnelRouter);
apiRouter.use("/microsoft", microsoftRouter);
apiRouter.use("/logistics", logisticsRouter);
apiRouter.use("/timecard", timecardRouter);
apiRouter.use("/inventory", inventoryRouter);
apiRouter.use("/files", fileRouter);
apiRouter.use("/facilities", facilityRouter);

module.exports = { apiRouter };
