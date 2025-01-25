// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["user", "contractor"], required: true },
    profilePic: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
