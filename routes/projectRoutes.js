const express = require("express");
const router = express.Router();
const {
  saveProject,
  getMyProjects,
  getProjectById,
  getAllOtherProjects,
  requestAccess,
  getAccessRequests,
  handleAccessRequest,
  getLinkedProjects,
  updateProject // ✅ Import the new function
} = require("../controllers/projectController");
const authMiddleware = require("../middlewares/authMiddleware");

// Route to save or update a project
router.post("/", authMiddleware, saveProject);

// Route to get all projects created by the logged-in user
router.get("/my-projects", authMiddleware, getMyProjects);

// Route to get a specific project by ID
router.get("/all-other-projects", authMiddleware, getAllOtherProjects);
// 📌 NEW: Fetch linked projects (Must be above dynamic :id route)
router.get("/linked-projects", authMiddleware, getLinkedProjects);
router.get("/:id", authMiddleware, getProjectById);

// =====================================
// 📌 NEW ROUTES FOR ACCESS REQUESTS
// =====================================

// Request access to a project
router.post("/request-access", authMiddleware, requestAccess);

// Get all access requests for a specific project (Admin Only)
router.get("/:projectId/requests", authMiddleware, getAccessRequests);

// Handle access request (Approve/Deny)
router.post("/handle-access-request", authMiddleware, handleAccessRequest);

// =====================================
// 📌 NEW ROUTES FOR LINKED PROJECTS
// =====================================
// Route to update an existing project (Admin & Linked Users)
router.put("/update", authMiddleware, updateProject);



// Link a project to a user when access is approved


module.exports = router;
