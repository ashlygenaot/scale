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

   console.log("USER FROM TOKEN:", req.user);

    const userId = req.user.id;

    console.log("USER ID:", userId);

    const sessions = await Session.find({
      user: userId,
    }).sort({ date: -1 });

    const climbs = await Climb.find({
      user: userId,
    }).sort({ createdAt: -1 });

    const weekStart = getWeekStart();

    const sessionsThisWeek = sessions.filter(
      s => new Date(s.date) >= weekStart
    );

    const climbsThisWeek = climbs.filter(
      c => new Date(c.createdAt) >= weekStart
    );

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
  const date = new Date();
  date.setDate(date.getDate() - (6 - i));

  const daySessions = sessions.filter(
    s => new Date(s.date).toDateString() === date.toDateString()
  );

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