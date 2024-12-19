const { Router } = require("express");
const facilityRouter = Router();
const {
  facilityExport,
  facilityLookup,
} = require("../controllers/facilityControllers");

facilityRouter.put("/export", facilityExport);
facilityRouter.get("/lookup", facilityLookup);

module.exports = { facilityRouter };
