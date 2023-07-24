const request = require("supertest");
const app = require("../src/app");

jest.mock("config", () => ({
  // Provide mock configuration settings here
  get: jest.fn((key) => {
    if (key === "allowedOrigins") return [];
    // Replace with appropriate mock values for your test cases
    if (key === "port") return 3000;
    // Add more mock values as needed
    // Example: if (key === 'databaseUrl') return 'mocked-database-url';
  }),
}));

describe("Health Check Endpoint", () => {
  test('should respond with status 200 and JSON object with status "ok"', async () => {
    const response = await request(app).get("/api/health");
    // Verify the response status code is 200
    expect(response.status).toBe(200);

    // Verify the response body contains a "status" key with the value "ok"
    expect(response.body).toEqual({ status: "ok" });
  });

  // Add more test cases as needed for other scenarios
});
