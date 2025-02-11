const mongoose = require("mongoose");

// Polygon Schema
const PolygonSchema = new mongoose.Schema({
  coordinates: [
    {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    }
  ],
  addedBy: { type: String, required: true },
  area: { type: Number, required: true, default: 0 } // New field for individual polygon area
});

// Polyline Schema
const PolylineSchema = new mongoose.Schema({
  coordinates: [
    {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    }
  ],
  addedBy: { type: String, required: true },
  length: { type: Number, required: true, default: 0 } // New field for individual polyline length
});

// Project Schema
const ProjectSchema = new mongoose.Schema({
  admin: { type: String, required: true },
  address: { type: String, required: true },
  projectName: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "Active" },
  polygons: [PolygonSchema], // Stores all polygons with coordinates and area
  polylines: [PolylineSchema], // Stores all polylines with coordinates and length
  totalArea: { type: Number, default: 0 }, // Sum of all polygon areas
  totalLength: { type: Number, default: 0 } // Sum of all polyline lengths
});

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
