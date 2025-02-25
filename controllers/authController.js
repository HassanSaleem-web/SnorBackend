// controllers/authController.js
const admin = require("../firebase");
const User = require("../models/User");
const verifyToken = require("../utils/verifyToken");

// Google Sign-In Handler
exports.googleSignIn = async (req, res) => {
  const { idToken, role, address } = req.body; // Accept address from frontend

  if (!idToken || !role) {
    return res.status(400).json({ message: "ID token and role are required." });
  }

  try {
    const decodedToken = await verifyToken(idToken);
    const { email, name, picture } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      // If user does not exist, create a new one
      user = new User({ 
        name, 
        email, 
        profilePic: picture, 
        role,
        address: address || "", // Store address if provided
      });
      await user.save();
    } else if (role === "user" && address) {
      // If user exists and is a HomeOwner, update their address
      user.address = address;
      await user.save();
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        address: user.address, // Return address to frontend
      },
    });
  } catch (error) {
    console.error("Error during Google sign-in:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};
