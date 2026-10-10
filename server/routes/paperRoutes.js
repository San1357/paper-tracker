import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getPapers, createPaper, getPaper, updatePaper, deletePaper,
} from "../controllers/paperController.js";

const router = express.Router();

router.use(protect); // is file ke SAARE routes ke liye login zaroori

router.route("/").get(getPapers).post(createPaper);
router.route("/:id").get(getPaper).put(updatePaper).delete(deletePaper);

export default router;