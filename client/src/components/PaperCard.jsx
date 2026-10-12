import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { tagColor } from "../utils/tagColor";

const shortAuthors = (authors = []) =>
  authors.length > 3 ? `${authors.slice(0, 3).join(", ")} et al.` : authors.join(", ");

// arXiv ID "1706.03762" → 2017
export const arxivYear = (id) => {
  const match = id?.match(/^(\d{2})\d{2}\./);
  return match ? 2000 + Number(match[1]) : null;
};

export default function PaperCard({ paper }) {
  const authors = shortAuthors(paper.authors);
  const year = arxivYear(paper.arxivId);
  const byline = [authors, year && `(${year})`].filter(Boolean).join(" ");
  const added = new Date(paper.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  return (
    <li>
      <Link
        to={`/papers/${paper._id}`}
        className="group grid gap-x-6 gap-y-3 px-2 py-5 transition-colors hover:bg-white sm:grid-cols-[1fr_auto]"
      >
        <div className="min-w-0">
          <h3 className="font-serif text-lg leading-snug sm:text-xl">
            <span className={paper.status === "reading" ? "highlight" : "group-hover:text-pen"}>
              {paper.title}
            </span>
          </h3>

          {byline && <p className="mt-1 text-sm text-ink-soft">{byline}</p>}

          {(paper.tags.length > 0 || paper.summary) && (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              {paper.tags.map((tag) => (
                <span key={tag} className={`tag-chip ${tagColor(tag)}`}>#{tag}</span>
              ))}
              {paper.summary && (
                <span className="inline-flex items-center gap-1 text-ink-soft">
                  <Sparkles size={14} aria-hidden="true" />
                  Summary ready
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
          <StatusBadge status={paper.status} pill />
          <span className="text-xs text-ink-soft">Added {added}</span>
        </div>
      </Link>
    </li>
  );
}