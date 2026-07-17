process.env.JWT_SECRET = "testsecret";

import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app.js";

import {
  connectTestDB,
  closeTestDB,
} from "./setup.js";


beforeAll(async () => {
  await connectTestDB();
});


afterAll(async () => {
  await closeTestDB();
});

function createTestToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

describe("Authentication routes", () => {

  test("registers a new user", async () => {

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "climber123",
        email: "climber@test.com",
        password: "password123",
      });


    expect(response.statusCode).toBe(201);

    expect(response.body.token)
      .toBeDefined();

    expect(response.body.user.email)
      .toBe("climber@test.com");

  });


  test("logs in an existing user", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "climber@test.com",
        password: "password123",
      });


    expect(response.statusCode).toBe(200);

    expect(response.body.token)
      .toBeDefined();

  });


  test("rejects incorrect password", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "climber@test.com",
        password: "wrongpassword",
      });


    expect(response.statusCode).toBe(400);

    expect(response.body.message)
      .toBe("Invalid credentials");

  });

});