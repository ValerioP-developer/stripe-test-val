// Required packages and modules
const config = require("config");
const app = require("./src/app");

const PORT = config.get("port");

// Set the server port (use PORT for Heroku)
const port = PORT || 3000;

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
