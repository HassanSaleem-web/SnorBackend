const mongoose = require("mongoose");

const polygonSchema = new mongoose.Schema({
  coordinates: [{ lat: Number, lng: Number }],
  addedBy: { type: String, required: true }, // Email of the user who added the polygon
});

const polylineSchema = new mongoose.Schema({
  coordinates: [{ lat: Number, lng: Number }],
  addedBy: { type: String, required: true }, // Email of the user who added the polyline
});

const projectSchema = new mongoose.Schema({
  admin: { type: String, required: true }, // Email of the admin
  address: { type: String, required: true },
  projectName: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Active", "Completed"], default: "Active" },
  polygons: [polygonSchema], // Array of polygons
  polylines: [polylineSchema], // Array of polylines
  totalArea: { type: Number, default: 0 }, // Total area of all polygons
  totalLength: { type: Number, default: 0 }, // Total length of all polylines
});

module.exports = mongoose.model("Project", projectSchema);
