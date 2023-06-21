import express from "express";
// import { userLogin, createUser, userInfo, deleteUser } from "../../controllers/users/index.js";
import { userController } from "../../controllers/users/index.js";
import {
  newUserValidation,
  tokenValidation,
  userLoginValidation,
} from "../../validation/index.js";
import verifyTokenMiddle from "../../middleware/verifyTokenMiddle.js";
const userRoute = express.Router();

userRoute.post("/new", newUserValidation, userController.createUser);
userRoute.post("/login", userLoginValidation, userController.userLogin);
userRoute.get("/self", verifyTokenMiddle, userController.userInfo);
userRoute.put(
  "/refreshToken",
  verifyTokenMiddle,
  tokenValidation,
  userController.resetRefreshToken
);
// userRoute.put("/update",verifyTokenMiddle, userController.updateUser)
userRoute.put("/update", userController.updateUser);
userRoute.delete("/:userid", verifyTokenMiddle, userController.deleteUser);

export { userRoute };
