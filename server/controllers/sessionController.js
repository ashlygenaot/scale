import Session from "../models/Session.js"; 

export const createSession = async (req, res) => {
  try {
    const { date, location, duration, notes } = req.body;

    const session = await Session.create({
      user: req.user.id,
      date,
      location,
      duration,
      notes,
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      user: req.user.id,
    }).sort({ date: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};