import Climb from "../models/Climb.js";
import Session from "../models/Session.js";

export const getSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const [totalSessions, climbs] = await Promise.all([
      Session.countDocuments({ user: userId }),
      Climb.find({ user: userId }),
    ]);

    if (climbs.length === 0) {
      return res.json({
        totalSessions,
        totalClimbs: 0,
        maxGrade: 0,
        successRate: 0,
      });
    }

    let maxGrade = 0;
    let successful = 0;

    for (const c of climbs) {
      if (c.grade > maxGrade) maxGrade = c.grade;
      if (c.result === "sent" || c.result === "flash") {
        successful++;
      }
    }

    const successRate = successful / climbs.length;

    res.json({
      totalSessions,
      totalClimbs: climbs.length,
      maxGrade,
      successRate: Number(successRate.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProgression = async (req, res) => {
  try {
    const userId = req.user.id;

    const climbs = await Climb.find({ user: userId }).sort({
      createdAt: 1,
    });

    if (climbs.length === 0) {
      return res.json([]);
    }

    const map = {};

    for (const climb of climbs) {
      const date = climb.createdAt.toISOString().split("T")[0];

      if (!map[date]) {
        map[date] = {
          date,
          maxGrade: climb.grade,
          totalClimbs: 1,
        };
      } else {
        map[date].totalClimbs += 1;
        map[date].maxGrade = Math.max(map[date].maxGrade, climb.grade);
      }
    }

    res.json(Object.values(map));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};