import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function PaperCard({ paper }) {
  const authors =
    paper.authors?.length > 3
      ? `${paper.authors.slice(0, 3).join(", ")} et al.`
      : paper.authors?.join(", ");

  return (
    <Link
      to={`/papers/${paper._id}`}
      className="block bg-white border rounded-lg p-4 hover:shadow-md transition"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-medium">{paper.title}</h2>
        <StatusBadge status={paper.status} />
      </div>

      {authors && <p className="text-sm text-gray-600 mt-1">{authors}</p>}

      {paper.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {paper.tags.map((tag) => (
            <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}