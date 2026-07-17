import request from "supertest";
import app from "../app.js";

describe("Health endpoint", () => {

  test("GET /health returns status ok", async () => {

    const response = await request(app)
      .get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("ok");

  });

});