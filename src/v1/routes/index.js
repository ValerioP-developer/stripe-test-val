const express = require("express");
const stripeRoutes = require("./stripe");
const { auth } = require("../middlewares");

// Create an instance of an Express Router
const router = express.Router();

/**
 * Define Routes
 *
 * Use the `router.use()` method to mount the sub-routers
 * under specific paths. This allows for modular and
 * organized routing in application.
 */

// Mount the `stripeRoutes` under the path '/stripe'
router.use("/stripe", auth, stripeRoutes);

/**
 * Export Router
 *
 * Make the `router` instance available to other parts of
 * the application by exporting it. This allows the main
 * app.js file to use this router with a specific prefix.
 */

module.exports = router;
