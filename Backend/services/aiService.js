const fetch = require("node-fetch");
require("dotenv").config();

const OPENROUTER_API_KEY = process.env.API_KEY;

async function generateMessagesForLeads(leads) {
  const promises = leads.map(async (lead) => {
    const { firstName, lastName, niche, subject, email, linkedin } = lead;

    const contactMethod = linkedin
      ? "This message will be sent on LinkedIn. Please use a very professional and concise tone."
      : "This message will be sent via Email. Please use a warm, persuasive tone appropriate for outreach.";

      const prompt = `
      Write a personalized cold outreach message to ${firstName} ${lastName}, who works in the ${niche} industry.
      
      The subject is: "${subject}".
      
      This message will be sent via Email. Use a warm and persuasive tone.
      
      At the end of the message, after "Best regards,", include the following sender info:
      - Name: Salahudin
      - Title: Sales Outreach Specialist
      - Email: salahudin@example.com
      - Phone: +92-300-1234567
      - Niche: ${niche}
      
      Do NOT add placeholders like [Your Name], [Your Company], or any fake company names. Only include the details exactly as listed above. Do not invent anything.
      
      Keep the message professional and under 200 words.
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
              content: "You are a professional B2B sales email copywriter.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      const data = await res.json();
      const content =
        data?.choices?.[0]?.message?.content || "Error generating message";

      return { ...lead, aiMessage: content };
    } catch (err) {
      console.error("❌ AI API Call Failed:", err.message);
      return { ...lead, aiMessage: "Failed to generate message" };
    }
  });

  // Run all requests in parallel
  const results = await Promise.all(promises);
  return results;
}

module.exports = { generateMessagesForLeads };
