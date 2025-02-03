const Project = require("../models/Project");

const saveProject = async (req, res) => {
  try {
    const { projectName, description, status, polygons, polylines, totalArea, totalLength } = req.body;

    if (!projectName || !description || !req.user || !req.user.email) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const projectData = {
      admin: req.user.email, // The user's email will be stored as the admin
      address: req.body.address || "Unknown Address",
      projectName,
      description,
      status,
      polygons: polygons.map((polygon) => ({ coordinates: polygon, addedBy: req.user.email })),
      polylines: polylines.map((polyline) => ({ coordinates: polyline, addedBy: req.user.email })),
      totalArea,
      totalLength,
    };

    const project = new Project(projectData);
    await project.save();

    res.status(201).json({ message: "Project saved successfully!", project });
  } catch (error) {
    console.error("Error saving project:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { saveProject };
