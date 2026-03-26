import { useState } from "react";
import Navbar from "../components/Navbar";
import ExpenseForm from "../components/ExpenseForm";
import CategoryChart from "../components/CategoryChart";
import MonthlyChart from "../components/MonthlyChart";
import Insights from "../components/Insights";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  const addExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <div className="p-6 max-w-6xl mx-auto">
        <ExpenseForm onAdd={addExpense} />

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow">
            <p className="text-gray-500">Total Expenses</p>
            <h2 className="text-2xl font-bold text-green-600">₹{total}</h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow">
            <p className="text-gray-500">Transactions</p>
            <h2 className="text-2xl font-bold">{expenses.length}</h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow">
            <p className="text-gray-500">Top Category</p>
            <h2 className="text-2xl font-bold text-green-600">
              {expenses[0]?.category || "N/A"}
            </h2>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryChart expenses={expenses} />
          <MonthlyChart expenses={expenses} />
        </div>

        {/* Insights */}
        <Insights expenses={expenses} />
      </div>
    </div>
  );
}
