import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: false });

// "https://arxiv.org/abs/1706.03762" ya "arXiv:1706.03762" → "1706.03762"
const extractId = (input) => {
  const text = input.trim();
  const match = text.match(/arxiv\.org\/(?:abs|pdf)\/(.+?)(?:\.pdf)?\/?$/i);
  return (match ? match[1] : text).replace(/^arxiv:/i, "");
};

// XML mein ek cheez ho to object aata hai, kai ho to array. Hamesha array bana do.
const toArray = (x) => (Array.isArray(x) ? x : x ? [x] : []);

// Extra spaces aur newlines hatao
const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

// GET /api/arxiv?id=1706.03762
export const fetchArxiv = async (req, res) => {
  if (!req.query.id) {
    return res.status(400).json({ message: "arXiv ID ya link do" });
  }

  const id = extractId(req.query.id);
  if (!/^[\w.\-\/]+$/.test(id)) {
    return res.status(400).json({ message: "arXiv ID ka format galat hai" });
  }

  try {
    const response = await fetch(`https://export.arxiv.org/api/query?id_list=${id}`);
    if (!response.ok) {
      return res.status(502).json({ message: "arXiv se data nahi aaya, thodi der baad try karo" });
    }

    const data = parser.parse(await response.text());
    const entry = toArray(data?.feed?.entry)[0];

    if (!entry || !entry.title || clean(entry.title) === "Error") {
      return res.status(404).json({ message: "Ye arXiv ID nahi mili" });
    }

    const pdfLink = toArray(entry.link).find((l) => l["@_title"] === "pdf");

    res.json({
      arxivId: id,
      title: clean(entry.title),
      authors: toArray(entry.author).map((a) => clean(a.name)),
      abstract: clean(entry.summary),
      pdfUrl: pdfLink?.["@_href"] || `https://arxiv.org/pdf/${id}`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};