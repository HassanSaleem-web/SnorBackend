// controllers/authController.js
const admin = require("../firebase");
const User = require("../models/User");
const verifyToken = require("../utils/verifyToken");

// // Verify Firebase ID token
// const verifyToken = async (idToken) => {
//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     return decodedToken;
//   } catch (error) {
//     console.error("Error verifying Firebase token:", error.message);
//     throw new Error("Invalid or expired token.");
//   }
// };

// Sign in or sign up user
exports.googleSignIn = async (req, res) => {
  const { idToken, role } = req.body;

  if (!idToken || !role) {
    return res.status(400).json({ message: "ID token and role are required." });
  }

  try {
    const decodedToken = await verifyToken(idToken);
    const { email, name, picture } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      // If user does not exist, create a new one
      user = new User({ name, email, profilePic: picture, role });
      await user.save();
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Error during Google sign-in:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};
