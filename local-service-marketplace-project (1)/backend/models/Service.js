const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  basePrice: { type: Number, default: 0 },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  available: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model("Service", schema);