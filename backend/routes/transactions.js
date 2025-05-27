const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

router.get("/", async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
});

router.post("/", async (req, res) => {
  const newTransaction = new Transaction(req.body);
  await newTransaction.save();
  res.status(201).json(newTransaction);
});

module.exports = router;
