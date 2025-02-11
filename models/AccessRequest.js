const mongoose = require("mongoose");

const AccessRequestSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // Reference to the Project model
      required: true,
    },
    requesterEmail: {
      type: String,
      required: true,
    },
    adminEmail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "denied"], // Predefined values for status
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set the request creation date
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt
);

module.exports = mongoose.model("AccessRequest", AccessRequestSchema);
