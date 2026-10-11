const STYLES = {
  "to-read": "bg-gray-100 text-gray-700",
  reading: "bg-yellow-100 text-yellow-800",
  done: "bg-green-100 text-green-800",
};

const LABELS = { "to-read": "To read", reading: "Reading", done: "Done" };

export default function StatusBadge({ status }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${STYLES[status] || STYLES["to-read"]}`}>
      {LABELS[status] || status}
    </span>
  );
}