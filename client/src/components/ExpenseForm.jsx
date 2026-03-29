import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Tag, FileText, PlusCircle } from "lucide-react";

const inputStyle = {
  background: "rgba(255,255,255,0.80)",
  border: "1px solid rgba(139,92,246,0.25)",
  color: "#374151",
  borderRadius: "12px",
  padding: "10px 12px 10px 36px",
  width: "100%",
  fontSize: "14px",
  outline: "none",
  transition: "border 0.2s, box-shadow 0.2s",
};

export default function ExpenseForm({ onAdd, isLoggedIn }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;
    onAdd({ title, amount: Number(amount), category, date: new Date() });
    setTitle("");
    setAmount("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.75)",
        boxShadow: "0 8px 32px rgba(109,40,217,0.07)",
      }}
    >
      <h2 className="text-base font-bold text-violet-700 mb-5 tracking-wide">
        Add Expense
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Title */}
          <div className="relative">
            <FileText
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.border = "1px solid rgba(139,92,246,0.6)";
                e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.10)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid rgba(139,92,246,0.25)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Amount */}
          <div className="relative">
            <DollarSign
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400 pointer-events-none"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.border = "1px solid rgba(139,92,246,0.6)";
                e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.10)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid rgba(139,92,246,0.25)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Category */}
          <div className="relative">
            <Tag
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400 pointer-events-none"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ ...inputStyle }}
              onFocus={(e) => {
                e.target.style.border = "1px solid rgba(139,92,246,0.6)";
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

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.03 }}
            type="submit"
            className="flex items-center justify-center gap-2 font-semibold text-sm text-white rounded-xl py-2.5 transition-all"
            style={{
              background:
                "linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #4f46e5 100%)",
              boxShadow: "0 4px 14px rgba(109,40,217,0.35)",
            }}
          >
            <PlusCircle size={16} />
            Add Expense
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}