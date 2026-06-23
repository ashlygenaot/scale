import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createClimb,
  getClimbs,
} from "../controllers/climbController.js";

const router = express.Router();

router.post("/:sessionId/climbs", protect, createClimb);
router.get("/:sessionId/climbs", protect, getClimbs);

export default router;