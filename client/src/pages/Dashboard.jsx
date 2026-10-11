import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import PaperCard from "../components/PaperCard";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "to-read", label: "To read" },
  { key: "reading", label: "Reading" },
  { key: "done", label: "Done" },
];

export default function Dashboard() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api
      .get("/papers")
      .then((res) => setPapers(res.data))
      .catch((err) => setError(err.response?.data?.message || "Papers load nahi hue"))
      .finally(() => setLoading(false));
  }, []);

  const countFor = (key) =>
    key === "all" ? papers.length : papers.filter((p) => p.status === key).length;

  const visible = filter === "all" ? papers : papers.filter((p) => p.status === filter);

  if (loading) return <p className="p-6 text-gray-500">Loading papers...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">My Papers</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-md text-sm border ${
              filter === f.key ? "bg-blue-600 text-white border-blue-600" : "bg-white"
            }`}
          >
            {f.label} ({countFor(f.key)})
          </button>
        ))}
      </div>

      {/* Empty state */}
      {papers.length === 0 ? (
        <div className="text-center py-16 bg-white border rounded-lg">
          <p className="text-gray-600 mb-4">Abhi tak koi paper nahi hai.</p>
          <Link to="/papers/new" className="bg-blue-600 text-white px-4 py-2 rounded-md">
            + Pehla paper add karo
          </Link>
        </div>
      ) : visible.length === 0 ? (
        <p className="text-gray-500">Is filter mein koi paper nahi.</p>
      ) : (
        <div className="space-y-3">
          {visible.map((paper) => (
            <PaperCard key={paper._id} paper={paper} />
          ))}
        </div>
      )}
    </div>
  );
}