import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Tag, FileText } from "lucide-react";

export default function ExpenseForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !amount) return;

    onAdd({
      title,
      amount: Number(amount),
      category,
      date: new Date(),
    });

    setTitle("");
    setAmount("");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 rounded-2xl shadow-md mb-6"
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Add Expense
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Title */}
        <div className="relative">
          <FileText
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
          />
        </div>

        {/* Amount */}
        <div className="relative">
          <DollarSign
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
          />
        </div>

        {/* Category */}
        <div className="relative">
          <Tag
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
          >
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
          </select>
        </div>

        {/* Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          type="submit"
          className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg py-2 font-medium shadow hover:shadow-lg transition"
        >
          Add Expense
        </motion.button>

      </div>
    </motion.form>
  );
}
