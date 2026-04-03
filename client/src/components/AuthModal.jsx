import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Wallet, AlertCircle, CheckCircle2 } from "lucide-react";
import { login, register } from "../api/authApi";

const inputWrapStyle = { position: "relative", marginBottom: "4px" };

const inputStyle = {
  background: "rgba(255,255,255,0.85)",
  border: "1px solid rgba(139,92,246,0.25)",
  borderRadius: "12px",
  padding: "11px 14px 11px 40px",
  width: "100%",
  fontSize: "14px",
  color: "#1f2937",
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

// ── Validation helpers ────────────────────────────────────────────────────────
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

function validate(form, mode) {
  const errors = {};

  if (!mode && !form.name.trim()) {
    errors.name = "Name is required";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(form.email)) {
    errors.email = "Enter a valid email (e.g. john@gmail.com)";
  }

  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}

// ── Field error message ───────────────────────────────────────────────────────
function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-1 mt-1 mb-2" style={{ color: "#dc2626" }}>
      <AlertCircle size={12} />
      <span style={{ fontSize: "12px", fontWeight: "500" }}>{msg}</span>
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function AuthModal({ isOpen, isLogin, onClose, onSuccess, message }) {
  const [mode, setMode] = useState(isLogin);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    setMode(isLogin);
    setErrors({});
    setTouched({});
    setApiError("");
    setForm({ name: "", email: "", password: "" });
  }, [isLogin, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    // Live re-validate touched fields
    if (touched[e.target.name]) {
      const newErrors = validate(updated, mode);
      setErrors((prev) => ({ ...prev, [e.target.name]: newErrors[e.target.name] }));
    }
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    const newErrors = validate(form, mode);
    setErrors((prev) => ({ ...prev, [e.target.name]: newErrors[e.target.name] }));
  };

  const getBorderStyle = (field) => {
    if (touched[field] && errors[field]) return "1px solid #ef4444";
    if (touched[field] && !errors[field] && form[field]) return "1px solid #10b981";
    return "1px solid rgba(139,92,246,0.25)";
  };

  const getBoxShadow = (field) => {
    if (touched[field] && errors[field]) return "0 0 0 3px rgba(239,68,68,0.10)";
    if (touched[field] && !errors[field] && form[field]) return "0 0 0 3px rgba(16,185,129,0.10)";
    return "none";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Mark all fields touched
    setTouched({ name: true, email: true, password: true });

    const validationErrors = validate(form, mode);
    setErrors(validationErrors);

    // Stop if any errors
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      if (mode) {
        // LOGIN
        const res = await login({
          email: form.email.toLowerCase().trim(),
          password: form.password,
        });
        localStorage.setItem("token", res.data.token);
        const name = res.data?.user?.name || res.data?.name || "";
        localStorage.setItem("userName", name);
      } else {
        // REGISTER
        const res = await register({
          name: form.name.trim(),
          email: form.email.toLowerCase().trim(),
          password: form.password,
        });
        const name = res.data?.user?.name || res.data?.name || form.name.trim();
        localStorage.setItem("userName", name);
        if (res.data?.token) localStorage.setItem("token", res.data.token);
      }
      window.dispatchEvent(new Event("login"));
      onSuccess();
    } catch {
      setApiError(mode ? "Invalid email or password. Please try again." : "This email is already registered.");
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode((m) => !m);
    setErrors({});
    setTouched({});
    setApiError("");
    setForm({ name: "", email: "", password: "" });
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
            background: "rgba(255,255,255,0.88)",
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
          <div className="flex flex-col items-center mb-5">
            <div
              className="p-3 rounded-2xl mb-3"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                boxShadow: "0 6px 20px rgba(109,40,217,0.30)",
              }}
            >
              <Wallet size={22} className="text-white" />
            </div>
            <h2 className="text-xl font-bold" style={{ color: "#4c1d95" }}>
              {mode ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-xs mt-1" style={{ color: "#6d28d9" }}>
              {mode ? "Login to your FinanceTracker" : "Start tracking your expenses"}
            </p>
          </div>

          {/* Prop message (from dashboard trigger) */}
          {message && (
            <div className="text-sm text-center mb-3 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5"
              style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.18)" }}>
              <AlertCircle size={13} />
              {message}
            </div>
          )}

          {/* API error */}
          {apiError && (
            <div className="text-sm text-center mb-3 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5"
              style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.18)" }}>
              <AlertCircle size={13} />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Name — register only */}
            {!mode && (
              <div style={inputWrapStyle}>
                <User size={15} style={iconStyle} />
                <input
                  name="name"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ ...inputStyle, border: getBorderStyle("name"), boxShadow: getBoxShadow("name") }}
                />
                {touched.name && !errors.name && form.name && (
                  <CheckCircle2 size={14} style={{ position: "absolute", right: "12px", top: "13px", color: "#10b981" }} />
                )}
                <FieldError msg={errors.name} />
              </div>
            )}

            {/* Email */}
            <div style={inputWrapStyle}>
              <Mail size={15} style={iconStyle} />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ ...inputStyle, border: getBorderStyle("email"), boxShadow: getBoxShadow("email") }}
              />
              {touched.email && !errors.email && form.email && (
                <CheckCircle2 size={14} style={{ position: "absolute", right: "12px", top: "13px", color: "#10b981" }} />
              )}
              <FieldError msg={errors.email} />
            </div>

            {/* Password */}
            <div style={{ ...inputWrapStyle, marginBottom: "18px" }}>
              <Lock size={15} style={iconStyle} />
              <input
                name="password"
                type="password"
                placeholder="Password (min 6 characters)"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ ...inputStyle, border: getBorderStyle("password"), boxShadow: getBoxShadow("password") }}
              />
              {touched.password && !errors.password && form.password && (
                <CheckCircle2 size={14} style={{ position: "absolute", right: "12px", top: "13px", color: "#10b981" }} />
              )}
              <FieldError msg={errors.password} />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{
                background: submitting
                  ? "rgba(139,92,246,0.5)"
                  : "linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #4f46e5 100%)",
                boxShadow: submitting ? "none" : "0 6px 20px rgba(109,40,217,0.35)",
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Please wait..." : mode ? "Login" : "Create Account"}
            </button>
          </form>

          {/* Switch mode */}
          <p className="text-xs text-center mt-4" style={{ color: "#4b5563" }}>
            {mode ? "Don't have an account?" : "Already have an account?"}{" "}
            <span onClick={switchMode} className="font-bold cursor-pointer" style={{ color: "#6d28d9" }}>
              {mode ? "Register" : "Login"}
            </span>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}