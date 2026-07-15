import Session from "../models/Session.js";
import Climb from "../models/Climb.js";

/*
 * POST /api/sessions
 */
export const createSession = async (req, res) => {
  try {
    const { date, location, duration, notes } = req.body;

    const session = await Session.create({
      user: req.user.id,
      date: req.body.date,
      location: req.body.location,
      duration: req.body.duration,
      notes: req.body.notes
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
 * GET /api/sessions
 */
export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      user: req.user.id,
    }).sort({ date: -1 });

    const sessionsWithStats = await Promise.all(
      sessions.map(async (session) => {
        const climbs = await Climb.find({
          session: session._id,
        });

        const sends = climbs.filter(
          (climb) => climb.result === "send"
        );

        const grades = climbs
          .map((climb) => climb.grade)
          .filter(Boolean);

        return {
          ...session.toObject(),
          climbCount: climbs.length,
          sendCount: sends.length,
          highestGrade:
            grades.length > 0
              ? grades.sort().at(-1)
              : null,
        };
      })
    );

    res.json(sessionsWithStats);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
 * GET /api/sessions/:id
 */
export const getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

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

    res.json({
      success:true,
      session
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
 * DELETE /api/sessions/:id
 */
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    // Make sure user owns the session
    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    // Delete all climbs inside this session
    await Climb.deleteMany({
      session: session._id,
    });

    // Delete session
    await session.deleteOne();

    res.json({
      message: "Session and climbs deleted",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    // Make sure the session belongs to the user
    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      {
        date: req.body.date,
        location: req.body.location,
        duration: req.body.duration,
        notes: req.body.notes,
      },
      {
        new: true,
      }
    );

    res.json({
      success: true,
      session: updatedSession,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};