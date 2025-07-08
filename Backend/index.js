const express = require("express");
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Routes
const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);

// Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
