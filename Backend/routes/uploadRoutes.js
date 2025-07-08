// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadExcel } = require("../controllers/uploadController");

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".xlsx") {
      return cb(new Error("Only .xlsx files are allowed"));
    }
    cb(null, true);
  },
});

router.post("/excel", upload.single("file"), uploadExcel);

module.exports = router;
