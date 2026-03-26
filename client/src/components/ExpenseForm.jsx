import { useState } from "react";

export default function ExpenseForm({ onAdd }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.amount) return;

    onAdd({
      ...form,
      amount: Number(form.amount),
      id: Date.now(),
    });

    setForm({ title: "", amount: "", category: "Food" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow mb-6"
    >
      <h2 className="text-lg font-bold mb-3">Add Expense</h2>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="border p-2 mr-2"
      />

      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        className="border p-2 mr-2"
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="border p-2 mr-2"
      >
        <option>Food</option>
        <option>Travel</option>
        <option>Bills</option>
        <option>Other</option>
      </select>

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Add
      </button>
    </form>
  );
}
