const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  genreId: {
    type: Number,
    required: true,
  },
  genreName: {
    type: String,
    required: true,
  },
});

const GenreSchema = mongoose.model("GenreSchema", genreSchema, 'genres');
module.exports = GenreSchema;
