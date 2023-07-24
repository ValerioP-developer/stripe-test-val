const config = require("config");
const createError = require("http-errors");
const stripeInstance = require("stripe");
const logger = require("../../utils/logger");

const STRIPE_API_KEY = config.get("stripeApiSecretKey");

const stripe = stripeInstance(STRIPE_API_KEY);

/**
 * Create a payment checkout session using Stripe API and return the checkout URL.
 *
 * @param {Object} data - The data required to create the payment checkout session.
 * @returns {Object} The created checkout session object.
 */
const createPaymentCheckout = async (data) => {
  try {
    const { name, amount } = data;

    // Log the payment checkout request
    logger.info(`Payment checkout request received:`, { name, amount });

    // Prepare line item for the checkout session
    const lineItems = [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.floor(amount * 100), // Convert amount to cents (Stripe expects the amount in cents)
          product_data: {
            name: name,
          },
        },
      },
    ];

    // Create a checkout session using Stripe API
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Accept card payments
      line_items: lineItems, // List of items to be purchased
      mode: "payment", // Set to 'payment' for one-time payments
      success_url: "https://your-website.com/success", // Replace with your success URL
      cancel_url: "https://your-website.com/cancel", // Replace with your cancel URL
    });

    // Log the successful checkout session
    logger.info("Checkout session created:", {
      checkoutSessionId: checkoutSession.id,
      successUrl: checkoutSession.success_url,
      cancelUrl: checkoutSession.cancel_url,
    });

    return checkoutSession;
  } catch (err) {
    // Log the error
    logger.error("Error occurred during payment checkout:", {
      error: err.message,
    });

    throw err;
  }
};

/**
 * Update the subscription for a customer in Stripe.
 *
 * @param {Object} data - The data required to create the token.
 * @returns {Object} The token object.
 */
const createToken = async (data) => {
  try {
    const { number, exp_month, exp_year, cvc } = data;

    const token = await stripe.tokens.create({
      card: {
        number,
        exp_month,
        exp_year,
        cvc,
      },
    });

    // Log successful token creation data
    logger.info("Token created:", {
      token_id: token.id,
    });

    return {
      token_id: token.id,
      message: "Token created successfully",
    };
  } catch (error) {
    // Log the error
    logger.error("Error creating token:", { error: error.message });
    throw error;
  }
};

/**
 * Create a subscription for a customer in Stripe.
 *
 * @param {Object} data - The data required to create the subscription.
 * @returns {Object} The created subscription object.
 */
const createSubscription = async (data) => {
  try {
    const { email, token, plan_id } = data;

    // Check if the customer already exists in Stripe based on their email
    const customers = await stripe.customers.list({ email: email });
    let customer = customers.data[0];

    if (!customer) {
      // If the customer doesn't exist, create a new customer in Stripe
      customer = await stripe.customers.create({ email });
    }

    // Log customer creation or retrieval
    logger.info("Customer fetched or created:", {
      customer_id: customer.id, // we can use this customer_id in DB for future usage
      email: customer.email,
    });

    // Check if the customer already has an active subscription with the same plan
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
    });

    const isAlreadySubscribed = subscriptions.data.some(
      (subscription) => subscription.items.data[0].price.id
    );

    if (isAlreadySubscribed) {
      throw new createError.Forbidden(
        "Customer is already subscribed to this plan."
      );
    }

    // Create a PaymentMethod using the token
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: token,
      },
    });

    // Attach the PaymentMethod to the customer as the default payment method
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });

    // Set the default payment method for the customer
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    // Create a subscription for the customer
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: plan_id }],
    });

    // Variable to store the ID of the created subscription in Stripe
    // Store the ID of the created subscription for future use (e.g., database storage)
    const subscriptionId = subscription.id;

    // Log the successful subscription creation
    logger.info("Subscription successfully created:", {
      customer_id: customer.id,
      subscription,
    });

    // For now, we're returning the subscription object as-is
    return {
      customer_id: customer.id,
      subscription_id: subscriptionId,
      message: "Subscription successfully created",
    };
  } catch (error) {
    // Log the error
    logger.error("Error creating subscription:", { error: error.message });

    throw error;
  }
};

/**
 * Update the subscription for a customer in Stripe.
 *
 * @param {Object} data - The data required to update the subscription.
 * @returns {Object} The updated subscription object.
 */
const updateSubscription = async (customer_id, data) => {
  try {
    const { plan_id } = data;

    // Check if the customer exists in Stripe based on their customer_id
    const customer = await stripe.customers.retrieve(customer_id);

    if (!customer) {
      throw new createError.NotFound(
        "Customer not found. Make sure the customer_id is correct."
      );
    }

    // Retrieve the customer's subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customer_id,
    });
    // Find the current subscription with the given oldPlanId
    const currentSubscription = subscriptions.data.find(
      (subscription) => subscription.items.data[0].price.id
    );

    if (!currentSubscription) {
      throw new createError.NotFound(
        "Subscription not found for the customer."
      );
    }

    if (currentSubscription.items.data[0].price.id === plan_id) {
      throw new createError.Forbidden("Customer already has the same plan.");
    }

    // Update the customer's subscription to the new plan
    const updatedSubscription = await stripe.subscriptions.update(
      currentSubscription.id,
      {
        items: [
          {
            id: currentSubscription.items.data[0].id,
            price: plan_id,
          },
        ],
      }
    );

    // Log successful subscription update
    logger.info("Subscription updated:", {
      customer_id: customer_id,
      subscriptionId: updatedSubscription.id,
      plan_id,
    });

    return {
      subscription_id: updatedSubscription.id,
      customer_id: customer_id,
      message: "Subscription updated successfully",
    };
  } catch (error) {
    // Log the error
    logger.error("Error updating subscription:", { error: error.message });

    throw error;
  }
};

/**
 * Delete the first active subscription for a customer in Stripe.
 *
 * @param {string} email - The email of the customer to delete the subscription for.
 */
const deleteSubscription = async (customer_id) => {
  try {
    // Check if the customer exists in Stripe based on their ID
    const customer = await stripe.customers.retrieve(customer_id);

    if (!customer) {
      throw new createError.NotFound(
        "Customer not found. Make sure the customer_id is correct."
      );
    }

    // Retrieve the customer's subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customer_id,
    });

    if (subscriptions.data.length === 0) {
      throw new createError.NotFound(
        "No active subscriptions found for the customer."
      );
    }

    // Delete the customer's first active subscription
    await stripe.subscriptions.del(subscriptions.data[0].id);

    // Log successful subscription deletion
    logger.info("Subscription deleted:", {
      customer_id: customer_id,
      subscriptionId: subscriptions.data[0].id,
    });
  } catch (error) {
    // Log the error
    logger.error("Error deleting subscription:", { error: error.message });

    throw error;
  }
};

module.exports = {
  createPaymentCheckout,
  createToken,
  createSubscription,
  updateSubscription,
  deleteSubscription,
};
