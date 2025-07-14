const express = require("express");
const router = express.Router();

router.post("/sendgrid", (req, res) => {
  try {
    const events = req.body;

    if (!Array.isArray(events)) {
      console.error("❌ Webhook payload is not an array.");
      return res.status(400).send("Invalid payload");
    }

    events.forEach((event) => {
      console.log(`📊 Event: ${event.event} | Email: ${event.email}`);
    });

    res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Error parsing webhook:", error.message);
    res.status(400).send("Invalid JSON");
  }
});

module.exports = router;
