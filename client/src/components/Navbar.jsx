import { Link, useNavigate } from "react-router-dom";
import { BookOpenText, Plus, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initial = user?.name?.[0]?.toUpperCase() || "?";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 border-b border-rule bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-serif text-xl text-ink">
          <BookOpenText size={22} className="text-pen" aria-hidden="true" />
          Paper Tracker
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/papers/new" className="btn btn-primary" aria-label="Add paper">
            <Plus size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Add paper</span>
          </Link>

          <div className="flex items-center gap-2 border-l border-rule pl-3">
            <span
              className="grid h-8 w-8 place-items-center rounded-full bg-pen/10 text-sm font-semibold text-pen"
              aria-hidden="true"
            >
              {initial}
            </span>
            <span className="hidden text-sm text-ink-soft md:inline">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="rounded-md p-2 text-ink-soft hover:bg-white hover:text-ink"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}