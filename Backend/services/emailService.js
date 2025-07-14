require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendBulkEmail(leads) {
  const results = [];

  for (const lead of leads) {
    try {
      const message = lead.aiMessage; // AI-generated message
      const subject = lead.subject || "📢 Sales Email";

      const msg = {
        to: lead.email,
        from: process.env.FROM_EMAIL,
        subject: subject,
        text: message,
        html: `<p>${message.replace(/\n/g, "<br>")}</p>`,
        trackingSettings: {
          clickTracking: { enable: true, enableText: true },
          openTracking: { enable: true },
        },
      };

      const response = await sgMail.send(msg);
      console.log(
        `✅ Sent to ${lead.email}, Status: ${response[0].statusCode}`
      );
      results.push({ email: lead.email, status: "sent" });
    } catch (error) {
      console.error(`❌ Error sending to ${lead.email}:`, error.message);
      results.push({ email: lead.email, error: error.message });
    }
  }

  return { success: true, results };
}

module.exports = { sendBulkEmail };
