import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

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
          className="relative w-full max-w-sm rounded-2xl p-6 z-10 text-center"
          style={{
            background: "rgba(255,255,255,0.80)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.85)",
            boxShadow: "0 20px 60px rgba(109,40,217,0.15)",
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg transition-all hover:scale-110"
            style={{ background: "rgba(139,92,246,0.08)", color: "#7c3aed" }}
          >
            <X size={15} />
          </button>

          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(239,68,68,0.08)" }}
          >
            <Trash2 size={24} className="text-red-500" />
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-2">Delete Expense</h2>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete this expense? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
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
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                boxShadow: "0 4px 14px rgba(239,68,68,0.30)",
              }}
            >
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}