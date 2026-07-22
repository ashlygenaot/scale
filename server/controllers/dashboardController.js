import Session from "../models/Session.js";
import Climb from "../models/Climb.js";

function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;

  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);

  return d;
}

export const getDashboard = async (req, res) => {
  
  try {

    const userId = req.user.id;

    const isDemo =
    process.env.DEMO_USER_ID &&
    req.user.id === process.env.DEMO_USER_ID;

    const sessions = await Session.find({
      user: userId,
    }).sort({ date: -1 });

    const climbs = await Climb.find({
      user: userId,
    })
    .populate("session")
    .sort({ createdAt: -1 });

    let referenceDate = new Date();
    if (isDemo && process.env.DEMO_SESSION_ID) {
      const demoSession = sessions.find(
        session => session._id.toString() === process.env.DEMO_SESSION_ID
      );

      if (!demoSession) {
        throw new Error("Demo session not found");
      }

      referenceDate = new Date(demoSession.date);
    }

    const weekStart = getWeekStart(referenceDate);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const sessionsThisWeek = sessions.filter((session) => {
    const date = new Date(session.date);

    return date >= weekStart && date < weekEnd;
  });

    const climbsThisWeek = climbs.filter((climb) => {
    const date = new Date(climb.session.date);

      return date >= weekStart && date < weekEnd;
    });

    const sends = climbsThisWeek.filter(
      c =>
        c.status === "send" ||
        c.status === "flash"
    );

    const hardest = sends.reduce((best, climb) => {
      const grade = parseInt(
        climb.grade.replace("V", "")
      );

      return grade > best ? grade : best;
    }, -1);

    const hours = sessionsThisWeek.reduce(
      (sum, s) => sum + (s.duration || 0),
      0
    ) / 60;

  const weekLoad = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(weekStart);
  date.setDate(weekStart.getDate() + i);

  const daySessions = sessions.filter((s) => {
    const sessionDate = new Date(s.date);

    return (
      sessionDate.getFullYear() === date.getFullYear() &&
      sessionDate.getMonth() === date.getMonth() &&
      sessionDate.getDate() === date.getDate()
    );
  });

  const hrs = daySessions.reduce(
    (sum, s) => sum + (s.duration || 0),
    0
  ) / 60;

  return {
    d: date.toLocaleDateString("en-US", {
      weekday: "short",
    }),
    hrs: Number(hrs.toFixed(1)),
  };
});

    res.json({
      stats: {
        sessionsLastWeek: sessionsThisWeek.length,
        hours: hours.toFixed(1),
        sends: sends.length,
        hardestGrade:
          hardest >= 0 ? `V${hardest}` : "-"
      },

        weekStart,
        weekEnd,

       weekLoad,

      recent: climbs.slice(0, 5),

      projects: climbs
        .filter(c => c.status === "project")
        .slice(0, 4),
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};