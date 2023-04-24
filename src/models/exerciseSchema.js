import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["pull", "push", "legs", "core", "kids"],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  muscleGroup: [{
    type: String,
    required: true
  }],
  level: {
    type: String,
    required: true
  },
  mets: {
    type: Number,
    required: true
  },
  equipment: {
    type: String,
    required: false
  },
  startingWeight: [{
    kg: {
      type: Number,
      required: true
    },
    lbs: {
      type: Number,
      required: true
    }
  }],
});



export default mongoose.model("Exercise", exerciseSchema);