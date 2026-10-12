import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import api from "../api";
import PaperCard from "../components/PaperCard";

const STATUS_FILTERS = [
  { key: "all", label: "All papers" },
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

  // Typing rukne ke 300ms baad search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    api.get("/papers/tags").then((res) => setAllTags(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    api
      .get("/papers", { params: { search: debouncedSearch || undefined, tag: tag || undefined } })
      .then((res) => { if (!ignore) setPapers(res.data); })
      .catch((err) => {
        if (!ignore) setError(err.response?.data?.message || "Couldn't load your papers. Refresh to try again.");
      })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [debouncedSearch, tag]);

  const countFor = (key) =>
    key === "all" ? papers.length : papers.filter((p) => p.status === key).length;
  const visible = status === "all" ? papers : papers.filter((p) => p.status === status);
  const hasQuery = Boolean(debouncedSearch || tag);
  const isFiltered = hasQuery || status !== "all";

  const clearFilters = () => {
    setSearch("");
    setTag("");
    setStatus("all");
  };

  const renderList = () => {
    if (error) return <p className="alert-error mt-6" role="alert">{error}</p>;

    if (loading) {
      return (
        <ul className="divide-y divide-rule border-y border-rule" aria-busy="true" aria-label="Loading papers">
          {[0, 1, 2].map((i) => (
            <li key={i} className="px-2 py-5">
              <div className="h-5 w-3/4 rounded bg-rule motion-safe:animate-pulse" />
              <div className="mt-3 h-3.5 w-1/3 rounded bg-rule motion-safe:animate-pulse" />
            </li>
          ))}
        </ul>
      );
    }

    if (papers.length === 0 && !hasQuery) {
      return (
        <div className="border-y border-rule px-2 py-16 text-center">
          <h2 className="font-serif text-2xl">Your reading list is empty</h2>
          <p className="mx-auto mt-2 max-w-md text-ink-soft">
            Add a paper by its arXiv ID or link, and the title, authors and abstract fill in for you.
          </p>
          <Link to="/papers/new" className="btn btn-primary mt-6">Add your first paper</Link>
        </div>
      );
    }

    if (visible.length === 0) {
      return (
        <div className="border-y border-rule px-2 py-12 text-center">
          <p className="text-ink-soft">No papers match these filters.</p>
          <button onClick={clearFilters} className="btn btn-secondary mt-4">Clear filters</button>
        </div>
      );
    }

    return (
      <ul className="divide-y divide-rule border-y border-rule">
        {visible.map((paper) => (
          <PaperCard key={paper._id} paper={paper} />
        ))}
      </ul>
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl">Reading list</h1>
        {!loading && !error && (
          <p className="mt-1 text-ink-soft">
            {papers.length} {papers.length === 1 ? "paper" : "papers"}
            {hasQuery ? " match your search" : " saved"}
          </p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[13rem_1fr] lg:gap-12">
        {/* Sidebar: filters */}
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <section>
            <h2 className="mb-2 text-sm font-medium text-ink-soft">Status</h2>
            <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-0.5 lg:pb-0">
              {STATUS_FILTERS.map((f) => {
                const active = status === f.key;
                return (
                  <li key={f.key}>
                    <button
                      onClick={() => setStatus(f.key)}
                      aria-pressed={active}
                      className={`flex w-full items-center justify-between gap-3 whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors ${
                        active
                          ? "bg-white font-medium text-ink shadow-[inset_2px_0_0_var(--color-pen)]"
                          : "text-ink-soft hover:bg-white/70 hover:text-ink"
                      }`}
                    >
                      <span>{f.label}</span>
                      <span className="text-xs tabular-nums text-ink-soft">{countFor(f.key)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {allTags.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-medium text-ink-soft">Tags</h2>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                {allTags.map((t) => {
                  const active = tag === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setTag(active ? "" : t)}
                      aria-pressed={active}
                      className={`text-sm ${
                        active ? "font-medium text-pen underline underline-offset-4" : "text-ink-soft hover:text-ink"
                      }`}
                    >
                      #{t}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {isFiltered && (
            <button onClick={clearFilters} className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink">
              <X size={14} aria-hidden="true" />
              Clear filters
            </button>
          )}
        </aside>

        {/* Main: search + list */}
        <section>
          <label htmlFor="search" className="sr-only">Search papers</label>
          <div className="relative mb-4">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
              aria-hidden="true"
            />
            <input
              id="search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search titles, authors, abstracts and notes"
              className="field py-2.5 pl-10"
            />
          </div>
          {renderList()}
        </section>
      </div>
    </div>
  );
}