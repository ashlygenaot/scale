import Climb from "../models/Climb.js";
import Session from "../models/Session.js";

function gradeToNumber(grade) {
  if (!grade) return null;

  // V Scale
  if (grade.startsWith("V")) {
    const match = grade.match(/^V(\d+)/i);

    if (match) {
      return Number(match[1]);
    }
  }

  return null;
}

function numberToGrade(num) {
  if (num == null) return "-";

  return `V${num}`;
}

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const climbs = await Climb.find({ user: userId }).sort({
      createdAt: 1,
    });

    const sessions = await Session.find({ user: userId }).sort({
      date: 1,
    });

    /* ------------------------
       BASIC STATS
    -------------------------*/

    const sends = climbs.filter(
      (c) => c.status === "send" || c.status === "flash"
    );

    const projects = climbs.filter(
      (c) => c.status === "project"
    );

    const completedProjects = climbs.filter(
      (c) => c.status === "send" && c.isProject
    );

    /* ------------------------
       MONTHLY VOLUME
    -------------------------*/

    const monthlyVolume = {};

    climbs.forEach((climb) => {
      const date = new Date(climb.createdAt);

      const key = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      monthlyVolume[key] =
        (monthlyVolume[key] || 0) + 1;
    });

/* ------------------------
   WEEKLY VOLUME
-------------------------*/

const weeklyVolume = {};

climbs.forEach((climb) => {
  const date = new Date(climb.createdAt);

  // get Monday of that week
  const monday = new Date(date);
  const day = monday.getDay();

  const diff = day === 0 ? -6 : 1 - day;

  monday.setDate(monday.getDate() + diff);

  const key = monday.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  weeklyVolume[key] =
    (weeklyVolume[key] || 0) + 1;
});

/* ------------------------
   SEND RATE HISTORY
-------------------------*/

const weeklySendData = {};

climbs.forEach((climb) => {
  const date = new Date(climb.createdAt);

  const monday = new Date(date);
  const day = monday.getDay();

  const diff = day === 0 ? -6 : 1 - day;

  monday.setDate(monday.getDate() + diff);

  const key = monday.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });


  if (!weeklySendData[key]) {
    weeklySendData[key] = {
      total: 0,
      sends: 0,
    };
  }


  weeklySendData[key].total++;


  if (
    climb.status === "send" ||
    climb.status === "flash"
  ) {
    weeklySendData[key].sends++;
  }

});


const sendRateHistory = Object.entries(
  weeklySendData
).map(([week, values]) => ({
  week,
  rate: Math.round(
    (values.sends / values.total) * 100
  ),
}));

    /* ------------------------
       TAGS
    -------------------------*/

    const tags = {};

    climbs.forEach((climb) => {
      (climb.tags || []).forEach((tag) => {
        tags[tag] = (tags[tag] || 0) + 1;
      });
    });

    const favoriteStyles = Object.entries(tags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        count,
      }));

    /* ------------------------
       GRADE DISTRIBUTION
    -------------------------*/

    const gradeDistribution = {};

    sends.forEach((climb) => {
      if (!climb.grade) return;

      gradeDistribution[climb.grade] =
        (gradeDistribution[climb.grade] || 0) + 1;
    });

    /* ------------------------
       GRADE PROGRESSION
    -------------------------*/
const gradeProgression = sends
  .map((climb) => ({
    date: new Date(climb.createdAt).toLocaleDateString(),
    grade: gradeToNumber(climb.grade),
  }))
  .filter((c) => c.grade !== null);

    /* ------------------------
       SEND RATE BY GRADE
    -------------------------*/

    const sendRateByGrade = {};

    climbs.forEach((climb) => {
      if (!climb.grade) return;

      if (!sendRateByGrade[climb.grade]) {
        sendRateByGrade[climb.grade] = {
          total: 0,
          sends: 0,
        };
      }

      sendRateByGrade[climb.grade].total++;

      if (
        climb.status === "send" ||
        climb.status === "flash"
      ) {
        sendRateByGrade[climb.grade].sends++;
      }
    });

    /* ------------------------
       WEEKLY HEATMAP
    -------------------------*/

    const weeklyHeatmap = {};

    sessions.forEach((session) => {
      const day = new Date(session.date).toLocaleDateString("en-US", {
        weekday: "short",
      });

      weeklyHeatmap[day] =
        (weeklyHeatmap[day] || 0) + 1;
    });

    /* ------------------------
       STREAK
    -------------------------*/

    let currentStreak = 0;
    let longestStreak = 0;

    if (sessions.length) {
      const uniqueDays = [
        ...new Set(
          sessions.map((s) =>
            new Date(s.date).toDateString()
          )
        ),
      ];

      let streak = 1;

      for (let i = 1; i < uniqueDays.length; i++) {
        const prev = new Date(uniqueDays[i - 1]);
        const curr = new Date(uniqueDays[i]);

        const diff =
          (curr - prev) / (1000 * 60 * 60 * 24);

        if (diff === 1) {
          streak++;
        } else {
          streak = 1;
        }

        longestStreak = Math.max(
          longestStreak,
          streak
        );
      }

      currentStreak = streak;
    }

    /* ------------------------
       HIGHEST GRADE
    -------------------------*/

 const highestGradeNumber = Math.max(
  ...sends
    .map(c => gradeToNumber(c.grade))
    .filter(v => v !== null),
  -1
);

const highestGrade =
  highestGradeNumber >= 0
    ? numberToGrade(highestGradeNumber)
    : "-";

    /* ------------------------
       AVERAGE ATTEMPTS
    -------------------------*/

    const averageAttempts =
      sends.length > 0
        ? (
            sends.reduce(
              (sum, c) => sum + (c.tries || 0),
              0
            ) / sends.length
          ).toFixed(1)
        : 0;

    /* ------------------------
       RESPONSE
    -------------------------*/

    res.json({
      success: true,

      stats: {
        sessions: sessions.length,

        totalClimbs: climbs.length,

        sends: sends.length,

        sendRate: climbs.length
          ? Math.round(
              (sends.length / climbs.length) * 100
            )
          : 0,

        projects: projects.length,

        projectSuccess: projects.length
          ? Math.round(
              (completedProjects.length /
                projects.length) *
                100
            )
          : 0,

        highestGrade,

        averageAttempts,

        currentStreak,

        longestStreak,
      },

      monthlyVolume: Object.entries(monthlyVolume)
        .map(([month, count]) => ({
          month,
          count,
        }))
        .reverse(),

      favoriteStyles,

      gradeDistribution: Object.entries(
        gradeDistribution
      ).map(([grade, count]) => ({
        grade,
        count,
      })),

      gradeProgression,

      sendRateByGrade: Object.entries(
        sendRateByGrade
      ).map(([grade, values]) => ({
        grade,
        rate: Math.round(
          (values.sends / values.total) * 100
        ),
      })),

      weeklyHeatmap: Object.entries(
  weeklyHeatmap
)
.map(([day, count]) => ({
  day,
  count,
})),

weeklyVolume: Object.entries(
  weeklyVolume
)
.map(([week, count]) => ({
  week,
  count,
}))
.reverse(),

sendRateHistory,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};