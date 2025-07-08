require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const uploadRoutes = require("./routes/uploadRoutes");

dotenv.config();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/upload", uploadRoutes); // ✅ Only this needed now

// Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
