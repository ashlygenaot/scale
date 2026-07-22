import Climb from "../models/Climb.js";
import Session from "../models/Session.js";

/**
 * POST /sessions/:sessionId/climbs
 */
export const createClimb = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const {
      name,
      grade,
      type = "boulder",
      status = "attempt",
      tries = 1,
      notes = "",
      tags = [],
      location,
    } = req.body;


    const climb = await Climb.create({
      user: req.user.id,
      session: sessionId,
      name,
      grade,
      type,
      status,
      origin: status === "project" ? "project" : "normal",
      tries,
      notes,
      tags,
      location,
    });

    return res.status(201).json({
      success: true,
      climb,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/**
 * GET /sessions/:sessionId/climbs
 */
export const getClimbs = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const climbs = await Climb.find({
      user: req.user.id,
      session: sessionId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      climbs,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/**
 * GET /climbs/projects
 */
export const getProjects = async (req, res) => {
  try {
      const projects = await Climb.find({
      user: req.user.id,
      status: "project",
    })
    .sort({
      tries: -1,
      updatedAt: -1,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

/**
 * GET /climbs/completed
 */
export const getCompletedProjects = async (req, res) => {
  try {
    const projects = await Climb.find({
      user: req.user.id,
      status: { $in: ["send", "flash"] },
      origin: "project"
    }).sort({ updatedAt: -1 });

    res.json({ projects });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

/**
 * PUT /sessions/climbs/:id
 */
export const updateClimb = async (req, res) => {
  try {
    const updatedClimb = await Climb.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        grade: req.body.grade,
        type: req.body.type,
        tries: req.body.tries,
        status: req.body.status,
        origin: req.body.origin,
        tags: req.body.tags,
      },
      {
        new: true,
      }
    );

    res.json(updatedClimb);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};


export const deleteClimb = async (req, res) => {
  try {
    const climb = await Climb.findById(req.params.id);

    if (!climb) {
      return res.status(404).json({
        message: "Climb not found",
      });
    }

    if (climb.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await climb.deleteOne();

    res.json({
      message: "Climb deleted",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

/**
 * GET /sessions/climbs/:id
 */
export const getClimbById = async (req, res) => {
  try {
    const climb = await Climb.findById(req.params.id);

    if (!climb) {
      return res.status(404).json({
        message: "Climb not found",
      });
    }

    // Make sure the climb belongs to the logged-in user
    if (climb.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    res.json(climb);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

