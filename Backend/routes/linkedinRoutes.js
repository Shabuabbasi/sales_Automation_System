//routes/linkedinRoutes.js
const express = require("express");
const router = express.Router();
const {
  handleLinkedInMessaging,
} = require("../controllers/linkedinController");

router.post("/send-messages", handleLinkedInMessaging);

module.exports = router;
