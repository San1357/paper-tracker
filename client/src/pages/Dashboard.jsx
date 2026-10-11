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
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [tag, setTag] = useState("");
  const [status, setStatus] = useState("all");

  // 1. Debounce: user typing rokne ke 300ms baad hi search chalao
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // 2. Tags dropdown ke liye list (ek baar)
  useEffect(() => {
    api.get("/papers/tags").then((res) => setAllTags(res.data)).catch(() => {});
  }, []);

  // 3. Search ya tag badle to papers dobara laao
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    api
      .get("/papers", {
        params: { search: debouncedSearch || undefined, tag: tag || undefined },
      })
      .then((res) => { if (!ignore) setPapers(res.data); })
      .catch((err) => { if (!ignore) setError(err.response?.data?.message || "Papers load nahi hue"); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [debouncedSearch, tag]);

  const countFor = (key) =>
    key === "all" ? papers.length : papers.filter((p) => p.status === key).length;
  const visible = status === "all" ? papers : papers.filter((p) => p.status === status);
  const hasFilters = debouncedSearch || tag;

  const clearFilters = () => {
    setSearch("");
    setTag("");
    setStatus("all");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">My Papers</h1>

      {/* Search + Tag */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Title, author, abstract ya notes mein search..."
          className="flex-1 border rounded-md px-3 py-2 bg-white"
        />
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="border rounded-md px-3 py-2 bg-white"
        >
          <option value="">All tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>#{t}</option>
          ))}
        </select>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setStatus(f.key)}
            className={`px-3 py-1.5 rounded-md text-sm border ${
              status === f.key ? "bg-blue-600 text-white border-blue-600" : "bg-white"
            }`}
          >
            {f.label} ({countFor(f.key)})
          </button>
        ))}
        {(hasFilters || status !== "all") && (
          <button onClick={clearFilters} className="text-sm text-gray-500 underline ml-2">
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : papers.length === 0 && !hasFilters ? (
        <div className="text-center py-16 bg-white border rounded-lg">
          <p className="text-gray-600 mb-4">Abhi tak koi paper nahi hai.</p>
          <Link to="/papers/new" className="bg-blue-600 text-white px-4 py-2 rounded-md">
            + Pehla paper add karo
          </Link>
        </div>
      ) : visible.length === 0 ? (
        <p className="text-gray-500">Koi paper match nahi hua.</p>
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