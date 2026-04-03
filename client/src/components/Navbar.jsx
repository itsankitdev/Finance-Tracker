import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";

export default function Navbar({ onAuthOpen }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

  useEffect(() => {
    const handleLogin = () => {
      setIsLoggedIn(true);
      setUserName(localStorage.getItem("userName") || "");
    };
    const handleLogout = () => {
      setIsLoggedIn(false);
      setUserName("");
    };
    window.addEventListener("login", handleLogin);
    window.addEventListener("logout", handleLogout);
    return () => {
      window.removeEventListener("login", handleLogin);
      window.removeEventListener("logout", handleLogout);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.dispatchEvent(new Event("logout"));
  };

  const displayName = userName ? userName.split(" ")[0] : "";

  return (
    <nav
      style={{
        background: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 40%, #4f46e5 100%)",
        padding: "8px 12px",
      }}
    >
      <div
        className="flex justify-between items-center rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.18)",
          padding: "8px 14px",
          minHeight: "48px",
          gap: "8px",
        }}
      >
        {/* Brand — shrinks on mobile */}
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="flex-shrink-0 p-1.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <Wallet size={16} className="text-white" />
          </div>
          <span
            className="text-white font-bold whitespace-nowrap"
            style={{ fontSize: "clamp(13px, 3.5vw, 18px)" }}
          >
            Finance<span className="text-violet-200">Tracker</span>
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center flex-shrink-0" style={{ gap: "6px" }}>
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => onAuthOpen(true)}
                className="text-white/90 hover:text-white font-medium transition-all hover:bg-white/10 rounded-xl whitespace-nowrap"
                style={{ fontSize: "12px", padding: "5px 10px" }}
              >
                Login
              </button>
              <button
                onClick={() => onAuthOpen(false)}
                className="font-semibold rounded-xl whitespace-nowrap transition-all"
                style={{
                  fontSize: "12px",
                  padding: "5px 12px",
                  background: "rgba(255,255,255,0.95)",
                  color: "#6d28d9",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Register
              </button>
            </>
          ) : (
            <>
              {/* ✅ Compact greeting — avatar only on very small screens */}
              {displayName && (
                <div
                  className="flex items-center gap-1.5 whitespace-nowrap"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: "20px",
                    padding: "4px 10px 4px 5px",
                  }}
                >
                  {/* Avatar circle */}
                  <div
                    className="flex items-center justify-center rounded-full font-bold flex-shrink-0"
                    style={{
                      width: "22px",
                      height: "22px",
                      background: "rgba(255,255,255,0.90)",
                      color: "#6d28d9",
                      fontSize: "10px",
                    }}
                  >
                    {displayName[0].toUpperCase()}
                  </div>
                  {/* Hide name text on very small screens, show on sm+ */}
                  <span
                    className="text-white font-medium hidden sm:inline"
                    style={{ fontSize: "12px" }}
                  >
                    Hi, {displayName}!
                  </span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="font-semibold rounded-xl whitespace-nowrap text-white transition-all"
                style={{
                  fontSize: "12px",
                  padding: "5px 12px",
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}