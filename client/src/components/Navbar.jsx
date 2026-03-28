import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
     window.dispatchEvent(new Event("logout")); 
    navigate("/");
  };

  return (
    <nav className="bg-green-500 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Finance Dashboard</h1>

      <div className="flex items-center gap-4">
        <Link to="/">Dashboard</Link>

        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-white text-green-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
