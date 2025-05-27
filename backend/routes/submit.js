// backend/routes/submit.js
const express = require("express");
const router = express.Router();

let transactions = []; // This can later be replaced with MongoDB

router.post("/", (req, res) => {
  const { type, amount, description } = req.body;
  if (!type || !amount || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const transaction = { id: Date.now(), type, amount, description };
  transactions.push(transaction);

  res.status(200).json({ message: "Transaction saved", transaction });
});

router.get("/", (req, res) => {
  res.json(transactions);
});

module.exports = router;
