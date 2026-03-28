import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ExpenseForm from "../components/ExpenseForm";
import CategoryChart from "../components/CategoryChart";
import MonthlyChart from "../components/MonthlyChart";
import Insights from "../components/Insights";
import SmartTips from "../components/SmartTips";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import ExpenseList from "../components/ExpenseList";
import { deleteExpense } from "../api/expenseApi";
import EditModal from "../components/EditModal";
import { updateExpense } from "../api/expenseApi";

import { fetchExpenses, createExpense } from "../api/expenseApi";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  // 🔹 Load data from backend
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const res = await fetchExpenses();
        setExpenses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    loadExpenses();
  }, []);

  // 🔹 Add expense (API)
  const addExpense = async (expense) => {
    try {
      const res = await createExpense(expense);
      setExpenses((prev) => [res.data, ...prev]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const res = await updateExpense(id, updatedData);

      setExpenses((prev) => prev.map((e) => (e._id === id ? res.data : e)));
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Total
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // 🔹 Top Category
  const categoryMap = {};
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const topCategory =
    Object.keys(categoryMap).length > 0
      ? Object.keys(categoryMap).reduce((a, b) =>
          categoryMap[a] > categoryMap[b] ? a : b,
        )
      : "N/A";

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      <Navbar />

      <div className="flex-grow p-6 max-w-6xl mx-auto">
        <ExpenseForm onAdd={addExpense} />
        <ExpenseList
          expenses={expenses}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div className="bg-white p-4 rounded-2xl shadow">
            <p className="text-gray-500">Total Expenses</p>
            <h2 className="text-2xl font-bold text-green-600">₹{total}</h2>
          </motion.div>

          <motion.div className="bg-white p-4 rounded-2xl shadow">
            <p className="text-gray-500">Transactions</p>
            <h2 className="text-2xl font-bold">{expenses.length}</h2>
          </motion.div>

          <motion.div className="bg-white p-4 rounded-2xl shadow">
            <p className="text-gray-500">Top Category</p>
            <h2 className="text-2xl font-bold text-green-600">{topCategory}</h2>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryChart expenses={expenses} />
          <MonthlyChart expenses={expenses} />
        </div>

        <Insights expenses={expenses} />
        <SmartTips expenses={expenses} />
        <EditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          expense={selectedExpense}
          onUpdate={handleUpdate}
        />
      </div>

      <Footer />
    </div>
  );
}
