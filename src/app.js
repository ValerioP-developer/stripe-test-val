// app.js
const express = require("express");
const app = express();
const cors = require("cors");
const config = require("config");
const swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");
const swaggerJSDoc = require("swagger-jsdoc");

// Routes
const routes = require("./v1/routes");

// Config
const swaggerConfig = require("../config/swagger-config.json");

const swaggerOptions = swaggerConfig;
const specs = swaggerJSDoc(swaggerOptions);

// Allowed Origins
const ALLOWED_ORIGINS = config.get("allowedOrigins");

// Set up CORS options to specify allowed regions
const corsOptions = {
  origin: (origin, callback) => {
    if (ALLOWED_ORIGINS.includes(origin) || !origin) {
      // Allow requests with a matching origin or no origin (e.g., requests from the same origin)
      callback(null, true);
    } else {
      // Disallow requests with origins not in the allowedOrigins array
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Middleware
app.use(express.json()); // Parse incoming JSON data and attach it to req.body
app.use(cors(corsOptions)); // Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(bodyParser.json());

// Define a health check endpoint
app.get("/api/health", (req, res) => {
  // This route handler responds with a JSON object indicating that the server is healthy.
  // When a GET request is made to "/api/health", this function will be executed.

  // Set the response status code to 200 OK
  res.status(200);

  // Send a JSON response with a status key set to "ok"
  res.json({ status: "ok" });
});

app.use(
  "/v1/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

// Routes with /v1 prefix
app.use("/v1", routes);

module.exports = app;
