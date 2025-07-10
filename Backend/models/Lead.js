const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  linkedin: String,
  niche: String,
  subject: String,
  aiMessage: String,
  isEmailed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Lead", leadSchema);
