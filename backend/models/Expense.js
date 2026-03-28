const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  category: String,
  date: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Expense", expenseSchema);
