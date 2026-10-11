import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const EMPTY_FORM = {
  title: "",
  authors: "",
  abstract: "",
  arxivId: "",
  pdfUrl: "",
  tags: "",
  status: "to-read",
  notes: "",
};

// "a, b , ,c" → ["a", "b", "c"]
const splitList = (text) =>
  text.split(",").map((s) => s.trim()).filter(Boolean);

export default function AddPaper() {
  const navigate = useNavigate();
  const [arxivInput, setArxivInput] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // arXiv se details laao aur form bharo
  const handleFetch = async (e) => {
    e.preventDefault();
    if (!arxivInput.trim()) return;
    setError("");
    setFetching(true);
    try {
      const { data } = await api.get("/arxiv", { params: { id: arxivInput.trim() } });
      setForm((prev) => ({
        ...prev,
        title: data.title,
        authors: data.authors.join(", "),
        abstract: data.abstract,
        arxivId: data.arxivId,
        pdfUrl: data.pdfUrl,
      }));
    } catch (err) {
      setError(err.response?.data?.message || "arXiv se details nahi aayi");
    } finally {
      setFetching(false);
    }
  };

  // Paper database mein save karo
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/papers", {
        ...form,
        authors: splitList(form.authors),
        tags: splitList(form.tags),
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Paper save nahi hua");
      setSaving(false);
    }
  };

  const inputClass = "w-full border rounded-md px-3 py-2";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Add Paper</h1>

      {/* arXiv fetch: alag form, taaki yahan Enter dabane pe paper save na ho */}
      <form onSubmit={handleFetch} className="bg-white border rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium mb-2">arXiv ID ya link (optional)</label>
        <div className="flex gap-2">
          <input
            value={arxivInput}
            onChange={(e) => setArxivInput(e.target.value)}
            placeholder="1706.03762 ya https://arxiv.org/abs/1706.03762"
            className={inputClass}
          />
          <button
            disabled={fetching}
            className="bg-gray-800 text-white px-4 rounded-md whitespace-nowrap disabled:opacity-50"
          >
            {fetching ? "Fetching..." : "Fetch"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Fetch karne se title, authors aur abstract apne aap bhar jaayenge.
        </p>
      </form>

      {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded mb-4">{error}</p>}

      {/* Main form */}
      <form onSubmit={handleSave} className="bg-white border rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input name="title" required value={form.title} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Authors (comma se alag)</label>
          <input name="authors" value={form.authors} onChange={handleChange}
            placeholder="Ashish Vaswani, Noam Shazeer" className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Abstract</label>
          <textarea name="abstract" rows={5} value={form.abstract} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma se alag)</label>
          <input name="tags" value={form.tags} onChange={handleChange}
            placeholder="ai, transformers" className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
            <option value="to-read">To read</option>
            <option value="reading">Reading</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea name="notes" rows={3} value={form.notes} onChange={handleChange} className={inputClass} />
        </div>

        {form.pdfUrl && (
          <p className="text-sm">
            PDF:{" "}
            <a href={form.pdfUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              {form.pdfUrl}
            </a>
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button disabled={saving} className="bg-blue-600 text-white px-5 py-2 rounded-md disabled:opacity-50">
            {saving ? "Saving..." : "Save Paper"}
          </button>
          <Link to="/" className="px-5 py-2 rounded-md border">Cancel</Link>
        </div>
      </form>
    </div>
  );
}