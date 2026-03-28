import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

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
import LoginPromptModal from "../components/LoginPromptModal";
import DeleteModal from "../components/DeleteModal";


// API
import {
  fetchExpenses,
  createExpense,
  deleteExpense,
  updateExpense,
} from "../api/expenseApi";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const [showBudgetAlert, setShowBudgetAlert] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [expenseToDelete, setExpenseToDelete] = useState(null);


  const [budget, setBudget] = useState(() => {
    return localStorage.getItem("budget") || "";
  });

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // Load data ONLY if logged in (NO AUTO MODAL)
  useEffect(() => {
    if (!isLoggedIn) {
      // setExpenses([]);
      setLoading(false);
      return;
    }

    const loadExpenses = async () => {
      try {
        const res = await fetchExpenses();
        setExpenses(res.data);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [isLoggedIn]);

  const total = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const topCategory = useMemo(() => {
    if (expenses.length === 0) return "N/A";

    const categoryMap = {};
    expenses.forEach((e) => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });

    return Object.keys(categoryMap).reduce((a, b) =>
      categoryMap[a] > categoryMap[b] ? a : b,
    );
  }, [expenses]);

  // Handlers
  const addExpense = async (expense) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
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
    setShowLoginModal(true);
    return;
  }

  setExpenseToDelete(id);
  setShowDeleteModal(true);
};

const confirmDelete = async () => {
  try {
    await deleteExpense(expenseToDelete);
    setExpenses((prev) =>
      prev.filter((e) => e._id !== expenseToDelete)
    );
  } catch (err) {
    console.error(err);
  } finally {
    setShowDeleteModal(false);
    setExpenseToDelete(null);
  }
};


  const handleEdit = (expense) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
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

  useEffect(() => {
    const handleLogout = () => {
      setExpenses([]);
    };

    window.addEventListener("logout", handleLogout);

    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const expenseDate = new Date(e.date).toISOString().slice(0, 10);

      const matchCategory =
        filterCategory === "All" || e.category === filterCategory;

      const matchDate = !filterDate || expenseDate === filterDate;

      return matchCategory && matchDate;
    });
  }, [expenses, filterCategory, filterDate]);

  useEffect(() => {
    if (!budget) return;

    if (total > budget) {
      setShowBudgetAlert(true);
    } else {
      setShowBudgetAlert(false);
    }
  }, [total, budget]);

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      <Navbar />

      <main className="flex-grow px-4 py-6 md:px-8 max-w-5xl mx-auto w-full space-y-6">
        <ExpenseForm onAdd={addExpense} isLoggedIn={isLoggedIn} />

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <>
            <div className="bg-white p-4 rounded-2xl shadow mb-4 flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border p-2 rounded"
              >
                <option>All</option>
                <option>Food</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Bills</option>
              </select>

              {/* Date Filter */}
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="border p-2 rounded"
              />

              {/* Reset */}
              <button
                onClick={() => {
                  setFilterCategory("All");
                  setFilterDate("");
                }}
                className="bg-gray-200 px-3 py-2 rounded"
              >
                Reset
              </button>
            </div>

            <ExpenseList
              expenses={filteredExpenses}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />

           
            {showBudgetAlert && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 flex justify-between items-center">
                <span>⚠️ Budget exceeded!</span>
                <button onClick={() => setShowBudgetAlert(false)}>✖</button>
              </div>
            )}

            <div className="bg-white p-4 rounded-2xl shadow mb-4 flex items-center gap-3">
              <p className="font-medium">Monthly Budget:</p>

              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="border p-2 rounded w-32"
              />

              <span className="text-gray-500">
                Used: ₹{total} / ₹{budget}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <motion.div className="bg-white p-4 rounded-2xl shadow">
                <p>Total Expenses</p>
                <h2 className="text-2xl font-bold text-green-600">₹{total}</h2>
              </motion.div>

              <motion.div className="bg-white p-4 rounded-2xl shadow">
                <p>Transactions</p>
                <h2 className="text-2xl font-bold">{expenses.length}</h2>
              </motion.div>

              <motion.div className="bg-white p-4 rounded-2xl shadow">
                <p>Top Category</p>
                <h2 className="text-2xl font-bold text-green-600">
                  {topCategory}
                </h2>
              </motion.div>
            </div>

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

        <LoginPromptModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />


      </main>

      <Footer />
        <DeleteModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={confirmDelete}
/>
    </div>
  );
}
