const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");
const { isAuthenticatedUser } = require("../middleware/auth");

router.post("/process", isAuthenticatedUser, paymentController.processPayment);

router.get(
  "/stripeApiKey",
  isAuthenticatedUser,
  paymentController.sendStripeApiKey
);

module.exports = router;
