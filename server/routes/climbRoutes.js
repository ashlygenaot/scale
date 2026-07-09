import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createClimb,
  getProjects,
  getClimbs,
  getClimbById,
  updateClimb,
  deleteClimb,
  getProjects,
} from "../controllers/climbController.js";

const router = express.Router();


// Individual climbs
router.get("/projects", protect, getProjects);

router.get("/climb/:id", protect, getClimbById);
router.put("/climb/:id", protect, updateClimb);
router.delete("/climb/:id", protect, deleteClimb);

// Session climbs
router.get("/:sessionId/climbs", protect, getClimbs);
router.post("/:sessionId/climbs", protect, createClimb);




export default router;