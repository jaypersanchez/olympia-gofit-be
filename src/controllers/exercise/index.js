import mongoose from "mongoose";
import { validationResult } from "express-validator";
import userModel from "../../models/userSchema.js";
import loginUser from "../../services/login.js";
import { resetToken } from "../../services/resetTokens.js";
import { searchExercise, getExercises } from "../../services/exerciseSearch.js";
import { createFullWorkoutPlan, createWeeklyWorkoutPlan } from "../../tools/workoutGenerator.js";
/**
 *  The user controller 
 * @namespace exerciseController
 */

export const exerciseController = {
  /**
   * @funtion createUser
   * @memberof paymentController
   * @param {Object} req The express request object
   * @param {Object} res The express response object
   * @param {Object} next The express next function
   */

  getExercises: async(req, res, next) => {
    console.log("Getting all exercises")
    try {
        const results = await getExercises();
        return res.json({
          success: true,
          data: results
        });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  },

 search: async (req, res, next) => {
    const  searchString  = req.body.query;
    console.log("The search string is", searchString)
    try {
      const results = await searchExercise(searchString);
      return res.json({
        success: true,
        data: results
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  },

  createPlan: async (req, res, next) => {
    const user = req.user;
    console.log("The user is", user)
    try {
      const workoutPlan = await createFullWorkoutPlan(user);
      // temporary find user and populate workouts
      const foundUser = await userModel.findById(user._id).populate({path: "workoutPlans", populate:{path: "weeks", populate: {path:"workouts.exercises.exercise"}} })
      return res.json({
        success: true,
        data: foundUser
      });
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }
}