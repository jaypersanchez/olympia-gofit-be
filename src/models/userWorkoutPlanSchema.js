import mongoose from "mongoose";
import userWorkoutWeek from "./userWorkoutWeek.js";
const UserWorkoutPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  weeks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserWorkoutWeek",
    },
  ],
  startDate: {
    type: Date,
    required: false,
  },
  endDate: {
    type: Date,
    required: false,
  },
  complete: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("UserWorkoutPlan", UserWorkoutPlanSchema);
