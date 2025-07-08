//services/leadValidationService.js
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidLinkedIn = (url) => {
  return typeof url === "string" &&
    /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_.]+\/?$/.test(url);
};

const validateLeads = (leads) => {
  const validLeads = [];
  const invalidLeads = [];

  const emailSet = new Set();
  const linkedinSet = new Set();

  leads.forEach((lead, index) => {
    const errors = [];

    const {
      firstName,
      lastName,
      email,
      linkedin,
      niche,
      subject,
    } = lead;

    if (!firstName?.trim()) errors.push("FirstName is required");
    if (!lastName?.trim()) errors.push("LastName is required");
    if (!niche?.trim()) errors.push("Niche is required");
    if (!subject?.trim()) errors.push("Subject is required");

    const trimmedEmail = email?.trim();
    const trimmedLinkedIn = linkedin?.trim();

    if (trimmedEmail && !isValidEmail(trimmedEmail)) {
      errors.push("Invalid email format");
    }

    if (trimmedLinkedIn && !isValidLinkedIn(trimmedLinkedIn)) {
      errors.push("Invalid LinkedIn URL");
    }

    if (!trimmedEmail && !trimmedLinkedIn) {
      errors.push("Either Email or LinkedIn must be provided");
    }

    if (trimmedEmail && emailSet.has(trimmedEmail)) {
      errors.push("Duplicate email");
    }

    if (trimmedLinkedIn && linkedinSet.has(trimmedLinkedIn)) {
      errors.push("Duplicate LinkedIn profile");
    }

    if (trimmedEmail) emailSet.add(trimmedEmail);
    if (trimmedLinkedIn) linkedinSet.add(trimmedLinkedIn);

    if (errors.length > 0) {
      invalidLeads.push({
        row: index + 2,
        firstName,
        lastName,
        email: trimmedEmail,
        linkedin: trimmedLinkedIn,
        niche,
        subject,
        errors,
      });
    } else {
      validLeads.push({
        firstName,
        lastName,
        email: trimmedEmail,
        linkedin: trimmedLinkedIn,
        niche,
        subject,
      });
    }
  });

  return {
    validLeads,
    invalidLeads,
  };
};

module.exports = { validateLeads };
