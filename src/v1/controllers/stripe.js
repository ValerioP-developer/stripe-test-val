const stripeService = require("../services/stripe");

/**
 * Handle the '/stripe/checkout/sessions' endpoint.
 * Creates a payment checkout session using Stripe API and returns the checkout URL.
 *
 * @param {Object} req - The Express request object containing the request parameters.
 * @param {Object} res - The Express response object to send the response.
 * @returns {Object} JSON response with the checkout URL on success or error message on failure.
 */
const createOnePaymentCheckout = async (req, res) => {
  try {
    const { name, amount } = req.body;

    const checkoutSession = await stripeService.createPaymentCheckout({
      name,
      amount,
    });

    // Return the checkout URL to the client
    res.status(200).json({
      stripeSession: checkoutSession.id,
      checkoutUrl: checkoutSession.url, // Stripe checkout URL to redirect user to for payment
    });
  } catch (err) {
    // Handle errors and send an error response
    res.status(500).json({
      statusCode: err.statusCode || 500,
      error: err.message,
    });
  }
};

/**
 * Handle the '/stripe/token' endpoint.
 * Creates a single-use token that represents a credit card’s details.
 *
 * @param {Object} req - The Express request object containing the request parameters.
 * @param {Object} res - The Express response object to send the response.
 * @returns {Object} JSON response with the checkout URL on success or error message on failure.
 */
const createToken = async (req, res) => {
  try {
    const { number, exp_month, exp_year, cvc } = req.body;

    const token = await stripeService.createToken({
      number,
      exp_month,
      exp_year,
      cvc,
    });

    res.status(200).json({ status: 200, token });
  } catch (err) {
    // Handle errors and send an error response
    res.status(500).json({
      statusCode: err.statusCode || 500,
      error: err.message,
    });
  }
};

/**
 * Handle the '/stripe/subscriptions' endpoint.
 * Creates a subscription for a customer in Stripe and returns the subscription details.
 */
const createSubscription = async (req, res) => {
  try {
    // Extract the email, token, and planId from the request body
    const { email, token, plan_id } = req.body;

    const subscription = await stripeService.createSubscription({
      email,
      token,
      plan_id,
    });

    // Return the subscription details to the frontend
    res.status(200).json({ status: 200, subscription });
  } catch (error) {
    // Handle errors and send an error response
    res.status(500).json({
      status: error.statusCode || 500,
      error: error.message,
    });
  }
};

/**
 * Handle the '/stripe/subscriptions/:customer_id' endpoint.
 * Updates the subscription for a customer in Stripe and returns the updated subscription details.
 */
const updateSubscription = async (req, res) => {
  try {
    // Extract the plan_id from the request body
    const { plan_id } = req.body;
    const { customer_id } = req.params;

    const updatedSubscription = await stripeService.updateSubscription(
      customer_id,
      { plan_id }
    );

    // Return the updated subscription details to the frontend
    res.status(200).json({ status: 200, subscription: updatedSubscription });
  } catch (error) {
    // Handle errors and send an error response
    res.status(500).json({
      status: error.statusCode || 500,
      error: error.message,
    });
  }
};

/**
 * Handle the '/stripe/subscriptions/:customer_id' endpoint.
 * Deletes the first active subscription for a customer in Stripe.
 */
const deleteSubscription = async (req, res) => {
  try {
    const { customer_id } = req.params;

    await stripeService.deleteSubscription(customer_id);

    // Return success message to the frontend
    res.json({ status: 200, message: "Subscription deleted successfully" });
  } catch (error) {
    // Handle errors and send an error response
    res.status(500).json({
      status: error.statusCode || 500,
      error: error.message,
    });
  }
};

module.exports = {
  createOnePaymentCheckout,
  createToken,
  createSubscription,
  updateSubscription,
  deleteSubscription,
};
