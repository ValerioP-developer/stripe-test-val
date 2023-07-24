const config = require("config");
const { Unauthorized } = require("http-errors");
const AUTH_SYSTEM_TOKEN = config.get("authSystemToken");

const authMiddleware = (req, res, next) => {
  // Get the Authorization header from the request
  const authHeader = req.headers.authorization;
  // Check if the Authorization header exists and matches the valid token
  if (!authHeader || authHeader !== `System ${AUTH_SYSTEM_TOKEN}`) {
    throw new Unauthorized("Invalid authorization token");
  }

  // Proceed to the next middleware/route handler
  next();
};

module.exports = authMiddleware;
