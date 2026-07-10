import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
  "/",
  protect,
  (req, res, next) => {
    console.log("USER FROM TOKEN:", req.user);
    next();
  },
  getDashboard
);

export default router;