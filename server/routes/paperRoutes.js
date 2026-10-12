import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getPapers, createPaper, getPaper, updatePaper, deletePaper, getTags, generateSummary
} from "../controllers/paperController.js";

const router = express.Router();
router.use(protect);

router.get("/tags", getTags); // ⚠️ /:id se PEHLE hona zaroori hai
router.route("/").get(getPapers).post(createPaper);
router.route("/:id").get(getPaper).put(updatePaper).delete(deletePaper);
router.post("/:id/summary", generateSummary);

export default router;