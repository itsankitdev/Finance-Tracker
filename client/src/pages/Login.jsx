import { useState, useEffect } from "react";
import { login } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(form);

      localStorage.setItem("token", res.data.token);

      navigate("/");
    } catch (err) {
      alert("Invalid credentials");
    }
  };


useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "/";
  }
}, []);


  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Login
        </h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded"
        />

        <button className="w-full bg-green-600 text-white py-2 rounded">
          Login
        </button>

        <p className="text-sm mt-3 text-center">
          No account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-green-600 cursor-pointer"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
