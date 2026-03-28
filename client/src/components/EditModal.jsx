import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function EditModal({ isOpen, onClose, expense, onUpdate }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
  });

  // 🔹 Fill data when modal opens
  useEffect(() => {
    if (expense) {
      setForm({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
      });
    }
  }, [expense]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(expense._id, {
      ...form,
      amount: Number(form.amount),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg"
      >
        <h2 className="text-lg font-semibold mb-4">Edit Expense</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Title"
          />

          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Amount"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white"
            >
              Update
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
