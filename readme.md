# Project Name: Valeriop Backend

### Description

This is the backend server for the Valeriop application. It provides APIs to manage payments and subscriptions using the Stripe API.

## Installation

To run the backend server locally, follow these steps:

### Clone the repository from GitHub:

`git clone https://github.com/ValerioP-developer/basic-stripe-api.git`

### Navigate to the project directory:

cd valeriop-backend

### Install the required dependencies:

`npm install`

### Usage

To start the server, use the following npm scripts:

## Start the server in production mode:

`npm start`

## Start the server in development mode with nodemon:

`npm run dev`

### Run tests using Jest:

`npm test`

# Dependencies

### The backend server uses the following external libraries and modules:

- **body-parser:** Middleware for parsing incoming request bodies.
- **config:** Configuration management for the application.
- **cors:** Middleware for enabling Cross-Origin Resource Sharing (CORS).
- **express:** Web framework for building APIs and server-side applications.
- **js-yaml:** Library for parsing YAML files.
- **stripe:** Node.js library for interacting with the Stripe API.
- **swagger-jsdoc:** Library for generating Swagger/OpenAPI documentation from JSDoc comments.
- **swagger-ui-express:** Middleware for serving Swagger UI to visualize and interact with the API.
- **winston:** Logging library for creating log files.
- **yup:** Schema validation library.

# Development Dependencies

The following development dependencies are used for testing and development purposes:

- **jest:** Testing framework for unit testing.
- **nodemon:** Development utility for auto-restarting the server on file changes during development.
- **supertest:** Library for testing HTTP requests.

# API Documentation

The API documentation is automatically generated using Swagger UI. To view the API documentation, run the server and open the following URL in your web browser:

`http://localhost:3000/v1/docs`

The application uses the **config** module to manage configuration settings. You can find the configuration files in the **config** directory. Modify the configuration files as needed to customize the application behavior.

# Authentication Middleware with Token

**Authorization Token:** The current valid token is hardcoded as **b24b3b0e-9257-466b-949e-8c0c3841eeb5.** or we can add the ENV variable AUTHORIZATION_SYSTEM_TOKEN and override the default token.

You need to pass this token in authorization header when making api call. we can change this in future when we have users information in out db. 

Example for passing in authorization header `System b24b3b0e-9257-466b-949e-8c0c3841eeb5.`
