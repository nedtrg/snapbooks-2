const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["income", "expense"], required: true },
  amount: Number,
  description: String,
  date: { type: Date, default: Date.now },
  source: { type: String },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
