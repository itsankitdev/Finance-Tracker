import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Receipt, Tag, SlidersHorizontal, X, ChevronDown } from "lucide-react";

import Navbar from "../components/Navbar";
import ExpenseForm from "../components/ExpenseForm";
import CategoryChart from "../components/CategoryChart";
import MonthlyChart from "../components/MonthlyChart";
import Insights from "../components/Insights";
import SmartTips from "../components/SmartTips";
import Footer from "../components/Footer";
import ExpenseList from "../components/ExpenseList";
import EditModal from "../components/EditModal";
import DeleteModal from "../components/DeleteModal";
import AuthModal from "../components/AuthModal";

import {
  fetchExpenses,
  createExpense,
  deleteExpense,
  updateExpense,
} from "../api/expenseApi";

// ── Glass card ────────────────────────────────────────────────────────────────
const GlassCard = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl p-5 ${className}`}
    style={{
      background: "rgba(255,255,255,0.55)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.75)",
      boxShadow: "0 8px 32px rgba(109,40,217,0.07)",
    }}
  >
    {children}
  </div>
);

// ── Portal Filter Dropdown ─────────────────────────────────────────────────────
const FILTER_CATEGORIES = ["All", "Food", "Travel", "Shopping", "Bills"];

function FilterDropdown({ value, onChange }) {
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
            width: Math.max(menuPos.width, 140),
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
          {FILTER_CATEGORIES.map((cat) => (
            <li
              key={cat}
              onMouseDown={(e) => { e.preventDefault(); onChange(cat); setOpen(false); }}
              style={{
                padding: "8px 12px",
                borderRadius: "10px",
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: value === cat ? "600" : "400",
                background: value === cat ? "rgba(139,92,246,0.12)" : "transparent",
                color: value === cat ? "#7c3aed" : "#1f2937", // ✅ dark gray instead of light
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (value !== cat) e.currentTarget.style.background = "rgba(139,92,246,0.06)";
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
    <div ref={triggerRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-medium"
        style={{
          background: "rgba(255,255,255,0.80)",
          border: open ? "1px solid rgba(139,92,246,0.55)" : "1px solid rgba(139,92,246,0.25)",
          borderRadius: "12px",
          padding: "8px 12px",
          color: "#1f2937", // ✅ dark
          cursor: "pointer",
          minWidth: "110px",
          justifyContent: "space-between",
          boxShadow: open ? "0 0 0 3px rgba(139,92,246,0.10)" : "none",
        }}
      >
        <span>{value}</span>
        <ChevronDown
          size={14}
          style={{
            color: "#7c3aed",
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      {createPortal(menu, document.body)}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDate, setFilterDate] = useState("");

  const [showBudgetAlert, setShowBudgetAlert] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState(true);
  const [authMessage, setAuthMessage] = useState("");

  const [budget, setBudget] = useState(() => localStorage.getItem("budget") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    if (!isLoggedIn) { setExpenses([]); setLoading(false); return; }
    const load = async () => {
      try { const res = await fetchExpenses(); setExpenses(res.data); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [isLoggedIn]);

  useEffect(() => { localStorage.setItem("budget", budget); }, [budget]);

  const total = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);

  const topCategory = useMemo(() => {
    if (!expenses.length) return "N/A";
    const map = {};
    expenses.forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.keys(map).reduce((a, b) => (map[a] > map[b] ? a : b));
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const date = new Date(e.date).toISOString().slice(0, 10);
      return (filterCategory === "All" || e.category === filterCategory) &&
        (!filterDate || date === filterDate);
    });
  }, [expenses, filterCategory, filterDate]);

  useEffect(() => {
    if (!budget) return;
    setShowBudgetAlert(total > Number(budget));
  }, [total, budget]);

  const addExpense = async (expense) => {
    if (!isLoggedIn) { setAuthMessage("Please login or register to add expenses"); setAuthMode(true); setShowAuthModal(true); return; }
    try { const res = await createExpense(expense); setExpenses((p) => [res.data, ...p]); }
    catch { alert("Failed to add expense"); }
  };

  const handleDelete = (id) => {
    if (!isLoggedIn) { setAuthMessage("Please login to delete expenses"); setAuthMode(true); setShowAuthModal(true); return; }
    setExpenseToDelete(id); setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try { await deleteExpense(expenseToDelete); setExpenses((p) => p.filter((e) => e._id !== expenseToDelete)); }
    finally { setShowDeleteModal(false); setExpenseToDelete(null); }
  };

  const handleEdit = (expense) => {
    if (!isLoggedIn) { setAuthMessage("Please login to edit expenses"); setAuthMode(true); setShowAuthModal(true); return; }
    setSelectedExpense(expense); setIsModalOpen(true);
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const res = await updateExpense(id, updatedData);
      setExpenses((p) => p.map((e) => (e._id === id ? res.data : e)));
      setIsModalOpen(false);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const fn = () => { setExpenses([]); setIsLoggedIn(false); };
    window.addEventListener("logout", fn);
    return () => window.removeEventListener("logout", fn);
  }, []);

  useEffect(() => {
    const fn = () => {
      setIsLoggedIn(true); setLoading(true);
      fetchExpenses().then((res) => { setExpenses(res.data); setLoading(false); });
    };
    window.addEventListener("login", fn);
    return () => window.removeEventListener("login", fn);
  }, []);

  const budgetPercent = budget ? Math.min((total / Number(budget)) * 100, 100) : 0;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 30%, #eef2ff 65%, #ddd6fe 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Ambient blobs */}
      <div className="fixed top-[-100px] left-[-100px] w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.20) 0%, transparent 70%)", filter: "blur(50px)" }} />
      <div className="fixed bottom-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)", filter: "blur(45px)" }} />
      <div className="fixed top-[40%] right-[10%] w-[200px] h-[200px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)", filter: "blur(35px)" }} />

      <Navbar onAuthOpen={(isLogin) => { setAuthMessage(""); setAuthMode(isLogin); setShowAuthModal(true); }} />

      <main className="flex-grow px-4 py-8 md:px-8 max-w-5xl mx-auto w-full space-y-6 relative z-10">

        <ExpenseForm onAdd={addExpense} isLoggedIn={isLoggedIn} />

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
            {/* ✅ darker loading text */}
            <p className="text-violet-600 mt-3 text-sm font-medium">Loading your expenses...</p>
          </div>
        ) : (
          <>
            {/* ── Filters ── */}
            <GlassCard>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal size={15} className="text-violet-700" />
                  {/* ✅ darker label */}
                  <span className="text-sm font-semibold text-violet-700">Filters</span>
                </div>

                <FilterDropdown value={filterCategory} onChange={setFilterCategory} />

                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="text-sm px-3 py-2 rounded-xl focus:outline-none transition"
                  style={{
                    background: "rgba(255,255,255,0.80)",
                    border: "1px solid rgba(139,92,246,0.25)",
                    color: "#1f2937", // ✅ dark date text
                  }}
                />

                <button
                  onClick={() => { setFilterCategory("All"); setFilterDate(""); }}
                  className="flex items-center gap-1 text-sm px-3 py-2 rounded-xl transition-all font-semibold"
                  style={{
                    background: "rgba(139,92,246,0.08)",
                    color: "#5b21b6", // ✅ darker violet
                    border: "1px solid rgba(139,92,246,0.18)",
                  }}
                >
                  <X size={13} /> Reset
                </button>
              </div>
            </GlassCard>

            <ExpenseList expenses={filteredExpenses} onDelete={handleDelete} onEdit={handleEdit} />

            {/* Budget Alert */}
            {showBudgetAlert && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center px-4 py-3 rounded-2xl text-sm font-semibold"
                style={{
                  background: "rgba(254,226,226,0.85)",
                  border: "1px solid rgba(239,68,68,0.35)",
                  backdropFilter: "blur(8px)",
                  color: "#991b1b", // ✅ darker red
                }}
              >
                <span>⚠️ You've exceeded your monthly budget!</span>
                <button onClick={() => setShowBudgetAlert(false)} className="ml-4 hover:opacity-70"><X size={15} /></button>
              </motion.div>
            )}

            {/* Budget Card */}
            <GlassCard>
              {/* ✅ darker section label */}
              <p className="text-sm font-bold text-violet-800 mb-3">Monthly Budget</p>
              <div className="flex flex-wrap items-center gap-5">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-600 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Set budget"
                    className="pl-7 pr-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition w-36"
                    style={{
                      background: "rgba(255,255,255,0.80)",
                      border: "1px solid rgba(139,92,246,0.25)",
                      color: "#1f2937", // ✅ dark input text
                    }}
                  />
                </div>
                {budget && (
                  <div className="flex-1 min-w-[180px]">
                    <div className="flex justify-between text-xs font-semibold mb-1.5" style={{ color: "#4b5563" }}>
                      {/* ✅ darker budget labels */}
                      <span>₹{total} spent</span>
                      <span>₹{budget} limit</span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "rgba(139,92,246,0.15)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${budgetPercent}%` }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          background: budgetPercent >= 100
                            ? "linear-gradient(90deg,#ef4444,#dc2626)"
                            : budgetPercent >= 75
                            ? "linear-gradient(90deg,#f59e0b,#d97706)"
                            : "linear-gradient(90deg,#a78bfa,#7c3aed)",
                        }}
                      />
                    </div>
                    <p className="text-xs mt-1.5 font-bold" style={{
                      color: budgetPercent >= 100 ? "#dc2626" : budgetPercent >= 75 ? "#b45309" : "#6d28d9"
                      // ✅ all darker shades
                    }}>
                      {budgetPercent >= 100 ? "Over budget!" : `${budgetPercent.toFixed(0)}% used`}
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: "Total Spent", value: `₹${total}`, icon: <TrendingUp size={18} />, accent: "#6d28d9", glow: "rgba(124,58,237,0.13)", border: "rgba(139,92,246,0.30)", iconBg: "rgba(139,92,246,0.12)" },
                { label: "Transactions", value: expenses.length, icon: <Receipt size={18} />, accent: "#1d4ed8", glow: "rgba(37,99,235,0.10)", border: "rgba(59,130,246,0.28)", iconBg: "rgba(59,130,246,0.10)" },
                { label: "Top Category", value: topCategory, icon: <Tag size={18} />, accent: "#0e7490", glow: "rgba(8,145,178,0.10)", border: "rgba(8,145,178,0.26)", iconBg: "rgba(8,145,178,0.10)" },
                // ✅ all accent colors darkened one shade
              ].map((card, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03, y: -3 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18 }}
                  className="rounded-2xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.60)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: `1px solid ${card.border}`,
                    boxShadow: `0 6px 28px ${card.glow}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-3 text-sm font-bold" style={{ color: card.accent }}>
                    <span className="p-1.5 rounded-lg" style={{ background: card.iconBg }}>{card.icon}</span>
                    {card.label}
                  </div>
                  <p className="text-2xl font-bold" style={{ color: card.accent }}>{card.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CategoryChart expenses={filteredExpenses} />
              <MonthlyChart expenses={filteredExpenses} />
            </div>

            <Insights expenses={filteredExpenses} />
            <SmartTips expenses={filteredExpenses} />
          </>
        )}

        <EditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} expense={selectedExpense} onUpdate={handleUpdate} />
      </main>

      <Footer />

      <DeleteModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={confirmDelete} />

      <AuthModal
        isOpen={showAuthModal}
        isLogin={authMode}
        message={authMessage}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => { setShowAuthModal(false); window.dispatchEvent(new Event("login")); }}
      />
    </div>
  );
}