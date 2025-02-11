const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:5000" })); // Allow frontend requests

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes); // Updated Project Routes

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
