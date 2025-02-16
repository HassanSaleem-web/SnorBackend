const Proposal = require("../models/Proposal");
const Project = require("../models/Project");

// Submit a proposal

const submitProposal = async (req, res) => {
  try {
    const { senderEmail, projectId, adminEmail, priceQuoted } = req.body;
    console.log("Data, in backend",senderEmail, projectId, adminEmail, priceQuoted);

    if (!senderEmail || !projectId || !adminEmail || !priceQuoted) {
      return res.status(400).json({ message: "All fields are required." });
    }
console.log("hello im here");
    const newProposal = new Proposal({
      proposalSender:senderEmail,
      projectId,
      projectAdmin:adminEmail,
      priceQuoted,
      status: "pending", // ✅ Automatically set to "in process"
    });

    await newProposal.save();
    console.log("here now doofus");
    res.status(201).json({ message: "Proposal submitted successfully!", proposal: newProposal });
  } catch (error) {
    console.error("Error submitting proposal:", error);
    res.status(500).json({ message: "Server error while submitting proposal." });
  }
};



// ✅ Fetch Proposals for a Specific Admin
const getProposalsByAdmin = async (req, res) => {
    try {
      const adminEmail = req.user.email; // Get logged-in admin's email
      const proposals = await Proposal.find({ projectAdmin: adminEmail });
  
      
  
      res.status(200).json({ message: "Proposals retrieved successfully!", proposals });
    } catch (error) {
      console.error("Error fetching proposals:", error);
      res.status(500).json({ message: "Server error while fetching proposals." });
    }
  };
  
  module.exports = { submitProposal, getProposalsByAdmin };
  