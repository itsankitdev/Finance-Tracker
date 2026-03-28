import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LoginPromptModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl text-center"
      >
        <h2 className="text-lg font-semibold mb-2 text-gray-800">
          🚫 Access Restricted
        </h2>

        <p className="text-gray-600 mb-5">
          Register to add and manage your expenses.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/register")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            Register
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Login
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}
