const axios = require("axios");

const PHANTOMBUSTER_API_KEY = process.env.PHANTOMBUSTER_API_KEY;
const PROFILE_SCRAPER_AGENT_ID = process.env.PROFILE_SCRAPER_AGENT_ID;

const checkConnectionDegree = async (linkedinUrl) => {
  try {
    // Launch the Phantom scraper
    const launchRes = await axios.post(
      `https://api.phantombuster.com/api/v2/agent/${PROFILE_SCRAPER_AGENT_ID}/launch`,
      {
        output: "object",
        arguments: { profileUrl: linkedinUrl },
      },
      {
        headers: {
          "X-Phantombuster-Key-1": PHANTOMBUSTER_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const jobId = launchRes.data.id;

    // Poll every 3s for max 30s (10 retries)
    for (let i = 0; i < 10; i++) {
      await new Promise((res) => setTimeout(res, 3000));

      const outputRes = await axios.get(
        `https://api.phantombuster.com/api/v2/agent/${PROFILE_SCRAPER_AGENT_ID}/output`,
        {
          headers: { "X-Phantombuster-Key-1": PHANTOMBUSTER_API_KEY },
        }
      );

      const degree = outputRes.data?.output?.connectionDegree;
      if (degree) return degree;
    }

    return "unknown";
  } catch (err) {
    console.error("❌ Connection degree check failed:", err.message);
    return "unknown";
  }
};

module.exports = { checkConnectionDegree };
