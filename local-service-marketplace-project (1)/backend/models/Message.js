const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: String,
  attachment: String
}, { timestamps: true });
module.exports = mongoose.model("Message", schema);