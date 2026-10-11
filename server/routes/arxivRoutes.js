import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { fetchArxiv } from "../controllers/arxivController.js";

const router = express.Router();
router.get("/", protect, fetchArxiv);

export default router;