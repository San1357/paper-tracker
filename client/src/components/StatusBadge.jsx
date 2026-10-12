import { Circle, Highlighter, CircleCheck } from "lucide-react";

const STATUS = {
  "to-read": { label: "To read", Icon: Circle, className: "text-ink-soft" },
  reading: { label: "Reading", Icon: Highlighter, className: "text-amber-700" },
  done: { label: "Done", Icon: CircleCheck, className: "text-pen" },
};

export default function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS["to-read"];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium ${s.className}`}>
      <s.Icon size={15} aria-hidden="true" />
      {s.label}
    </span>
  );
}