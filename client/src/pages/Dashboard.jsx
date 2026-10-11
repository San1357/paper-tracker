import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Welcome, {user?.name} 👋</h1>
      <p className="text-gray-600 mt-2">Papers ki list Part 4B mein aayegi.</p>
    </div>
  );
}