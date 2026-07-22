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

    name: {
      type: String,
      required: true,
      trim: true,
    },

    grade: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["boulder", "sport", "trad", "gym"],
      default: "boulder",
    },

    location: {
      type: String,
      trim: true,
    },

     date: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["send", "flash", "attempt", "project"],
      default: "attempt",
    },

    origin: {
      type: String,
      enum: ["normal", "project"],
      default: "normal",
    },

    tries: {
      type: Number,
      default: 1,
      min: 0,
    },

    notes: {
      type: String,
      trim: true,
    },
    
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Climb = mongoose.model("Climb", climbSchema);

export default Climb;