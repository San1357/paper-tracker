import mongoose from "mongoose";
import Paper from "../models/Paper.js";
import { summarizePaper } from "../services/ai.js";

// Sirf ye fields user badal sakta hai (user ya summary nahi)
const ALLOWED = ["title", "authors", "abstract", "arxivId", "pdfUrl", "tags", "status", "notes"];
const pick = (body) =>
  Object.fromEntries(Object.entries(body).filter(([key]) => ALLOWED.includes(key)));

const STATUSES = ["to-read", "reading", "done"];

// User ke input mein . * ( ) + jaise special characters ho to regex na toote
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Paper dhundho, LEKIN sirf tab jab wo isi user ka ho
const findOwnPaper = (id, userId) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return Paper.findOne({ _id: id, user: userId });
};

const handleError = (res, err) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: err.message });
};

// GET /api/papers?search=attention&tag=ai&status=reading
export const getPapers = async (req, res) => {
  try {
    const { search, tag, status } = req.query;
    const filter = { user: req.user._id };

    if (status) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({ message: "Status galat hai" });
      }
      filter.status = status;
    }

    if (tag) filter.tags = tag.trim().toLowerCase();

    if (search?.trim()) {
      const rx = new RegExp(escapeRegex(search.trim()), "i");
      filter.$or = [
        { title: rx },
        { abstract: rx },
        { authors: rx },
        { notes: rx },
        { tags: rx },
      ];
    }

    const papers = await Paper.find(filter).sort({ createdAt: -1 });
    res.json(papers);
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/papers/tags → user ke saare unique tags
export const getTags = async (req, res) => {
  try {
    const tags = await Paper.distinct("tags", { user: req.user._id });
    res.json(tags.sort());
  } catch (err) {
    handleError(res, err);
  }
};

// POST /api/papers → naya paper
export const createPaper = async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ message: "Title zaroori hai" });
    }
    const paper = await Paper.create({ ...pick(req.body), user: req.user._id });
    res.status(201).json(paper);
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/papers/:id → ek paper
export const getPaper = async (req, res) => {
  try {
    const paper = await findOwnPaper(req.params.id, req.user._id);
    if (!paper) return res.status(404).json({ message: "Paper nahi mila" });
    res.json(paper);
  } catch (err) {
    handleError(res, err);
  }
};

// PUT /api/papers/:id → update
export const updatePaper = async (req, res) => {
  try {
    const paper = await findOwnPaper(req.params.id, req.user._id);
    if (!paper) return res.status(404).json({ message: "Paper nahi mila" });
    Object.assign(paper, pick(req.body));
    await paper.save();
    res.json(paper);
  } catch (err) {
    handleError(res, err);
  }
};

// DELETE /api/papers/:id
export const deletePaper = async (req, res) => {
  try {
    const paper = await findOwnPaper(req.params.id, req.user._id);
    if (!paper) return res.status(404).json({ message: "Paper nahi mila" });
    await paper.deleteOne();
    res.json({ message: "Paper delete ho gaya" });
  } catch (err) {
    handleError(res, err);
  }
};

// POST /api/papers/:id/summary         → summary banao (pehle se hai to wahi do)
// POST /api/papers/:id/summary?refresh=1 → nayi summary banao
export const generateSummary = async (req, res) => {
  try {
    const paper = await findOwnPaper(req.params.id, req.user._id);
    if (!paper) return res.status(404).json({ message: "Paper nahi mila" });

    if (!paper.abstract?.trim()) {
      return res.status(400).json({ message: "Summary ke liye abstract chahiye" });
    }

    // Pehle se summary hai aur refresh nahi maanga → AI call mat karo
    if (paper.summary && !req.query.refresh) {
      return res.json(paper);
    }

    paper.summary = await summarizePaper({ title: paper.title, abstract: paper.abstract });
    await paper.save();
    res.json(paper);
  } catch (err) {
    if (err.status === 429) {
      return res.status(429).json({ message: "AI ki limit khatam, 1 minute baad try karo" });
    }
    if (err.status === 503 || err.status === 500) {
  return res.status(503).json({ message: "AI abhi busy hai, 1-2 minute baad try karo" });
  }
    console.error("AI error:", err.message);
    res.status(500).json({ message: "Summary nahi ban payi: " + err.message });
  }
};