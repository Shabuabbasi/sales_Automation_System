// 📄 PROFILE: Controller for handling LinkedIn messaging logic (splitting leads and routing to correct service)

const { checkConnectionDegree } = require("../services/profileScraperService");
const { sendLinkedInMessages } = require("../services/linkedinService");

/**
 * 🎯 handleLinkedInMessaging:
 * Receives array of leads from frontend with LinkedIn + aiMessage.
 * Checks if connection is 1st-degree or not.
 * Sends either a message or a connection request based on that.
 */
const handleLinkedInMessaging = async (req, res) => {
  const { leads } = req.body;

  // 🧪 Basic check: leads must be an array
  if (!Array.isArray(leads)) {
    return res.status(400).json({ error: "Leads should be an array" });
  }

  const firstDegree = []; // 🧑‍💼 Already connected → send message
  const others = [];      // 🔗 Not connected → send connection request

  // 🔁 Loop through all leads
  for (const lead of leads) {
    const { linkedin, aiMessage } = lead;

    if (!linkedin || !aiMessage) {
      console.warn("⚠️ Skipping: Missing LinkedIn or aiMessage");
      continue;
    }

    // 🔍 Get connection degree from PhantomBuster
    const connectionDegree = await checkConnectionDegree(linkedin);

    // 🧠 Separate leads by connection type
    if (connectionDegree === "1st") {
      firstDegree.push({ ...lead, sendConnectionRequest: false });
    } else {
      others.push({ ...lead, sendConnectionRequest: true });
    }
  }

  // ✉️ Send message to 1st-degree connections
  const messageResults = await sendLinkedInMessages(firstDegree);

  // 🤝 Send connection requests to others (with message)
  const requestResults = await sendLinkedInMessages(others);

  // 📤 Respond to frontend with summary
  res.status(200).json({
    message: "LinkedIn messaging completed",
    stats: {
      sentMessages: messageResults.length,
      sentRequests: requestResults.length,
    },
    results: {
      messages: messageResults,
      requests: requestResults,
    },
  });
};

module.exports = { handleLinkedInMessaging };
