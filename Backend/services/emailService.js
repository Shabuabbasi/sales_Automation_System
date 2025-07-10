const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendBulkEmail(leads) {
  const results = [];

  for (const lead of leads) {
    try {
      const message = lead.aiMessage; // ⬅️ use personalized message
      const subject = lead.subject || "📢 Sales Email";

      const mailOptions = {
        from: `"Sales Bot" <${process.env.EMAIL_USER}>`,
        to: lead.email,
        subject: subject,
        text: message,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Sent to ${lead.email}, ID: ${info.messageId}`);
      results.push({ email: lead.email, status: "sent" });
    } catch (error) {
      console.error(`❌ Error sending to ${lead.email}:`, error.message);
      results.push({ email: lead.email, error: error.message });
    }
  }

  return { success: true, results };
}

module.exports = { sendBulkEmail };
