import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Receipt, Tag, SlidersHorizontal, X } from "lucide-react";

// Components
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

// API
import {
  fetchExpenses,
  createExpense,
  deleteExpense,
  updateExpense,
} from "../api/expenseApi";

// ─── Reusable glass card ─────────────────────────────────────────────────────
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

  // ✅ isLoggedIn as proper state
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Fetch expenses
  useEffect(() => {
    if (!isLoggedIn) {
      setExpenses([]);
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const res = await fetchExpenses();
        setExpenses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("budget", budget);
  }, [budget]);

  const total = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const topCategory = useMemo(() => {
    if (!expenses.length) return "N/A";
    const map = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.keys(map).reduce((a, b) => (map[a] > map[b] ? a : b));
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const date = new Date(e.date).toISOString().slice(0, 10);
      const matchCategory = filterCategory === "All" || e.category === filterCategory;
      const matchDate = !filterDate || date === filterDate;
      return matchCategory && matchDate;
    });
  }, [expenses, filterCategory, filterDate]);

  // ✅ Number(budget) fix
  useEffect(() => {
    if (!budget) return;
    setShowBudgetAlert(total > Number(budget));
  }, [total, budget]);

  const addExpense = async (expense) => {
    if (!isLoggedIn) {
      setAuthMessage("Please login or register to add expenses");
      setAuthMode(true);
      setShowAuthModal(true);
      return;
    }
    try {
      const res = await createExpense(expense);
      setExpenses((prev) => [res.data, ...prev]);
    } catch {
      alert("Failed to add expense");
    }
  };

  const handleDelete = (id) => {
    if (!isLoggedIn) {
      setAuthMessage("Please login to delete expenses");
      setAuthMode(true);
      setShowAuthModal(true);
      return;
    }
    setExpenseToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteExpense(expenseToDelete);
      setExpenses((prev) => prev.filter((e) => e._id !== expenseToDelete));
    } finally {
      setShowDeleteModal(false);
      setExpenseToDelete(null);
    }
  };

  const handleEdit = (expense) => {
    if (!isLoggedIn) {
      setAuthMessage("Please login to edit expenses");
      setAuthMode(true);
      setShowAuthModal(true);
      return;
    }
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const res = await updateExpense(id, updatedData);
      setExpenses((prev) => prev.map((e) => (e._id === id ? res.data : e)));
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Logout
  useEffect(() => {
    const handleLogout = () => {
      setExpenses([]);
      setIsLoggedIn(false);
    };
    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  // ✅ Login
  useEffect(() => {
    const handleLogin = () => {
      setIsLoggedIn(true);
      setLoading(true);
      fetchExpenses().then((res) => {
        setExpenses(res.data);
        setLoading(false);
      });
    };
    window.addEventListener("login", handleLogin);
    return () => window.removeEventListener("login", handleLogin);
  }, []);

  const budgetPercent = budget
    ? Math.min((total / Number(budget)) * 100, 100)
    : 0;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 30%, #eef2ff 65%, #ddd6fe 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Ambient blobs */}
      <div
        className="fixed top-[-100px] left-[-100px] w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.20) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="fixed bottom-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
          filter: "blur(45px)",
        }}
      />
      <div
        className="fixed top-[40%] right-[10%] w-[200px] h-[200px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)",
          filter: "blur(35px)",
        }}
      />

      <Navbar
        onAuthOpen={(isLogin) => {
          setAuthMessage("");
          setAuthMode(isLogin);
          setShowAuthModal(true);
        }}
      />

      <main className="flex-grow px-4 py-8 md:px-8 max-w-5xl mx-auto w-full space-y-6 relative z-10">

        {/* Expense Form */}
        <ExpenseForm onAdd={addExpense} isLoggedIn={isLoggedIn} />

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
            <p className="text-violet-400 mt-3 text-sm font-medium">Loading your expenses...</p>
          </div>
        ) : (
          <>
            {/* ── Filters ──────────────────────────────────────────── */}
            <GlassCard>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-1.5 text-violet-600 mr-1">
                  <SlidersHorizontal size={15} />
                  <span className="text-sm font-semibold">Filters</span>
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    border: "1px solid rgba(139,92,246,0.25)",
                    color: "#374151",
                  }}
                >
                  <option>All</option>
                  <option>Food</option>
                  <option>Travel</option>
                  <option>Shopping</option>
                  <option>Bills</option>
                </select>

                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    border: "1px solid rgba(139,92,246,0.25)",
                    color: "#374151",
                  }}
                />

                <button
                  onClick={() => {
                    setFilterCategory("All");
                    setFilterDate("");
                  }}
                  className="flex items-center gap-1 text-sm px-3 py-2 rounded-xl transition-all font-medium"
                  style={{
                    background: "rgba(139,92,246,0.10)",
                    color: "#7c3aed",
                    border: "1px solid rgba(139,92,246,0.20)",
                  }}
                >
                  <X size={13} /> Reset
                </button>
              </div>
            </GlassCard>

            {/* ── Expense List ─────────────────────────────────────── */}
            <ExpenseList
              expenses={filteredExpenses}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />

            {/* ── Budget Alert ─────────────────────────────────────── */}
            {showBudgetAlert && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center px-4 py-3 rounded-2xl text-sm font-medium"
                style={{
                  background: "rgba(254,226,226,0.75)",
                  border: "1px solid rgba(239,68,68,0.30)",
                  backdropFilter: "blur(8px)",
                  color: "#b91c1c",
                }}
              >
                <span>⚠️ You've exceeded your monthly budget!</span>
                <button
                  onClick={() => setShowBudgetAlert(false)}
                  className="ml-4 hover:opacity-70 transition"
                >
                  <X size={15} />
                </button>
              </motion.div>
            )}

            {/* ── Budget Card ──────────────────────────────────────── */}
            <GlassCard>
              <p className="text-sm font-semibold text-violet-700 mb-3">
                Monthly Budget
              </p>
              <div className="flex flex-wrap items-center gap-5">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400 font-semibold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Set budget"
                    className="pl-7 pr-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition w-36"
                    style={{
                      background: "rgba(255,255,255,0.8)",
                      border: "1px solid rgba(139,92,246,0.25)",
                      color: "#374151",
                    }}
                  />
                </div>

                {budget && (
                  <div className="flex-1 min-w-[180px]">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>₹{total} spent</span>
                      <span>₹{budget} limit</span>
                    </div>
                    {/* Animated progress bar */}
                    <div
                      className="w-full h-3 rounded-full overflow-hidden"
                      style={{ background: "rgba(139,92,246,0.12)" }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${budgetPercent}%` }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          background:
                            budgetPercent >= 100
                              ? "linear-gradient(90deg,#ef4444,#dc2626)"
                              : budgetPercent >= 75
                              ? "linear-gradient(90deg,#f59e0b,#d97706)"
                              : "linear-gradient(90deg,#a78bfa,#7c3aed)",
                        }}
                      />
                    </div>
                    <p
                      className="text-xs mt-1.5 font-semibold"
                      style={{
                        color:
                          budgetPercent >= 100
                            ? "#ef4444"
                            : budgetPercent >= 75
                            ? "#d97706"
                            : "#7c3aed",
                      }}
                    >
                      {budgetPercent >= 100
                        ? "Over budget!"
                        : `${budgetPercent.toFixed(0)}% used`}
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* ── Stats Cards ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  label: "Total Spent",
                  value: `₹${total}`,
                  icon: <TrendingUp size={18} />,
                  accent: "#7c3aed",
                  glow: "rgba(124,58,237,0.13)",
                  border: "rgba(139,92,246,0.30)",
                  iconBg: "rgba(139,92,246,0.12)",
                },
                {
                  label: "Transactions",
                  value: expenses.length,
                  icon: <Receipt size={18} />,
                  accent: "#2563eb",
                  glow: "rgba(37,99,235,0.10)",
                  border: "rgba(59,130,246,0.28)",
                  iconBg: "rgba(59,130,246,0.10)",
                },
                {
                  label: "Top Category",
                  value: topCategory,
                  icon: <Tag size={18} />,
                  accent: "#0891b2",
                  glow: "rgba(8,145,178,0.10)",
                  border: "rgba(8,145,178,0.26)",
                  iconBg: "rgba(8,145,178,0.10)",
                },
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
                  <div
                    className="flex items-center gap-2 mb-3 text-sm font-semibold"
                    style={{ color: card.accent }}
                  >
                    <span
                      className="p-1.5 rounded-lg"
                      style={{ background: card.iconBg }}
                    >
                      {card.icon}
                    </span>
                    {card.label}
                  </div>
                  <p className="text-2xl font-bold" style={{ color: card.accent }}>
                    {card.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* ── Charts ───────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CategoryChart expenses={filteredExpenses} />
              <MonthlyChart expenses={filteredExpenses} />
            </div>

            <Insights expenses={filteredExpenses} />
            <SmartTips expenses={filteredExpenses} />
          </>
        )}

        <EditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          expense={selectedExpense}
          onUpdate={handleUpdate}
        />
      </main>

      <Footer />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />

      <AuthModal
        isOpen={showAuthModal}
        isLogin={authMode}
        message={authMessage}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          window.dispatchEvent(new Event("login"));
        }}
      />
    </div>
  );
}