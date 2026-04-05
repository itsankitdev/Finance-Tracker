import axios from "axios";

const API = axios.create({
  baseURL: "https://finance-tracker-aebv.onrender.com/api/expenses",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`; // ✅ fixed
  }
  return req;
});

// GET all expenses
export const fetchExpenses = () => API.get("/");

// CREATE expense
export const createExpense = (data) => API.post("/", data);

// DELETE
export const deleteExpense = (id) => API.delete(`/${id}`);

// UPDATE
export const updateExpense = (id, data) => API.put(`/${id}`, data);