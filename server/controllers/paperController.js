import mongoose from "mongoose";
import Paper from "../models/Paper.js";

// Sirf ye fields user badal sakta hai (user ya summary nahi)
const ALLOWED = ["title", "authors", "abstract", "arxivId", "pdfUrl", "tags", "status", "notes"];
const pick = (body) =>
  Object.fromEntries(Object.entries(body).filter(([key]) => ALLOWED.includes(key)));

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

// GET /api/papers → apne saare papers (naye pehle)
export const getPapers = async (req, res) => {
  try {
    const papers = await Paper.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(papers);
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

// PUT /api/papers/:id → update (notes, tags, status, etc.)
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