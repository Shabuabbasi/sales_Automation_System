const { sendBulkEmail } = require("../services/emailService");
const Lead = require("../models/Lead");

const sendApprovedEmail = async (req, res) => {
  try {
    // 🧠 Correct variable name
    const leadsToSend = await Lead.find({
      aiMessage: { $exists: true, $ne: "" },
      isEmailed: false,
    });

    if (leadsToSend.length === 0) {
      return res
        .status(400)
        .json({ message: "No unsent leads found in database." });
    }

    const result = await sendBulkEmail(leadsToSend);

    // ✅ Mark sent
    const emailList = leadsToSend.map((lead) => lead.email);
    await Lead.updateMany(
      { email: { $in: emailList } },
      { $set: { isEmailed: true } }
    );

    return res.status(200).json({ message: "Emails sent", result });
  } catch (err) {
    console.error("Email sending error:", err.message);
    return res.status(500).json({ error: "Failed to send emails" });
  }
};

module.exports = { sendApprovedEmail };
