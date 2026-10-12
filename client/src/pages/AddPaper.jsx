import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, FileText } from "lucide-react";
import api from "../api";
import StatusBadge from "../components/StatusBadge";

const EMPTY_FORM = {
  title: "", authors: "", abstract: "", arxivId: "", pdfUrl: "",
  tags: "", status: "to-read", notes: "",
};
const STATUSES = ["to-read", "reading", "done"];
const splitList = (text) => text.split(",").map((s) => s.trim()).filter(Boolean);

export default function AddPaper() {
  const navigate = useNavigate();
  const [arxivInput, setArxivInput] = useState("");
  const [importedId, setImportedId] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImport = async (e) => {
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
      setImportedId(data.arxivId);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't import from arXiv. Check the ID and try again.");
    } finally {
      setFetching(false);
    }
  };

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
      setError(err.response?.data?.message || "Couldn't save the paper. Try again.");
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft size={16} aria-hidden="true" />
        Reading list
      </Link>
      <h1 className="mt-4 font-serif text-3xl sm:text-4xl">Add a paper</h1>
      <p className="mt-2 text-ink-soft">Import from arXiv to fill in the details, or enter them yourself.</p>

      {/* arXiv import */}
      <form onSubmit={handleImport} className="mt-8 rounded-lg border border-rule bg-white p-5">
        <label htmlFor="arxiv" className="label">arXiv ID or link</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="arxiv"
            value={arxivInput}
            onChange={(e) => setArxivInput(e.target.value)}
            placeholder="1706.03762 or https://arxiv.org/abs/1706.03762"
            className="field"
          />
          <button disabled={fetching || !arxivInput.trim()} className="btn btn-secondary whitespace-nowrap">
            <Download size={16} aria-hidden="true" />
            {fetching ? "Importing..." : "Import"}
          </button>
        </div>
        <p className={`mt-2 text-sm ${importedId ? "text-pen" : "text-ink-soft"}`} role="status">
          {importedId
            ? `Imported arXiv ${importedId}. Check the details below, then save.`
            : "Fills in the title, authors, abstract and PDF link."}
        </p>
      </form>

      {error && <p className="alert-error mt-6" role="alert">{error}</p>}

      <form onSubmit={handleSave} className="mt-10">
        {/* Paper details */}
        <section className="space-y-5">
          <h2 className="font-serif text-xl">Paper details</h2>
          <div>
            <label htmlFor="title" className="label">Title</label>
            <input id="title" name="title" required value={form.title} onChange={handleChange} className="field" />
          </div>
          <div>
            <label htmlFor="authors" className="label">Authors</label>
            <input id="authors" name="authors" value={form.authors} onChange={handleChange}
              placeholder="Ashish Vaswani, Noam Shazeer" className="field" />
            <p className="mt-1.5 text-xs text-ink-soft">Separate names with commas.</p>
          </div>
          <div>
            <label htmlFor="abstract" className="label">Abstract</label>
            <textarea id="abstract" name="abstract" rows={6} value={form.abstract}
              onChange={handleChange} className="field leading-relaxed" />
            <p className="mt-1.5 text-xs text-ink-soft">Needed for the AI summary.</p>
          </div>
          {form.pdfUrl && (
            <a href={form.pdfUrl} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-pen hover:underline">
              <FileText size={16} aria-hidden="true" />
              PDF linked
            </a>
          )}
        </section>

        {/* Your notes */}
        <section className="mt-10 space-y-5 border-t border-rule pt-8">
          <h2 className="font-serif text-xl">Your notes</h2>

          <fieldset>
            <legend className="label">Status</legend>
            <div className="inline-flex flex-wrap gap-1 rounded-md border border-rule bg-white p-1">
              {STATUSES.map((s) => (
                <label
                  key={s}
                  className={`cursor-pointer rounded px-3 py-1.5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-pen ${
                    form.status === s ? "bg-paper shadow-sm" : "hover:bg-paper/60"
                  }`}
                >
                  <input type="radio" name="status" value={s} checked={form.status === s}
                    onChange={handleChange} className="sr-only" />
                  <StatusBadge status={s} />
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="tags" className="label">Tags</label>
            <input id="tags" name="tags" value={form.tags} onChange={handleChange}
              placeholder="transformers, nlp" className="field" />
            <p className="mt-1.5 text-xs text-ink-soft">Separate tags with commas.</p>
          </div>
          <div>
            <label htmlFor="notes" className="label">Notes</label>
            <textarea id="notes" name="notes" rows={4} value={form.notes} onChange={handleChange}
              placeholder="Why you saved it, what to look for..." className="field" />
          </div>
        </section>

        <div className="mt-10 flex justify-end gap-3 border-t border-rule pt-6">
          <Link to="/" className="btn btn-secondary">Cancel</Link>
          <button disabled={saving} className="btn btn-primary">
            {saving ? "Saving..." : "Save paper"}
          </button>
        </div>
      </form>
    </div>
  );
}