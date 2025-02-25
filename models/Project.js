const mongoose = require("mongoose");

const ShapeSchema = new mongoose.Schema({
  coordinates: [
    {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    }
  ],
  addresses: [
    {
      lat: Number,
      lng: Number,
      name: String,
    },
  
  ],
  shapeType: {type:String, required: true},
  area: { type: String, default: null }, // If it's a polygon, store area
  length: { type: String, default: null }, // If it's a polyline, store length
}, { _id: false }); // Prevents auto-generating _id for each shape

const ProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Active", "Completed", "Pending"], default: "Active" },
  address: { type: String, required: true },
  admin: { type: String, required: true }, // Stores the email of the project owner
  shapes: [ShapeSchema], // Array of shapes (can be polygons or polylines)
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
