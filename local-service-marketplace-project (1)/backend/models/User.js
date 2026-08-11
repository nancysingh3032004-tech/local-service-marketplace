const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "provider", "admin"], default: "customer" },
  phone: String,
  address: String,
  language: { type: String, default: "en" },
  skills: [String],
  isVerified: { type: Boolean, default: false },
  responseTime: { type: Number, default: 60 },
  completionRate: { type: Number, default: 100 },
  trustScore: { type: Number, default: 50 }
}, { timestamps: true });
module.exports = mongoose.model("User", userSchema);