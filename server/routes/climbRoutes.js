import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createClimb,
  getProjects,
  getCompletedProjects,
  getClimbs,
  getClimbById,
  updateClimb,
  deleteClimb,
} from "../controllers/climbController.js";

const router = express.Router();


// Individual climbs
router.get("/projects", protect, getProjects);
router.get("/completed", protect, getCompletedProjects);

router.get("/climb/:id", protect, getClimbById);
router.put("/climb/:id", protect, updateClimb);
router.delete("/climb/:id", protect, deleteClimb);

// Session climbs
router.get("/:sessionId/climbs", protect, getClimbs);
router.get("/:id", protect, getClimbById);
router.post("/:sessionId/climbs", protect, createClimb);




export default router;