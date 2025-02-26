
/*const AccessRequest = require("../models/AccessRequest");
const LinkedProject = require("../models/LinkedProject");*/ 

// Save or update a project
const Project = require("../models/Project");

const saveProject = async (req, res) => {
  try {
    const { projectName, description, status, address, shapes } = req.body;
    const admin = req.user.email; // Get the logged-in user’s email

    // Ensure shapes array exists and is valid
    if (!shapes || !Array.isArray(shapes) || shapes.length === 0) {
      return res.status(400).json({ message: "At least one shape is required." });
    }

    // Ensure all shapes have required fields
    const validatedShapes = shapes.map((shape) => ({
      coordinates: shape.coordinates || [],
      addresses: shape.addresses || [],
      shapeType: shape.shapeType, 
      area: shape.area || null,
      length: shape.length || null,
    }));

    // Check if the project already exists for this admin
    let project = await Project.findOne({ projectName, admin });

    if (project) {
      // ✅ If project exists, update it
      project.description = description;
      project.status = status;
      project.address = address;
      project.shapes = validatedShapes; // Update shapes list
      await project.save();
      return res.status(200).json({ message: "Project updated successfully", project });
    } else {
      // ✅ If project does not exist, create a new one
      project = new Project({
        projectName,
        description,
        status,
        address,
        admin,
        shapes: validatedShapes,
      });

      await project.save();
      return res.status(201).json({ message: "Project created successfully", project });
    }
  } catch (error) {
    console.error("Error saving project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { saveProject };
// Get all projects created by the logged-in user
const getMyProjects = async (req, res) => {
  try {
    const adminEmail = req.user.email;
    const projects = await Project.find({ admin: adminEmail });
    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProject = async (req, res) => {
  try {
    console.log("📌 Incoming Update Request:", req.body); // Debugging log

    const { _id, projectName, description, status, address, shapes } = req.body;
    console.log("shapetype logger",shapes[0]);

    if (!_id) {
      console.error("❌ Error: Project ID is missing in request.");
      return res.status(400).json({ message: "Project ID is required." });
    }

    // ✅ Find project in DB
    const project = await Project.findById(_id);

    if (!project) {
      console.error("❌ Error: No project found with ID:", _id);
      return res.status(404).json({ message: "Project not found." });
    }

    console.log("🔍 Existing Project Found:", project);

    // ✅ Dynamically import spherical-geometry-js
    const { computeArea, computeLength, LatLng } = await import("spherical-geometry-js");

    // ✅ Helper functions for calculations
    const calculatePolygonArea = (coordinates) => {
      return computeArea(coordinates.map(({ lat, lng }) => new LatLng(lat, lng)));
    };

    const calculatePolylineLength = (coordinates) => {
      return computeLength(coordinates.map(({ lat, lng }) => new LatLng(lat, lng)));
    };

    // ✅ Process each shape correctly
    const updatedShapes = shapes.map((shape) => {
      let updatedShape = { ...shape };

      if (shape.shapeType === "Polygon") {
        updatedShape.area = `${calculatePolygonArea(shape.coordinates).toFixed(2)} m²`;
        updatedShape.length = null; // Polygons don't have length
      } else if (shape.shapeType === "Polyline") {
        updatedShape.length = `${calculatePolylineLength(shape.coordinates).toFixed(2)} m`;
        updatedShape.area = null; // Polylines don't have area
      }

      return updatedShape;
    });

    console.log("✅ Updated Shapes:", updatedShapes);

    // ✅ Update project fields
    project.projectName = projectName;
    project.description = description;
    project.status = status;
    project.shapes = updatedShapes;

    await project.save();

    console.log("✅ Project Updated Successfully");
    return res.status(200).json({ message: "Project updated successfully", project });

  } catch (error) {
    console.error("❌ Error updating project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the project by ID and ensure the requesting user is the admin
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.admin !== req.user.email) {
      return res.status(403).json({ message: "Unauthorized: You can only delete your own projects." });
    }

    // Delete the project
    await Project.findByIdAndDelete(id);

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllOtherProjects = async (req, res) => {
  console.log("Calling getAllOtherProjects...");
  try {
    const adminEmail = req.user.email; // Logged-in user's email

    // ✅ Fetch all projects where the logged-in user is NOT the admin
    const projects = await Project.find({ admin: { $ne: adminEmail } });

    // ✅ Calculate total addresses in each project
    const projectsWithAddressCount = projects.map((project) => ({
      ...project._doc,
      totalAddresses: project.shapes.reduce(
        (count, shape) => count + (shape.addresses ? shape.addresses.length : 0),
        0
      ),
    }));

    res.status(200).json({ projects: projectsWithAddressCount });
  } catch (error) {
    console.error("Error fetching all other projects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


/*





// Helper function to calculate polygon area
const calculatePolygonArea = (coordinates) => {
  const { computeArea } = require("spherical-geometry-js"); // Use Google Maps API library
  return computeArea(coordinates.map(({ lat, lng }) => new google.maps.LatLng(lat, lng)));
};

// Helper function to calculate polyline length
const calculatePolylineLength = (coordinates) => {
  const { computeLength } = require("spherical-geometry-js");
  return computeLength(coordinates.map(({ lat, lng }) => new google.maps.LatLng(lat, lng)));
};



// Get a specific project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.admin !== req.user.email && !project.linkedUsers.includes(req.user.email)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// =======================================
// 📌 NEW FUNCTIONALITY: ACCESS REQUESTS 📌
// =======================================

// Request access to a project
const requestAccess = async (req, res) => {
  try {
    const { projectId, adminEmail } = req.body;
    const requesterEmail = req.user.email; // ✅ Extract from logged-in user

    if (!adminEmail || !requesterEmail) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const request = new AccessRequest({
      projectId,
      adminEmail,
      requesterEmail,
      status: "pending",
    });

    await request.save();
    res.status(201).json({ message: "Access request sent successfully." });
  } catch (error) {
    console.error("Error requesting access:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get all access requests for a project (Admin View)
const getAccessRequests = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.admin !== req.user.email) {
      return res.status(403).json({ message: "Unauthorized to view requests." });
    }

    const requests = await AccessRequest.find({ projectId });
    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching access requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Handle access request (Approve/Deny)
const handleAccessRequest = async (req, res) => {
  try {
    const { projectId, userEmail, action } = req.body;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.admin !== req.user.email) {
      return res.status(403).json({ message: "Unauthorized action." });
    }

    const request = await AccessRequest.findOne({ projectId, requesterEmail: userEmail });
    if (!request) {
      return res.status(404).json({ message: "Access request not found." });
    }

    if (action === "approve") {
      // 🔹 Create or update LinkedProject entry
      let linkedProject = await LinkedProject.findOne({ projectId });

      if (!linkedProject) {
        linkedProject = new LinkedProject({
          projectId,
          linkedUsers: [userEmail],
        });
      } else {
        if (!linkedProject.linkedUsers.includes(userEmail)) {
          linkedProject.linkedUsers.push(userEmail);
        }
      }

      await linkedProject.save();

      // 🛑 Delete **all** requests from the same requester for this project
      await AccessRequest.deleteMany({ projectId, requesterEmail: userEmail });

      return res.status(200).json({ message: "Request approved. All requests from this user removed." });
    }

    if (action === "deny") {
      // ❌ If denied, just delete the request
      await AccessRequest.deleteOne({ _id: request._id });
      return res.status(200).json({ message: "Request denied and deleted." });
    }

    return res.status(400).json({ message: "Invalid action." });

  } catch (error) {
    console.error("Error handling access request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get all linked projects for the logged-in user
const getLinkedProjects = async (req, res) => {
  try {
    const userEmail = req.user.email; // Get the logged-in user's email

    // Find all linked projects for this user
    const linkedProjects = await LinkedProject.find({ linkedUsers: userEmail });

    if (!linkedProjects.length) {
      return res.status(200).json({ projects: [] }); // No linked projects found
    }

    // Fetch full project details for each linked project
    const projectIds = linkedProjects.map(lp => lp.projectId);
    const projects = await Project.find({ _id: { $in: projectIds } });

    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching linked projects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};*/



module.exports = {
  saveProject,
  getMyProjects,
  getAllOtherProjects,
  /*getProjectById,
  requestAccess,
  
  getAccessRequests,
  handleAccessRequest,
  getLinkedProjects,*/
  updateProject,
  deleteProject,
};
