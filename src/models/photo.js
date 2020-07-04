const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const photoSchema = new Schema({
  filename: {
    type: String,
  },
  fileLocation: {
    type: String,
  },
});

module.exports = mongoose.model("Photo", photoSchema);
