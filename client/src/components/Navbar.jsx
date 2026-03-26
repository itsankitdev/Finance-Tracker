import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-green-500 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Finance Dashboard</h1>
      <div>
        <Link className="mr-4" to="/">Dashboard</Link>
        <Link className="mr-4" to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}
