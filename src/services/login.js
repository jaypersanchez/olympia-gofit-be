import userModel from "../models/userSchema.js";
import {jwtAuth} from "../tools/index.js";

/**
 * A function that logs in a user
 * @param {*} req The express request object
 * @param {*} res The express response object
 * @param {*} next The express next function
 * @returns {object} The response object containing the user and the token in the header
 */
async function loginUser(req, res, next) {
  try {
    const user = await userModel.checkCredentials(req.body.email, req.body.password)
    console.log("LOGIN:", user)
        if (await user) {
            const token = await jwtAuth(user, "30m")
            const refreshToken = await jwtAuth(user, "1d") 
            console.log("THE RFRSH: ", refreshToken)
            res.status(200).send({loggedIn: true, user:user, 
              accessToken: token,
              refreshToken: refreshToken})

        } else {
            res.status(401).send({loggedIn: false, message: "Wrong credentials"})
        }
  } catch (error) {
    res.status(500).send(error)

  }
}

export default loginUser