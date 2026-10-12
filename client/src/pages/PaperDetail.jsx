import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, FileText, Sparkles, RefreshCw, Trash2 } from "lucide-react";
import api from "../api";
import StatusBadge from "../components/StatusBadge";

const STATUSES = ["to-read", "reading", "done"];
const splitList = (text) => text.split(",").map((s) => s.trim()).filter(Boolean);

function BackLink() {
  return (
    <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
      <ArrowLeft size={16} aria-hidden="true" />
      Reading list
    </Link>
  );
}

export default function PaperDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paper, setPaper] = useState(null);
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const applyPaper = (data) => {
    setPaper(data);
    setTags(data.tags.join(", "));
    setNotes(data.notes || "");
  };

  useEffect(() => {
    api
      .get(`/papers/${id}`)
      .then((res) => applyPaper(res.data))
      .catch((err) => setError(err.response?.data?.message || "Couldn't load this paper."))
      .finally(() => setLoading(false));
  }, [id]);

  const update = async (changes, { showSaved = false } = {}) => {
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      const { data } = await api.put(`/papers/${id}`, changes);
      applyPaper(data);
      if (showSaved) setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save your changes. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSummary = async (refresh = false) => {
    setError("");
    setSummarizing(true);
    try {
      const { data } = await api.post(`/papers/${id}/summary`, null, {
        params: refresh ? { refresh: 1 } : {},
      });
      applyPaper(data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't generate a summary. Try again in a minute.");
    } finally {
      setSummarizing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this paper? Your notes and summary will be deleted too.")) return;
    try {
      await api.delete(`/papers/${id}`);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't delete the paper. Try again.");
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12" aria-busy="true">
        <div className="h-4 w-24 rounded bg-rule motion-safe:animate-pulse" />
        <div className="mt-8 h-9 w-5/6 rounded bg-rule motion-safe:animate-pulse" />
        <div className="mt-4 h-4 w-1/2 rounded bg-rule motion-safe:animate-pulse" />
      </div>
    );
  }

  // Paper nahi mila
  if (!paper) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
        <BackLink />
        <h1 className="mt-8 font-serif text-3xl">Paper not found</h1>
        <p className="mt-2 text-ink-soft">{error || "It may have been deleted, or the link is wrong."}</p>
      </div>
    );
  }

  const isDirty = tags !== paper.tags.join(", ") || notes !== (paper.notes || "");
  const added = new Date(paper.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <BackLink />

      {/* Header */}
      <header className="mt-6">
        <h1 className="font-serif text-3xl leading-tight sm:text-4xl">
          <span className={paper.status === "reading" ? "highlight" : ""}>{paper.title}</span>
        </h1>
        {paper.authors.length > 0 && (
          <p className="mt-3 leading-relaxed text-ink-soft">{paper.authors.join(", ")}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {paper.arxivId && (
            <a href={`https://arxiv.org/abs/${paper.arxivId}`} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-pen hover:underline">
              <ExternalLink size={14} aria-hidden="true" />
              arXiv {paper.arxivId}
            </a>
          )}
          {paper.pdfUrl && (
            <a href={paper.pdfUrl} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-pen hover:underline">
              <FileText size={14} aria-hidden="true" />
              Read PDF
            </a>
          )}
          <span className="text-ink-soft">Added {added}</span>
        </div>
      </header>

      {/* Status */}
      <div className="mt-8 inline-flex flex-wrap gap-1 rounded-md border border-rule bg-white p-1" role="group" aria-label="Reading status">
        {STATUSES.map((s) => {
          const active = paper.status === s;
          return (
            <button
              key={s}
              onClick={() => update({ status: s })}
              disabled={saving || active}
              aria-pressed={active}
              className={`rounded px-3 py-1.5 transition-colors disabled:cursor-default ${
                active ? "bg-paper shadow-sm" : "hover:bg-paper/60"
              }`}
            >
              <StatusBadge status={s} />
            </button>
          );
        })}
      </div>

      {error && <p className="alert-error mt-6" role="alert">{error}</p>}

      {/* Abstract */}
      {paper.abstract && (
        <section className="mt-10 border-t border-rule pt-8">
          <h2 className="text-center font-serif text-lg font-semibold">Abstract</h2>
          <p className="mx-auto mt-3 max-w-prose font-serif text-[1.0625rem] leading-relaxed text-ink/90 first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-serif first-letter:text-5xl first-letter:font-semibold first-letter:leading-[0.8] first-letter:text-pen">
            {paper.abstract}
          </p>
        </section>
      )}

      {/* AI summary */}
      <section className="mt-10 rounded-r-lg border-l-2 border-pen bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="inline-flex items-center gap-2 font-medium">
            <Sparkles size={16} className="text-pen" aria-hidden="true" />
            AI summary
          </h2>
          {paper.summary && (
            <button
              onClick={() => handleSummary(true)}
              disabled={summarizing}
              className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink disabled:opacity-50"
            >
              <RefreshCw size={14} className={summarizing ? "motion-safe:animate-spin" : ""} aria-hidden="true" />
              {summarizing ? "Regenerating..." : "Regenerate"}
            </button>
          )}
        </div>

        {paper.summary ? (
          <>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-ink/90">{paper.summary}</p>
            <p className="mt-4 text-xs text-ink-soft">
              Generated from the abstract. Check important details against the paper.
            </p>
          </>
        ) : !paper.abstract ? (
          <p className="mt-3 text-sm text-ink-soft">
            A summary needs an abstract. Papers imported from arXiv include one.
          </p>
        ) : (
          <>
            <p className="mt-3 text-sm text-ink-soft">
              Get the main idea, key contributions and why the paper matters.
            </p>
            <button onClick={() => handleSummary(false)} disabled={summarizing} className="btn btn-primary mt-4">
              <Sparkles size={16} aria-hidden="true" />
              {summarizing ? "Generating summary..." : "Generate summary"}
            </button>
          </>
        )}
      </section>

      {/* Notes */}
      <section className="mt-10 space-y-5 border-t border-rule pt-8">
        <h2 className="font-serif text-xl">Your notes</h2>
        <div>
          <label htmlFor="tags" className="label">Tags</label>
          <input id="tags" value={tags} onChange={(e) => { setTags(e.target.value); setSaved(false); }}
            placeholder="transformers, nlp" className="field" />
        </div>
        <div>
          <label htmlFor="notes" className="label">Notes</label>
          <textarea id="notes" rows={8} value={notes}
            onChange={(e) => { setNotes(e.target.value); setSaved(false); }}
            placeholder="Key ideas, questions, how it connects to your work..."
            className="field leading-relaxed" />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => update({ tags: splitList(tags), notes }, { showSaved: true })}
            disabled={!isDirty || saving}
            className="btn btn-primary"
          >
            {saving ? "Saving..." : "Save notes"}
          </button>
          <span className="text-sm text-ink-soft" role="status">{saved && !isDirty ? "Saved" : ""}</span>
        </div>
      </section>

      {/* Delete */}
      <section className="mt-12 flex flex-col gap-3 border-t border-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft">Deleting removes this paper, your notes and its summary.</p>
        <button onClick={handleDelete} className="btn btn-danger">
          <Trash2 size={16} aria-hidden="true" />
          Delete paper
        </button>
      </section>
    </article>
  );
}