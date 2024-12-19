const multer = require("multer");

const { Router } = require("express");
const fileRouter = Router();
const { getBlob, uploadFile } = require("../controllers/fileControllers");

const storage = multer.memoryStorage(); // Use memory storage for multer
const upload = multer({ storage: storage });

fileRouter.post("/upload", upload.single("file"), uploadFile);
fileRouter.get("/file", getBlob);

module.exports = { fileRouter };
