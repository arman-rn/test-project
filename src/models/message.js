const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  content: {
    type: String,
  },
  sender: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
});

module.exports = mongoose.model("Message", messageSchema);
