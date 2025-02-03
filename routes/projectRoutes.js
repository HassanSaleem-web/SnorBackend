const express = require("express");
const { saveProject } = require("../controllers/projectController");
const authenticateUser = require("../middlewares/authMiddleware");

const router = express.Router();

// POST endpoint to save a project
router.post("/", authenticateUser, saveProject);

module.exports = router;
