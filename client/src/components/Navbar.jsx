import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-lg font-semibold">📄 Paper Tracker</Link>
      <div className="flex items-center gap-4">
        <Link to="/papers/new" className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm">
          + Add Paper
        </Link>
        <span className="text-sm text-gray-600">{user?.name}</span>
        <button onClick={handleLogout} className="text-sm text-red-600">Logout</button>
      </div>
    </nav>
  );
}