import express from "express";
// import { userLogin, createUser, userInfo, deleteUser } from "../../controllers/users/index.js";
import { newUserValidation, tokenValidation, userLoginValidation } from "../../validation/index.js";
import verifyTokenMiddle from "../../middleware/verifyTokenMiddle.js";
import { exerciseController } from "../../controllers/exercise/index.js";
const exerciseRoute = express.Router();

exerciseRoute.post("/search", exerciseController.search)
exerciseRoute.put("/plan", verifyTokenMiddle, exerciseController.createPlan)





export { exerciseRoute };