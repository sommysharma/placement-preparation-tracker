require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const dsaRoutes = require("./routes/dsaRoutes");
const sqlRoutes = require("./routes/sqlRoutes");
const companyRoutes = require("./routes/companyRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const mockInterviewRoutes = require("./routes/mockInterviewRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/resume", resumeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dsa", dsaRoutes);
app.use("/api/sql", sqlRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/mock-interviews", mockInterviewRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Placement Tracker Backend is Running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});