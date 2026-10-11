import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Kuch gadbad ho gayi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Login</h1>
        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
        <input
          type="email" placeholder="Email" required
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          type="password" placeholder="Password" required
          value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md disabled:opacity-50">
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm text-center">
          Account nahi hai? <Link to="/register" className="text-blue-600">Register karo</Link>
        </p>
      </form>
    </div>
  );
}