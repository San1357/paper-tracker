import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import StatusBadge from "../components/StatusBadge";

const STATUSES = [
  { key: "to-read", label: "To read" },
  { key: "reading", label: "Reading" },
  { key: "done", label: "Done" },
];

const splitList = (text) => text.split(",").map((s) => s.trim()).filter(Boolean);

export default function PaperDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paper, setPaper] = useState(null);
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Server se aaye paper ko screen pe set karo
  const applyPaper = (data) => {
    setPaper(data);
    setTags(data.tags.join(", "));
    setNotes(data.notes || "");
  };

  // Page khulte hi paper load karo
  useEffect(() => {
    api
      .get(`/papers/${id}`)
      .then((res) => applyPaper(res.data))
      .catch((err) => setError(err.response?.data?.message || "Paper load nahi hua"))
      .finally(() => setLoading(false));
  }, [id]);

  // Koi bhi change backend pe bhejo
  const update = async (changes, successMsg) => {
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const { data } = await api.put(`/papers/${id}`, changes);
      applyPaper(data);
      setMessage(successMsg);
    } catch (err) {
      setError(err.response?.data?.message || "Save nahi hua");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Ye paper delete karna hai? Ye wapas nahi aayega.")) return;
    try {
      await api.delete(`/papers/${id}`);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Delete nahi hua");
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;

  if (!paper) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/" className="text-blue-600">← Dashboard pe wapas</Link>
      </div>
    );
  }

  // Tags ya notes badle hain? Tabhi Save button chalu ho
  const isDirty = tags !== paper.tags.join(", ") || notes !== (paper.notes || "");

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Link to="/" className="text-sm text-blue-600">← All papers</Link>

      {/* Header */}
      <div className="bg-white border rounded-lg p-5">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold">{paper.title}</h1>
          <StatusBadge status={paper.status} />
        </div>
        {paper.authors.length > 0 && (
          <p className="text-gray-600 mt-2">{paper.authors.join(", ")}</p>
        )}
        <div className="flex flex-wrap gap-4 mt-3 text-sm">
          {paper.arxivId && (
            <a href={`https://arxiv.org/abs/${paper.arxivId}`} target="_blank" rel="noreferrer"
              className="text-blue-600 underline">arXiv: {paper.arxivId}</a>
          )}
          {paper.pdfUrl && (
            <a href={paper.pdfUrl} target="_blank" rel="noreferrer"
              className="text-blue-600 underline">📄 PDF</a>
          )}
          <span className="text-gray-400">
            Added {new Date(paper.createdAt).toLocaleDateString("en-IN")}
          </span>
        </div>
      </div>

      {/* Status: click karte hi save */}
      <div className="bg-white border rounded-lg p-5">
        <h2 className="font-medium mb-3">Status</h2>
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s.key}
              disabled={saving || paper.status === s.key}
              onClick={() => update({ status: s.key }, "Status update ho gaya ✓")}
              className={`px-3 py-1.5 rounded-md text-sm border ${
                paper.status === s.key ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Abstract */}
      {paper.abstract && (
        <div className="bg-white border rounded-lg p-5">
          <h2 className="font-medium mb-2">Abstract</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{paper.abstract}</p>
        </div>
      )}

      {/* Tags + Notes: Save button se */}
      <div className="bg-white border rounded-lg p-5 space-y-4">
        <div>
          <label className="block font-medium mb-1">Tags (comma se alag)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)}
            className="w-full border rounded-md px-3 py-2" placeholder="ai, transformers" />
        </div>
        <div>
          <label className="block font-medium mb-1">Notes</label>
          <textarea rows={6} value={notes} onChange={(e) => setNotes(e.target.value)}
            className="w-full border rounded-md px-3 py-2" placeholder="Is paper ke baare mein apne notes..." />
        </div>
        <div className="flex items-center gap-3">
          <button
            disabled={!isDirty || saving}
            onClick={() => update({ tags: splitList(tags), notes }, "Changes save ho gaye ✓")}
            className="bg-blue-600 text-white px-5 py-2 rounded-md disabled:opacity-40"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          {message && <span className="text-sm text-green-700">{message}</span>}
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

      {/* Delete */}
      <div className="border border-red-200 rounded-lg p-5">
        <h2 className="font-medium text-red-700 mb-2">Danger zone</h2>
        <button onClick={handleDelete} className="text-sm border border-red-600 text-red-600 px-4 py-2 rounded-md hover:bg-red-50">
          Delete paper
        </button>
      </div>
    </div>
  );
}