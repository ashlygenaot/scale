import mongoose from "mongoose";

const climbSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    routeName: {
      type: String,
      required: true,
      trim: true,
    },

    grade: {
      type: Number,
      required: true,
    },

    gradeSystem: {
      type: String,
      enum: ["V", "YDS"],
      default: "V",
    },

    attempts: {
      type: Number,
      default: 1,
      min: 1
    },

    result: {
      type: String,
      enum: ["sent", "flash", "project"],
      required: true,
    },

    tags: [String],
  },
  { timestamps: true }
);


export default mongoose.model("Climb", climbSchema);