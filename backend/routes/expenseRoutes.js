const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// Create Expense
router.post("/", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    const saved = await expense.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE expense
router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE expense
router.put("/:id", async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
