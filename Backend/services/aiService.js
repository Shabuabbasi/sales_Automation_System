const fetch = require("node-fetch");
require("dotenv").config();

const OPENROUTER_API_KEY = process.env.API_KEY;

async function generateMessagesForLeads(leads) {
  const promises = leads.map(async (lead) => {
    const { firstName, lastName, niche, subject, linkedin } = lead;

    const isLinkedIn = !!linkedin;

    // ✅ Platform-specific tone and style
    const contactTone = isLinkedIn
      ? "This message will be sent on LinkedIn. Please use a concise, professional, and formal tone suitable for cold outreach on that platform."
      : "This message will be sent via Email. Please use a warm, persuasive, and friendly tone for B2B email outreach.";

    // ✅ Shared prompt template
    const prompt = `
Write a personalized cold outreach message to ${firstName} ${lastName}, who works in the ${niche} industry.

The subject is: "${subject}".

${contactTone}

At the end of the message, after "Best regards,", include the following sender info:
- Name: Salahudin
- Title: Sales Outreach Specialist
- Email: salahudin@example.com
- Phone: +92-1234567890
- Niche: ${niche}

❗ Do NOT add placeholders like [Your Name], [Your Company], or make up any extra info. Only include the above exactly as given.

Keep it under 200 words.
`;

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "system",
              content: "You are an expert in writing B2B sales outreach messages for both email and LinkedIn.",
            },
            {
              role: "user",
              content: prompt.trim(),
            },
          ],
        }),
      });

      const data = await res.json();
      const message = data?.choices?.[0]?.message?.content?.trim();

      return {
        ...lead,
        aiMessage: message || "Error generating message",
      };
    } catch (error) {
      console.error("❌ AI API Call Failed:", error.message);
      return {
        ...lead,
        aiMessage: "Failed to generate message",
      };
    }
  });

  return await Promise.all(promises);
}

module.exports = { generateMessagesForLeads };
