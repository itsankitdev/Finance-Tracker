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
      <h2 className="text-base font-bold mb-4 tracking-wide" style={{ color: "#4c1d95" }}>
        Recent Transactions
      </h2>

      {expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-2xl mb-3" style={{ background: "rgba(139,92,246,0.08)" }}>
            <ReceiptText size={36} className="text-violet-400" />
          </div>
          {/* ✅ darker empty state text */}
          <p className="font-semibold text-sm" style={{ color: "#5b21b6" }}>No expenses yet</p>
          <p className="text-xs mt-1" style={{ color: "#6d28d9" }}>Add your first expense above!</p>
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
                {/* ✅ dark title */}
                <p className="font-bold text-sm" style={{ color: "#111827" }}>{e.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "rgba(139,92,246,0.12)", color: "#5b21b6" }}
                  >
                    {e.category}
                  </span>
                  {/* ✅ darker date text */}
                  <span className="text-xs font-medium" style={{ color: "#4b5563" }}>
                    {new Date(e.date).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* ✅ darker amount */}
                <p className="font-bold text-sm" style={{ color: "#5b21b6" }}>₹{e.amount}</p>

                <button
                  onClick={() => onDelete(e._id)}
                  className="p-1.5 rounded-lg transition-all hover:scale-110"
                  style={{ background: "rgba(239,68,68,0.10)", color: "#dc2626" }}
                >
                  <Trash2 size={15} />
                </button>

                <button
                  onClick={() => onEdit(e)}
                  className="p-1.5 rounded-lg transition-all hover:scale-110"
                  style={{ background: "rgba(59,130,246,0.10)", color: "#1d4ed8" }}
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