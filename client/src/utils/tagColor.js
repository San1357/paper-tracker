// Har tag ka hamesha ek hi rang: tag ke naam se number banake palette mein se rang chuno
const PALETTE = [
  "bg-indigo-50 text-indigo-700",
  "bg-violet-50 text-violet-700",
  "bg-emerald-50 text-emerald-700",
  "bg-sky-50 text-sky-700",
  "bg-rose-50 text-rose-700",
  "bg-amber-50 text-amber-800",
  "bg-teal-50 text-teal-700",
];

export const tagColor = (tag) => {
  let hash = 0;
  for (const ch of tag) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[hash % PALETTE.length];
};