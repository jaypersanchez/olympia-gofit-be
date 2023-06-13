import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }],
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  age: { type: Date },
  gender: { type: String, enum: ["male", "female"] },
  height: { type: String },
  weight: { type: String },
  steps: { type: Number },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
  workoutRegularity: { type: String, enum: ["currently", "months", "years"] },
  gymGoal: { type: String, default: "other" },
  gymType: {
    type: String,
    enum: ["home", "commercial", "small", "crossfit"],
    default: "home",
  },
  frequency: { type: Number },
  caloriesBurned: [{ type: Number }],
  customerId: { type: String, default: null },
  paymentSchedule: {
    type: String,
    enum: ["month", "year", "trial"],
    default: "month",
  },
  paymentActive: { type: Boolean, default: false },
  workoutPlans: [
    { type: mongoose.Schema.Types.ObjectId, ref: "UserWorkoutPlan" },
  ],
});

// To be used for used for the user lists / ranking
//needs to use a trad function because it uses "this" to reference the model
userSchema.static("findUsers", async function (query) {
  const total = await this.countDocuments(query);
  const users = await this.find(query.criteria)
    .limit(query.options.limit)
    .skip(query.options.skip)
    .sort(query.options.sort);
  return { total, users };
});

userSchema.pre("save", async function () {
  const newUser = this;
  const plainPW = newUser.password;
  if (newUser.isModified("password")) {
    const hash = await bcrypt.hash(plainPW, 10);
    newUser.password = hash;
  }
  return newUser;
});

userSchema.statics.checkCredentials = async function (email, plainPW) {
  console.log("EMAIL:", email);
  console.log("pw:", plainPW);
  //finds user by email
  //if user => compare PWs
  const user = await this.findOne({ email: email }).populate({
    path: "workoutPlans",
    populate: {
      path: "weeks",
      populate: { path: "workouts.exercises.exercise" },
    },
  });
  // const foundUser = await userModel.findById(user._id)

  if (user) {
    const passwordMatch = await bcrypt.compare(plainPW, user.password);
    if (passwordMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return undefined;
  }
};

userSchema.methods.toJSON = function () {
  const CurrentDoc = this;
  const userObject = CurrentDoc.toObject();
  delete userObject.password;
  //Doesn't affect the database just removes the mongoose version key from the response
  delete userObject.__v;
  return userObject;
};

export default mongoose.model("User", userSchema, "users");
