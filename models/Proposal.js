const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
    proposalSender: { type: String, required: true },  // ✅ Required Field
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    projectAdmin: { type: String, required: true }, // ✅ Required Field
    priceQuoted: { type: Number, required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  });
  
module.exports = mongoose.model("Proposal", proposalSchema);
