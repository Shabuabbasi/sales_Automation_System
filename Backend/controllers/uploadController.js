// controllers/uploadController.js
const { parseExcelFile } = require("../services/excelService");
const { validateLeads } = require("../services/leadValidationService");

const uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await parseExcelFile(req.file.path);

    if (!result.success) {
      return res.status(400).json({ message: "File parsing failed", errors: result.errors });
    }

    
    const { validLeads, invalidLeads } = validateLeads(result.leads);

    if(invalidLeads.length > 0) {
      return res.status(400).json({
        message:"Data errors",
        invalidLeads
      });
    }

    return res.status(200).json({
      message: "File uploaded and validated",
      validLeads,
    });

  } catch (error) {
    console.error("Upload error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadExcel };
