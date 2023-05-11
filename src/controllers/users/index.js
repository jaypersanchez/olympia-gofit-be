import mongoose from "mongoose";
import createUserService from "../../services/createUserService.js";
import { validationResult } from "express-validator";
import User from "../../models/userSchema.js";
import loginUser from "../../services/login.js";
import { resetToken } from "../../services/resetTokens.js";

/**
 *  The user controller
 * @namespace userController
 */
export const userController = {
  /**
   * @funtion createUser
   * @memberof userController
   * @param {Object} req The express request object
   * @param {Object} res The express response object
   * @param {Object} next The express next function
   */

  createUser: async (req, res, next) => {
    const errorsList = validationResult(req);
    try {
      if (errorsList.isEmpty()) {
        console.log(1);
        await createUserService(req, res);
      } else {
        res.status(500).send({ errors: errorsList });
      }
    } catch (error) {
      res.status(500).send({ errors: error });
    }
  },
  /**
   * The login user controller returns an access token and a refresh token
   * @funtion userLogin
   * @memberof userController
   * @param {Object} req The express request object
   * @param {Object} res The express response object
   * @param {Object} next The express next function
   * @returns {Object} The user information and token in the header
   */
  userLogin: async (req, res, next) => {
    try {
      const errorsList = validationResult(req);
      if (errorsList.isEmpty()) {
        await loginUser(req, res, next);
      } else {
        let error = new Error();
        error.httpStatusCode = 500;
        error.message = errorsList;
        throw error;
      }
    } catch (error) {
      res.status(500).send(error);
      return undefined;
    }
  },
  /**
   * The user info controller returns the user info
   * @funtion userInfo
   * @memberof userController
   * @param {Object} req The express request object
   * @param {Object} res The express response object
   * @param {Object} next The express next function
   * @returns {Object} The user info
   */
  userInfo: (req, res, next) => {
    res.status(200).send({ user: req.user });
    return undefined;
  },
  /**
   * The delete user controller returns the user info
   * @funtion deleteUser
   * @memberof userController
   * @param {Object} req The express request object
   * @param {Object} res The express response object
   * @param {Object} next The express next function
   * @returns {Object} response object with confirmation message
   */
  deleteUser: async (req, res, next) => {
    try {
      let id = req.params.userid;
      let deleteResponse = await User.findByIdAndDelete(id);
      console.log("THE DELETE RESPONSE", deleteResponse);
      if (deleteResponse !== null) {
        res.status(200).send({ message: "User deleted" });
        return undefined;
      } else {
        res.status(404).send({ message: "User not found" });
        return undefined;
      }
    } catch (error) {
      return res.status(500).send({ message: "Something went wrong" });
    }
  },
  /**
   * The reset refresh token controller returns the user info and a new refresh token and access token
   * @funtion resetRefreshToken
   * @memberof userController
   * @param {Object} req The express request object
   * @param {Object} res The express response object
   * @param {Object} next The express next function
   * @returns {Object} response object new refresh token and access token
   */
  resetRefreshToken: async (req, res, next) => {
    const errorsList = validationResult(req);
    try {
      if (errorsList.isEmpty()) {
        await resetToken(req, res, next);
      } else {
        throw new Error(errorsList);
      }
      return undefined;
    } catch (error) {
      return res
        .status(500)
        .send({ status: "failure", message: "Something went wrong" });
    }
  },
  updateUser: async (req, res, next) => {
    console.log(req.user);
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ msg: "User not found" });

      const updates = Object.keys(req.body);
      updates.forEach((update) => (user[update] = req.body[update]));
      await user.save();
      let updatedUser = await User.findById(req.user._id);
      res.status(201).json(updatedUser);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
};
