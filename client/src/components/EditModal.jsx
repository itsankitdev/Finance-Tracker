import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const inputStyle = {
  background: "rgba(255,255,255,0.85)",
  border: "1px solid rgba(139,92,246,0.25)",
  borderRadius: "12px",
  padding: "10px 14px",
  width: "100%",
  fontSize: "14px",
  color: "#374151",
  outline: "none",
};

export default function EditModal({ isOpen, onClose, expense, onUpdate }) {
  const [form, setForm] = useState({ title: "", amount: "", category: "Food" });

  useEffect(() => {
    if (expense) {
      setForm({ title: expense.title, amount: expense.amount, category: expense.category });
    }
  }, [expense]);

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(expense._id, { ...form, amount: Number(form.amount) });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          style={{ background: "rgba(109,40,217,0.15)", backdropFilter: "blur(6px)" }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="relative w-full max-w-md rounded-2xl p-6 z-10"
          style={{
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.85)",
            boxShadow: "0 20px 60px rgba(109,40,217,0.18)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-violet-700">Edit Expense</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-all hover:scale-110"
              style={{ background: "rgba(139,92,246,0.08)", color: "#7c3aed" }}
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-violet-500 mb-1.5 block uppercase tracking-wide">
                Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Expense title"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.border = "1px solid rgba(139,92,246,0.55)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.10)";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1px solid rgba(139,92,246,0.25)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-violet-500 mb-1.5 block uppercase tracking-wide">
                Amount
              </label>
              <input
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                placeholder="0"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.border = "1px solid rgba(139,92,246,0.55)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.10)";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1px solid rgba(139,92,246,0.25)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-violet-500 mb-1.5 block uppercase tracking-wide">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.border = "1px solid rgba(139,92,246,0.55)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.10)";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1px solid rgba(139,92,246,0.25)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option>Food</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Bills</option>
              </select>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: "rgba(139,92,246,0.08)",
                  color: "#7c3aed",
                  border: "1px solid rgba(139,92,246,0.20)",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                  boxShadow: "0 4px 14px rgba(109,40,217,0.30)",
                }}
              >
                Update
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}