const express = require("express");
const { getUserProfile } = require("../controllers/userController");
 // ✅ Ensure correct path
const authenticateUser   = require("../middlewares/authMiddleware"); // ✅ Ensure correct path

const router = express.Router();

// ✅ Route to fetch user profile
router.get("/profile", authenticateUser, getUserProfile);

module.exports = router;
