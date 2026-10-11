import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
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
        <h1 className="text-2xl font-semibold">Register</h1>
        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
        <input name="name" placeholder="Name" required value={form.name}
          onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
        <input name="email" type="email" placeholder="Email" required value={form.email}
          onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
        <input name="password" type="password" placeholder="Password (min 6)" required minLength={6}
          value={form.password} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md disabled:opacity-50">
          {loading ? "Creating account..." : "Register"}
        </button>
        <p className="text-sm text-center">
          Pehle se account hai? <Link to="/login" className="text-blue-600">Login karo</Link>
        </p>
      </form>
    </div>
  );
}