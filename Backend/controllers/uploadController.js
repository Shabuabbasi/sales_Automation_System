const { parseExcelFile } = require("../services/excelService");
const { validateLeads } = require("../services/leadValidationService");
const { generateMessagesForLeads } = require("../services/aiService");
const Lead = require("../models/Lead"); // ⬅️ import model

const uploadExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await parseExcelFile(req.file.path);
    if (!result.success) {
      return res
        .status(400)
        .json({ message: "Parsing failed", errors: result.errors });
    }

    const { validLeads, invalidLeads } = validateLeads(result.leads);
    if (invalidLeads.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", invalidLeads });
    }

    const enrichedLeads = await generateMessagesForLeads(validLeads);
    // Save to MongoDB
    await Lead.insertMany(
      enrichedLeads.map((lead) => ({ ...lead, isEmailed: false }))
    );

    return res.status(200).json({
      message: "File uploaded, validated, AI messages generated & saved",
      enrichedLeads,
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadExcel };
