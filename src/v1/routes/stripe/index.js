const express = require("express");
const { stripe } = require("../../controllers");
const { stripeValidation } = require("../../middlewares");

const router = express.Router();

/**
 * Stripe API Routes
 */

/**
 * Route: POST /stripe/checkout/sessions
 * Description: Create a new payment checkout session for a product and direct the customer to the Stripe checkout page.
 * This endpoint prepares the payment checkout session using Stripe API and returns the checkout URL for the customer.
 */
router.post(
  "/checkout/sessions",
  stripeValidation.validateCreateOnePaymentCheckout,
  stripe.createOnePaymentCheckout
);

/**
 * Route: POST /stripe/token
 * Description: Creates a single-use token that represents a credit card’s details.
 * This token can be used in place of a credit card object with any API method.
 */
router.post(
  "/token",
  stripeValidation.validateCreateToken,
  stripe.createToken
);

/**
 * Route: POST /stripe/subscriptions
 * Description: Create a new subscription for a customer to a specific product plan in Stripe.
 * This endpoint checks if the customer already exists in Stripe, creates a new customer if not,
 * and then subscribes the customer to the specified product plan.
 */
router.post(
  "/subscription",
  stripeValidation.validateCreateSubscription,
  stripe.createSubscription
);

/**
 * Route: PUT /stripe/subscriptions/:customer_id
 * Description: Update the subscription of a customer to a different product plan in Stripe.
 * This endpoint changes the customer's subscription from one product plan to another.
 */
router.put(
  "/subscription/:customer_id",
  stripeValidation.validateUpdateSubscription,
  stripe.updateSubscription
);

/**
 * Route: DELETE /stripe/subscriptions/:customer_id
 * Description: Delete the subscription of a customer in Stripe.
 * This endpoint cancels the subscription for the specified customer.
 */
router.delete(
  "/subscription/:customer_id",
  stripeValidation.validateDeleteSubscription,
  stripe.deleteSubscription
);

module.exports = router;
