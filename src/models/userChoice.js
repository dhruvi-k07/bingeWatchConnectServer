const mongoose = require("mongoose");


const userChoiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
  },
  genres: {
    type: [{ id: Number, name: String }],
  },
});

const UserChoice = mongoose.model("UserChoice", userChoiceSchema);
module.exports = UserChoice;
