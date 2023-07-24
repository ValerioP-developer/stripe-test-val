// validationMiddleware.js
const yup = require("yup");

const validateCreateOnePaymentCheckout = (req, res, next) => {
  const { name, amount } = req.body;

  const createOnePaymentCheckoutSchema = yup.object().shape({
    name: yup.string().required("Name is required."),
    amount: yup
      .number()
      .positive("Amount must be a positive number.")
      .required("Amount is required."),
  });

  createOnePaymentCheckoutSchema
    .validate({ name, amount }, { abortEarly: false })
    .then(() => next())
    .catch((err) => {
      const errors = err.inner.map((error) => ({
        field: error.path,
        message: error.message,
      }));
      res.status(400).json({ errors });
    });
};

const validateCreateToken = (req, res, next) => {
  const { number, exp_month, exp_year, cvc } = req.body;

  const createTokenSchema = yup.object().shape({
    number: yup
      .number()
      .positive("Number must be a positive number.")
      .required("Number is required."),
    exp_month: yup
      .number()
      .positive("Expiry month must be a positive number.")
      .required("Expiry month is required."),
    exp_year: yup
      .number()
      .positive("Expiry year must be a positive number.")
      .required("Expiry year is required."),
    cvc: yup
      .number()
      .positive("CVC must be a positive number.")
      .required("CVC is required."),
  });

  createTokenSchema
    .validate({ number, exp_month, exp_year, cvc }, { abortEarly: false })
    .then(() => next())
    .catch((err) => {
      const errors = err.inner.map((error) => ({
        field: error.path,
        message: error.message,
      }));
      res.status(400).json({ errors });
    });
};

const validateCreateSubscription = async (req, res, next) => {
  const { email, plan_id, token } = req.body;

  try {
    // Define the Yup schema for validation
    const createSubscriptionSchema = yup.object().shape({
      email: yup.string().email().required(),
      plan_id: yup.string().required(),
      token: yup.string().required(),
    });

    // Validate the request body against the schema
    await createSubscriptionSchema.validate({ email, plan_id, token });

    // If validation is successful, proceed to the next middleware/route handler
    next();
  } catch (error) {
    // If validation fails, send an error response with the validation errors
    res.status(400).json({ error: error.message });
  }
};

const validateUpdateSubscription = async (req, res, next) => {
  const { plan_id } = req.body;
  const { customer_id } = req.params;

  try {
    // Define the Yup schema for validation
    const updateSubscriptionSchema = yup.object().shape({
      customer_id: yup.string().required(),
      plan_id: yup.string().required(),
    });

    // Validate the request body against the schema
    await updateSubscriptionSchema.validate({
      customer_id,
      plan_id,
    });

    // If validation is successful, proceed to the next middleware/route handler
    next();
  } catch (error) {
    // If validation fails, send an error response with the validation errors
    res.status(400).json({ error: error.message });
  }
};

const validateDeleteSubscription = async (req, res, next) => {
  const { customer_id } = req.params;

  try {
    // Define the Yup schema for validation
    const deleteSubscriptionSchema = yup.object().shape({
      customer_id: yup.string().required(),
    });

    // Validate the request body against the schema
    await deleteSubscriptionSchema.validate({ customer_id });

    // If validation is successful, proceed to the next middleware/route handler
    next();
  } catch (error) {
    // If validation fails, send an error response with the validation errors
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  validateCreateOnePaymentCheckout,
  validateCreateToken,
  validateCreateSubscription,
  validateUpdateSubscription,
  validateDeleteSubscription,
};
