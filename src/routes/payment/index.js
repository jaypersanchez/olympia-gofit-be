import express from "express";
// import { userLogin, createUser, userInfo, deleteUser } from "../../controllers/users/index.js";
import { paymentController} from "../../controllers/payment/index.js";
import verifyTokenMiddle from "../../middleware/verifyTokenMiddle.js";
const paymentRoute = express.Router();

// paymentRoute.post("/new", verifyTokenMiddle, paymentController.newSubscription)
paymentRoute.post("/subscribe", verifyTokenMiddle, paymentController.createSubscription)
paymentRoute.post("/new",verifyTokenMiddle, paymentController.paymentIntent)
paymentRoute.get("/ptoken", paymentController.publishableToken)

export { paymentRoute };