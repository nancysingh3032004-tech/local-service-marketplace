const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  bookingType: { type: String, enum: ["normal", "emergency"], default: "normal" },
  scheduledAt: Date,
  address: String,
  notes: String,
  amount: { type: Number, default: 0 },
  status: { type: String, enum: ["pending","accepted","rejected","in-progress","completed","cancelled"], default: "pending" },
  paymentStatus: { type: String, enum: ["pending","paid","refunded"], default: "pending" },
  beforePhoto: String,
  afterPhoto: String,
  qrToken: String,
  qrData: String,
  qrVerified: { type: Boolean, default: false },
  invoiceNumber: String
}, { timestamps: true });
module.exports = mongoose.model("Booking", schema);