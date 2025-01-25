const express = require("express");
const { googleSignIn } = require("../controllers/authController");

const router = express.Router();
const User = require("../models/User"); // Adjust the path as needed
const authMiddleware = require("../middlewares/authMiddleware"); // Middleware to verify the token

// Endpoint to fetch user details


// Google Sign-In Route
router.post("/google-signin", googleSignIn);
router.get("/me", authMiddleware, async (req, res) => {
    console.log("HEREEEEEE");
    
    try {
        console.log(req.user);
      const user = await User.findOne({email: req.user.email}); // Extract user ID from the token
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ name: user.name, email: user.email });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
 

module.exports = router;
