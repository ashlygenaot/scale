import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getSummary, getProgression } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/summary", protect, getSummary);
router.get("/progression", protect, getProgression);

export default router;