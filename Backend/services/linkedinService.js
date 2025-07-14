
const axios = require("axios");

const PHANTOMBUSTER_API_KEY = process.env.PHANTOMBUSTER_API_KEY;
const PHANTOMBUSTER_AGENT_ID = process.env.PHANTOMBUSTER_AGENT_ID;

const sendLinkedInMessages = async (leads) => {
  const results = [];

  for (const lead of leads) {
    const { linkedin, aiMessage, sendConnectionRequest } = lead;

    if (!linkedin || !aiMessage) {
      results.push({ linkedin, status: "skipped - missing data" });
      continue;
    }

    try {
      const response = await axios.post(
        `https://api.phantombuster.com/api/v2/agent/${PHANTOMBUSTER_AGENT_ID}/launch`,
        {
          output: "object",
          arguments: {
            profileUrl: linkedin,
            message: aiMessage,
            sendConnectionRequest: sendConnectionRequest || false,
          },
        },
        {
          headers: {
            "X-Phantombuster-Key-1": PHANTOMBUSTER_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.status === "error" || response.data?.error) {
        results.push({
          linkedin,
          status: "phantom-error",
          error: response.data.error || "Unknown PhantomBuster error",
        });
        continue;
      }

      results.push({
        linkedin,
        status: "sent",
        jobId: response.data.id,
      });
    } catch (error) {
      results.push({
        linkedin,
        status: "failed",
        error: error.message,
      });
    }
  }

  return results;
};

module.exports = { sendLinkedInMessages };
