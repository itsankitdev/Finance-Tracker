const express = require("express");
const router = express.Router();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const expenseRoutes = require("./routes/expenseRoutes");
const authRoutes = require("./routes/authRoutes");
const auth = require("./middleware/authMiddleware");


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

router.post("/", auth, async (req, res) => {
  const expense = new Expense({
    ...req.body,
    userId: req.userId,
  });
  const saved = await expense.save();
  res.json(saved);
});

router.get("/", auth, async (req, res) => {
  const expenses = await Expense.find({ userId: req.userId });
  res.json(expenses);
});


// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/expenses", expenseRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
