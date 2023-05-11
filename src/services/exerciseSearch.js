import mongoose from "mongoose";
import exerciseModel from "../models/exerciseSchema.js";
const searchExercise = async (searchString) => {
  console.log("search initiated");
  // const results = await Exercise.find({
  //     $or: [
  //       { name: { $regex: new RegExp(searchString), $options: 'i' } },
  //       { muscleGroup: { $regex: new RegExp(searchString), $options: 'i' } }
  //     ]
  //   });
  const results = await exerciseModel.find({
    name: { $regex: searchString, $options: "i" },
  });
  console.log("search finished", results);

  return results;
};

export { searchExercise };
