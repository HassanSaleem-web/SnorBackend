const express = require("express");
const { submitProposal, getProposalsByAdmin } = require("../controllers/proposalController");
const  protect = require("../middlewares/authMiddleware");

const router = express.Router();

// Route for submitting a proposal
router.post("/submit", protect, submitProposal);
router.get("/admin-proposals", protect, getProposalsByAdmin);

module.exports = router;
