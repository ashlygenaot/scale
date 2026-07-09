import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createSession,
  getSessions,
  getSession,
  deleteSession,
} from "../controllers/sessionController.js";

const router = express.Router();


router.route("/")
  .post(protect, createSession)
  .get(protect, getSessions);

router.route("/:id")
  .get(protect, getSession)
  .delete(protect, deleteSession);

export default router;