const dotenv = require("dotenv").config();
const { Router } = require("express");
const filemakerRouter = Router();
const {
  ScriptResults,
  CrewShifts,
  CrewPersonnel,
  getTimeBlocks,
  getPersonnel,
  getFacility,
  getEquipment,
  getCrew,
} = require("../controllers/filemakerController");

filemakerRouter.get("/crewList", CrewPersonnel);
filemakerRouter.get("/crewShifts/:date", CrewShifts);
filemakerRouter.post("/script", ScriptResults);
filemakerRouter.get("/timeblocks/:database/:table", getTimeBlocks);
filemakerRouter.get("/personnel", getPersonnel);
filemakerRouter.get("/facility", getFacility);
filemakerRouter.get("/equipment", getEquipment);
filemakerRouter.get("/crewPersonnel", getCrew);

module.exports = { filemakerRouter };
