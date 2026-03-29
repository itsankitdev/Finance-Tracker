import { motion } from "framer-motion";
import { Trash2, Pencil, ReceiptText } from "lucide-react";

export default function ExpenseList({ expenses, onDelete, onEdit }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.75)",
        boxShadow: "0 8px 32px rgba(109,40,217,0.07)",
      }}
    >
      <h2 className="text-base font-bold text-violet-700 mb-4 tracking-wide">
        Recent Transactions
      </h2>

      {expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div
            className="p-4 rounded-2xl mb-3"
            style={{ background: "rgba(139,92,246,0.08)" }}
          >
            <ReceiptText size={36} className="text-violet-300" />
          </div>
          <p className="text-violet-400 font-medium text-sm">No expenses yet</p>
          <p className="text-violet-300 text-xs mt-1">Add your first expense above!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((e, i) => (
            <motion.div
              key={e._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.01, y: -1 }}
              className="flex justify-between items-center p-3.5 rounded-xl cursor-default transition-all"
              style={{
                background: "rgba(255,255,255,0.70)",
                border: "1px solid rgba(139,92,246,0.12)",
                boxShadow: "0 2px 8px rgba(109,40,217,0.04)",
              }}
            >
              <div>
                <p className="font-semibold text-gray-800 text-sm">{e.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: "rgba(139,92,246,0.10)",
                      color: "#7c3aed",
                    }}
                  >
                    {e.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(e.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p
                  className="font-bold text-sm"
                  style={{ color: "#7c3aed" }}
                >
                  ₹{e.amount}
                </p>

                <button
                  onClick={() => onDelete(e._id)}
                  className="p-1.5 rounded-lg transition-all hover:scale-110"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    color: "#ef4444",
                  }}
                >
                  <Trash2 size={15} />
                </button>

                <button
                  onClick={() => onEdit(e)}
                  className="p-1.5 rounded-lg transition-all hover:scale-110"
                  style={{
                    background: "rgba(59,130,246,0.08)",
                    color: "#3b82f6",
                  }}
                >
                  <Pencil size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}