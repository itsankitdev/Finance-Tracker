import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";

export default function Navbar({ onAuthOpen }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    const handleLogin = () => setIsLoggedIn(true);
    const handleLogout = () => setIsLoggedIn(false);
    window.addEventListener("login", handleLogin);
    window.addEventListener("logout", handleLogout);
    return () => {
      window.removeEventListener("login", handleLogin);
      window.removeEventListener("logout", handleLogout);
    };
  }, []);



  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("logout"));
  };

  return (
    <nav
      className="z-50 transition-all duration-300"
      style={{
       background: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 40%, #4f46e5 100%)",
      }}
    >
      {/* Glassmorphism inner bar */}
      <div
        className="mx-4 my-2 rounded-2xl px-5 py-3 flex justify-between items-center"
        style={{
          background: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div
            className="p-1.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <Wallet size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-wide">
            Finance<span className="text-violet-200">Tracker</span>
          </span>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => onAuthOpen(true)}
                className="text-white/90 hover:text-white text-sm font-medium px-4 py-1.5 rounded-xl transition-all hover:bg-white/10"
              >
                Login
              </button>
              <button
                onClick={() => onAuthOpen(false)}
                className="text-sm font-semibold px-4 py-1.5 rounded-xl transition-all"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  color: "#6d28d9",
                }}
              >
                Register
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-sm font-semibold px-4 py-1.5 rounded-xl transition-all text-white"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}