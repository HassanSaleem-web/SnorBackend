const mongoose = require("mongoose");

const LinkedProjectSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, unique: true },
  linkedUsers: [{ type: String, required: true }], // Stores multiple user emails
});

const LinkedProject = mongoose.model("LinkedProject", LinkedProjectSchema);
module.exports = LinkedProject;
