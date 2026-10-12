import { Circle, Highlighter, CircleCheck } from "lucide-react";

const STATUS = {
  "to-read": { label: "To read", Icon: Circle, text: "text-ink-soft", pill: "bg-slate-100 text-slate-700" },
  reading: { label: "Reading", Icon: Highlighter, text: "text-amber-700", pill: "bg-amber-100 text-amber-800" },
  done: { label: "Done", Icon: CircleCheck, text: "text-pen", pill: "bg-pen-50 text-pen" },
};

// pill = rangeen background wala version (list mein); bina pill = sirf icon + text (buttons ke andar)
export default function StatusBadge({ status, pill = false }) {
  const s = STATUS[status] || STATUS["to-read"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium ${
        pill ? `rounded-full px-2.5 py-0.5 ${s.pill}` : s.text
      }`}
    >
      <s.Icon size={15} aria-hidden="true" />
      {s.label}
    </span>
  );
}