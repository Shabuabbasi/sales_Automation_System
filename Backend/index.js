const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const uploadRoutes = require("./routes/uploadRoutes");
const emailRoutes = require("./routes/emailRoutes");

dotenv.config(); // ✅ Loads environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB using env variable
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/email", emailRoutes);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
