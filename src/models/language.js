const mongoose = require("mongoose");

const langSchema = new mongoose.Schema({
  langId: {
    type: Number,
    required: true,
    trim: true,
  },
  langName: {
    type: String,
    required: true,
    trim: true,
  },
});

const languageSchema = mongoose.model("LanguageSchema", langSchema, 'languages');
module.exports = languageSchema;
