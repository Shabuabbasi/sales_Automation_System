const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Route imports
const uploadRoutes = require("./routes/uploadRoutes");
const emailRoutes = require("./routes/emailRoutes");
const webhookRoutes = require("./routes/webRoutes");
const linkedinRoutes = require("./routes/linkedinRoutes");

dotenv.config(); // ✅ Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/api/linkedin", linkedinRoutes);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
