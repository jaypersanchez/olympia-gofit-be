import mongoose from "mongoose";
import createUserService from "../../services/createUserService.js";
import { validationResult } from "express-validator";
import UserModel from "../../models/userSchema.js";
import loginUser from "../../services/login.js";
import { resetToken } from "../../services/resetTokens.js";
import Stripe from "stripe";
const stripeKey = process.env.STRIPE_KEY;
const stripe = new Stripe(stripeKey);
/**
 *  The user controller 
 * @namespace paymentController
 */

export const paymentController = {
  /**
   * @funtion createUser
   * @memberof paymentController
   * @param {Object} req The express request object
   * @param {Object} res The express response object
   * @param {Object} next The express next function
   */

 paymentIntent: async (req, res, next) => {

  try {
    
    const { paymentType } = req.body;

    let paymentObject

    switch (paymentType) {
      case "monthly": 
       paymentObject = {
      amount: 1999,
      currency: "usd",
      automatic_payment_methods: { enabled: true }
    }
        
        break;
        case "yearly":
        paymentObject = {
      amount: 9999,
      currency: "usd",
      automatic_payment_methods: { enabled: true }
    }
        break;
    
      default:
         paymentObject = {
      amount: 1999,
      currency: "usd",
      automatic_payment_methods: { enabled: true }
    }
        break;
    }
    // Create a PaymentIntent with the order amount and currency
    //   amount: calculateOrderAmount(items),
    const paymentIntent = await stripe.paymentIntents.create(paymentObject);
    console.log("Payment intent initialized")

    res.send({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.warn("ERROR: ", error )
    res.status(500).send({errors: error})
  }
},
  /**
   * @funtion createUser
   * @memberof paymentController
   * @param {Object} req The express request object
   * @param {Object} res The express response object
   * @param {Object} next The express next function
   */


  // NOT Working
 publishableToken: async (req, res, next) => {
  try {
    let key = process.env.STRIPE_PUBLISHABLE_KEY
    console.log("Publishable key")
    res.send({
      publishableKey: key,
    });
  } catch (error) {
    console.warn("Problem with publishable key")
    console.warn("ERROR: ", error )
    res.status(500).send({errors: error})
  }
},

createSubscription: async (req, res, next) => {
  console.log("creating a Subscription")
  try {
    const { name, email, paymentMethod, paymentSchedule } = req.body;
    console.log("In subscription user", req.user)
    // Create a customer
    const customer = await stripe.customers.create({
      email,
      name,
      payment_method: paymentMethod,
      invoice_settings: { default_payment_method: paymentMethod },
    });
    console.log("customer was created", customer.id)
   let foundUser =  await UserModel.findOne({email:req.user.email});
   let updatedUser =  await UserModel.findOneAndUpdate({email:req.user.email}, {customerId: customer.id, paymentSchedule: paymentSchedule}, {new: true});
    console.log("the found user is", foundUser)
    console.log("the updated user is", updatedUser)
    // Save the customer id to the user
    // let user = await UserModel.findOneAndUpdate({_id:req.user._id}, {customerId: customer.id});
    console.log("customer was created", customer.id)
    // Create a product
    const product = await stripe.products.create({
      name: "Fitspace Subscription",
    });
    // Create a subscription
    const subscriptionTime = paymentSchedule === "monthly" ? "month" : "year";
    const subscriptionCost = paymentSchedule === "monthly" ? 1999 : 9999;
    const trialPeriod = paymentSchedule === "trial" ? 7 : 0;
    const trialPlan = paymentSchedule === "trial" ? true : false;
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price_data: {
            currency: "usd",
            product: product.id,
            unit_amount: subscriptionCost,
            recurring: {
              interval: subscriptionTime,
            },
          },
        },
      ],
      trial_period_days: trialPeriod, trial_from_plan: trialPlan,
      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });
    // Send back the client secret for payment
    res.json({
      message: "Subscription successfully initiated",
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
}

// export {deleteUser,userLogin, createUser, userInfo};