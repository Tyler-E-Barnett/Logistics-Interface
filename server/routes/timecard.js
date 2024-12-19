const { Router } = require("express");
const timecardRouter = Router();
const { punchesToday } = require("../controllers/timecardControllers");

timecardRouter.get("/punchesToday", punchesToday);

module.exports = { timecardRouter };
