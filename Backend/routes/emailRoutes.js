const express = require("express");
const router = express.Router();
const { sendApprovedEmail } = require("../controllers/emailController");

router.post("/send", sendApprovedEmail);

module.exports = router;
