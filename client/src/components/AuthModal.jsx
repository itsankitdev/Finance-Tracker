import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Wallet } from "lucide-react";
import { login, register } from "../api/authApi";

const inputWrapStyle = {
  position: "relative",
  marginBottom: "14px",
};

const inputStyle = {
  background: "rgba(255,255,255,0.85)",
  border: "1px solid rgba(139,92,246,0.25)",
  borderRadius: "12px",
  padding: "11px 14px 11px 40px",
  width: "100%",
  fontSize: "14px",
  color: "#374151",
  outline: "none",
  transition: "border 0.2s, box-shadow 0.2s",
};

const iconStyle = {
  position: "absolute",
  left: "13px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#a78bfa",
  pointerEvents: "none",
};

export default function AuthModal({ isOpen, isLogin, onClose, onSuccess, message }) {
  const [mode, setMode] = useState(isLogin);

  useEffect(() => setMode(isLogin), [isLogin]);

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFocus = (e) => {
    e.target.style.border = "1px solid rgba(139,92,246,0.60)";
    e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.10)";
  };

  const handleBlur = (e) => {
    e.target.style.border = "1px solid rgba(139,92,246,0.25)";
    e.target.style.boxShadow = "none";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode) {
        const res = await login({ email: form.email.toLowerCase(), password: form.password });
        localStorage.setItem("token", res.data.token);
      } else {
        await register({ name: form.name, email: form.email.toLowerCase(), password: form.password });
      }
      window.dispatchEvent(new Event("login"));
      onSuccess();
    } catch {
      alert(mode ? "Invalid credentials" : "User already exists");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          style={{ background: "rgba(109,40,217,0.18)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="relative w-full max-w-sm rounded-2xl p-7 z-10"
          style={{
            background: "rgba(255,255,255,0.80)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.90)",
            boxShadow: "0 24px 64px rgba(109,40,217,0.20)",
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg transition-all hover:scale-110"
            style={{ background: "rgba(139,92,246,0.08)", color: "#7c3aed" }}
          >
            <X size={15} />
          </button>

          {/* Brand */}
          <div className="flex flex-col items-center mb-6">
            <div
              className="p-3 rounded-2xl mb-3"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                boxShadow: "0 6px 20px rgba(109,40,217,0.30)",
              }}
            >
              <Wallet size={22} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-violet-700">
              {mode ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-xs text-violet-400 mt-1">
              {mode ? "Login to your FinanceTracker" : "Start tracking your expenses"}
            </p>
          </div>

          {/* Error message */}
          {message && (
            <div
              className="text-sm text-center mb-4 py-2 px-3 rounded-xl"
              style={{
                background: "rgba(239,68,68,0.08)",
                color: "#dc2626",
                border: "1px solid rgba(239,68,68,0.18)",
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name — only for register */}
            {!mode && (
              <div style={inputWrapStyle}>
                <User size={15} style={iconStyle} />
                <input
                  name="name"
                  placeholder="Full name"
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            )}

            {/* Email */}
            <div style={inputWrapStyle}>
              <Mail size={15} style={iconStyle} />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                onChange={handleChange}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Password */}
            <div style={{ ...inputWrapStyle, marginBottom: "20px" }}>
              <Lock size={15} style={iconStyle} />
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #4f46e5 100%)",
                boxShadow: "0 6px 20px rgba(109,40,217,0.35)",
              }}
            >
              {mode ? "Login" : "Create Account"}
            </button>
          </form>

          {/* Switch mode */}
          <p className="text-xs text-center mt-4 text-gray-500">
            {mode ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              onClick={() => setMode(!mode)}
              className="font-semibold cursor-pointer"
              style={{ color: "#7c3aed" }}
            >
              {mode ? "Register" : "Login"}
            </span>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}