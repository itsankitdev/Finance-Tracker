import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Tag, FileText, PlusCircle, ChevronDown } from "lucide-react";

const CATEGORIES = ["Food", "Travel", "Shopping", "Bills"];

const inputStyle = {
  background: "rgba(255,255,255,0.85)",
  border: "1px solid rgba(139,92,246,0.25)",
  color: "#1f2937",
  borderRadius: "12px",
  padding: "11px 12px 11px 38px",
  width: "100%",
  fontSize: "14px",
  outline: "none",
  transition: "border 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};

// ── Portal Dropdown ────────────────────────────────────────────────────────────
function CategoryDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const menu = (
    <AnimatePresence>
      {open && (
        <motion.ul
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "absolute",
            top: menuPos.top,
            left: menuPos.left,
            width: menuPos.width,
            zIndex: 99999,
            background: "rgba(255,255,255,0.99)",
            border: "1px solid rgba(139,92,246,0.20)",
            borderRadius: "14px",
            boxShadow: "0 12px 36px rgba(109,40,217,0.18)",
            padding: "6px",
            listStyle: "none",
            margin: 0,
          }}
        >
          {CATEGORIES.map((cat) => (
            <li
              key={cat}
              onMouseDown={(e) => { e.preventDefault(); onChange(cat); setOpen(false); }}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                fontSize: "14px",
                cursor: "pointer",
                fontWeight: value === cat ? "700" : "500",
                background: value === cat ? "rgba(139,92,246,0.12)" : "transparent",
                color: value === cat ? "#5b21b6" : "#1f2937",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (value !== cat) e.currentTarget.style.background = "rgba(139,92,246,0.07)";
              }}
              onMouseLeave={(e) => {
                if (value !== cat) e.currentTarget.style.background = "transparent";
              }}
            >
              {cat}
            </li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  );

  return (
    <div ref={triggerRef} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          ...inputStyle,
          padding: "11px 38px 11px 38px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          width: "100%",
          border: open ? "1px solid rgba(139,92,246,0.60)" : "1px solid rgba(139,92,246,0.25)",
          boxShadow: open ? "0 0 0 3px rgba(139,92,246,0.10)" : "none",
        }}
      >
        <Tag size={15} style={{ position: "absolute", left: "13px", color: "#7c3aed", pointerEvents: "none" }} />
        <span style={{ color: "#1f2937", fontSize: "14px", fontWeight: "500" }}>{value}</span>
        <ChevronDown size={15} style={{ color: "#7c3aed", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }} />
      </button>
      {createPortal(menu, document.body)}
    </div>
  );
}

// ── Main Form ──────────────────────────────────────────────────────────────────
export default function ExpenseForm({ onAdd }) {
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

  const handleFocus = (e) => {
    e.target.style.border = "1px solid rgba(139,92,246,0.60)";
    e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.10)";
  };
  const handleBlur = (e) => {
    e.target.style.border = "1px solid rgba(139,92,246,0.25)";
    e.target.style.boxShadow = "none";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
        Add Expense
      </h2>

      <form onSubmit={handleSubmit}>
        {/* ✅ On mobile: 1 column stack. On md+: 2 cols for inputs, full row for button */}
        <div className="flex flex-col gap-3">

          {/* Row 1 — Title + Amount side by side on all screens */}
          <div className="grid grid-cols-2 gap-3">
            {/* Title */}
            <div className="relative">
              <FileText size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#7c3aed", pointerEvents: "none" }} />
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Amount */}
            <div className="relative">
              <DollarSign size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#7c3aed", pointerEvents: "none" }} />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </div>

          {/* Row 2 — Category full width */}
          <CategoryDropdown value={category} onChange={setCategory} />

          {/* Row 3 — Button full width */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            type="submit"
            className="flex items-center justify-center gap-2 font-bold text-sm text-white rounded-xl w-full"
            style={{
              padding: "12px",
              background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #4f46e5 100%)",
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