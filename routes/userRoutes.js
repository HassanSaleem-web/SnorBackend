// const express = require("express");
// const router = express.Router();
// const authenticateUser = require("../middlewares/authMiddleware"); // Middleware to verify token
// const User = require("../models/User"); // Assuming User is the mongoose model for users

// /**
//  * @route GET /api/user/me
//  * @desc Get the logged-in user's details
//  * @access Private
//  */
// router.get("/me", async (req, res) => {
//   console.log("Request received at GET /api/user/me"); // Debugging log
//   console.log("User ID from token:", req.user?.id); // Ensure we are getting the user ID from token

//   try {
//     const user = await User.findById(req.user.id); // Fetch user from the database using ID from the token
//     if (!user) {
//       console.error("No user found in the database with the provided ID."); // Debugging log
//       return res.status(404).json({ message: "User not found" });
//     }

//     console.log("User found:", {
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       profilePic: user.profilePic,
//     }); // Log user details fetched

//     // Return only necessary fields
//     res.status(200).json({
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       profilePic: user.profilePic,
//     });
//   } catch (error) {
//     console.error("Error fetching user data:", error.message); // Debugging log
//     res.status(500).json({ message: "Failed to fetch user data" });
//   }
// });

// /**
//  * @route PATCH /api/user/me
//  * @desc Update the logged-in user's details (Optional endpoint)
//  * @access Private
//  */
// router.patch("/me", authenticateUser, async (req, res) => {
//   const { name, profilePic } = req.body;

//   console.log("Request received at PATCH /api/user/me"); // Debugging log
//   console.log("Data to update:", { name, profilePic }); // Log request body data

//   try {
//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { name, profilePic },
//       { new: true } // Return the updated document
//     );

//     if (!user) {
//       console.error("No user found to update with the provided ID."); // Debugging log
//       return res.status(404).json({ message: "User not found" });
//     }

//     console.log("User updated successfully:", {
//       name: user.name,
//       profilePic: user.profilePic,
//     }); // Debugging log

//     res.status(200).json({
//       message: "User updated successfully",
//       user: {
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         profilePic: user.profilePic,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating user data:", error.message); // Debugging log
//     res.status(500).json({ message: "Failed to update user data" });
//   }
// });

// /**
//  * @route DELETE /api/user/me
//  * @desc Delete the logged-in user's account (Optional endpoint)
//  * @access Private
//  */
// router.delete("/me", authenticateUser, async (req, res) => {
//   console.log("Request received at DELETE /api/user/me"); // Debugging log
//   console.log("User ID from token:", req.user?.id); // Ensure we are getting the user ID from token

//   try {
//     const user = await User.findByIdAndDelete(req.user.id);

//     if (!user) {
//       console.error("No user found to delete with the provided ID."); // Debugging log
//       return res.status(404).json({ message: "User not found" });
//     }

//     console.log("User account deleted successfully:", user); // Debugging log

//     res.status(200).json({ message: "User account deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting user account:", error.message); // Debugging log
//     res.status(500).json({ message: "Failed to delete user account" });
//   }
// });

// module.exports = router;
