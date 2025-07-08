// salesAutomation/services/excelService.js
const ExcelJS = require("exceljs");
const fs = require("fs");

const getCellValue = (cell) => {
  if (!cell) return "";
  const val = cell.value;
  if (typeof val === "object" && val !== null) {
    return val.text || val.hyperlink || "";
  }
  return val ? val.toString().trim() : "";
};

const parseExcelFile = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.worksheets[0];

  const headerRow = worksheet.getRow(1);
  const headers = headerRow.values.slice(1).map((val) =>
    (val || "").toString().toLowerCase().trim()
  );

  // Column checks
  const hasFirstName = headers.includes("firstname");
  const hasLastName = headers.includes("lastname");
  const hasEmail = headers.includes("email");
  const hasLinkedIn = headers.includes("linkedin");
  const hasNiche = headers.includes("niche");
  const hasSubject = headers.includes("subject");

  if (!hasFirstName || !hasLastName || !hasNiche || !hasSubject) {
    throw new Error("Missing required columns: FirstName, LastName, Niche, Subject");
  }

  if ((hasEmail && hasLinkedIn) || (!hasEmail && !hasLinkedIn)) {
    throw new Error("File must contain either Email or LinkedIn column — not both or neither.");
  }

  const leads = [];
  const errors = [];

  // Get indexes
  const getIndex = (col) => headers.indexOf(col) + 1;
  const indexes = {
    firstname: getIndex("firstname"),
    lastname: getIndex("lastname"),
    contactno: getIndex("contactno"), // ignored
    email: hasEmail ? getIndex("email") : null,
    linkedin: hasLinkedIn ? getIndex("linkedin") : null,
    niche: getIndex("niche"),
    subject: getIndex("subject"),
  };

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return; // skip header

    const firstName = getCellValue(row.getCell(indexes.firstname));
    const lastName = getCellValue(row.getCell(indexes.lastname));
    const email = indexes.email ? getCellValue(row.getCell(indexes.email)) : "";
    const linkedin = indexes.linkedin ? getCellValue(row.getCell(indexes.linkedin)) : "";
    const niche = getCellValue(row.getCell(indexes.niche));
    const subject = getCellValue(row.getCell(indexes.subject));

    if (!firstName || !lastName || !niche || !subject) {
      errors.push(`Row ${rowIndex}: Missing required data (FirstName, LastName, Niche, or Subject)`);
      return;
    }

    const contact = hasEmail ? email : linkedin;
    if (!contact) {
      errors.push(`Row ${rowIndex}: ${hasEmail ? "Email" : "LinkedIn"} is required`);
      return;
    }

    leads.push({
      firstName,
      lastName,
      email,
      linkedin,
      niche,
      subject,
    });
  });

  fs.unlinkSync(filePath);

  if (errors.length) {
    return { success: false, errors };
  }

  return { success: true, leads };
};

module.exports = { parseExcelFile };
