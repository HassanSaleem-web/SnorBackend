const User = require("../models/User");

// ✅ Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select("-__v -createdAt -updatedAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getUserProfile }; // ✅ Make sure this is exported correctly
