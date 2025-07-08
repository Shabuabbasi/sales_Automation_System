// services/aiService.js
const fetch = require("node-fetch");

const OPENROUTER_API_KEY = process.env.API_KEY;

async function generateMessagesForLeads(leads) {
    const results = [];

    for (const lead of leads) {
        const { firstName, lastName, niche, subject, email, linkedin } = lead;

        const contactMethod = linkedin
            ? "This message will be sent on LinkedIn. Please add a very professional tone."
            : "This message will be sent via Email. Please add a very professional tone.";

        const prompt = `Write a personalized cold outreach message to ${firstName} ${lastName}, who works in the ${niche} industry. The subject is "${subject}". ${contactMethod}`;


        try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "mistralai/mistral-7b-instruct:free",
                    messages: [{ role: "user", content: prompt }],
                }),
            });

            const data = await res.json();
            const content = data?.choices?.[0]?.message?.content || "Error generating message";

            results.push({ ...lead, aiMessage: content });
        } catch (err) {
            console.error("❌ AI API Call Failed:", err);
            results.push({ ...lead, aiMessage: "Failed to generate message" });
        }
    }
    return results;
}

module.exports = { generateMessagesForLeads };
