const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const auth = require("../middleware/authMiddleware"); // ✅ import middleware

// ✅ Apply auth middleware to ALL routes
router.use(auth);

// Create Expense — attach userId from token
router.post("/", async (req, res) => {
  try {
    const expense = new Expense({
      ...req.body,
      userId: req.userId, // ✅ attach logged-in user's ID
    });
    const saved = await expense.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Expenses — only for logged-in user
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }) // ✅ filter by user
      .sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE — only if expense belongs to this user
router.delete("/:id", async (req, res) => {
  try {
    await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId, // ✅ security check
    });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE — only if expense belongs to this user
router.put("/:id", async (req, res) => {
  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, // ✅ security check
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;