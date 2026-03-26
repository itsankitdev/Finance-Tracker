import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/expenses",
});

// GET all expenses
export const fetchExpenses = () => API.get("/");

// CREATE expense
export const createExpense = (data) => API.post("/", data);
