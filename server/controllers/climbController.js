import Climb from "../models/Climb.js"; 
import Session from "../models/Session.js";

export const createClimb = async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { routeName, grade, gradeSystem, attempts, result, tags,} = req.body;

    const climb = await Climb.create({
      user: req.user.id,
      session: session._id,
      routeName,
      grade,
      gradeSystem,
      attempts,
      result,
      tags
    });

    res.status(201).json(climb);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getClimbs = async (req, res) => {
  try {
    const climbs = await Climb.find({
      user: req.user.id,
      session: req.params.sessionId
    }).sort({ createdAt: -1 });

    res.json(climbs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};