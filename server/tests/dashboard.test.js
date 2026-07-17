process.env.JWT_SECRET = "testsecret";

import request from "supertest";
import app from "../app.js";

import mongoose from "mongoose";
import User from "../models/User.js";

import {
  connectTestDB,
  closeTestDB,
} from "./setup.js";

import jwt from "jsonwebtoken";


beforeAll(async () => {
  await connectTestDB();
});


afterAll(async () => {
  await closeTestDB();
});


describe("Dashboard authorization", () => {

  let token;


  beforeEach(async () => {

    await User.deleteMany();


    const user = await User.create({
      username: "dashboardtest",
      email: "dashboard@test.com",
      passwordHash: "hashedpassword",
    });


    token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

  });



  test("rejects requests without token", async () => {

    const response = await request(app)
      .get("/api/dashboard");


    expect(response.statusCode)
      .toBe(401);

  });



  test("allows access with valid token", async () => {

    const response = await request(app)
      .get("/api/dashboard")
      .set(
        "Authorization",
        `Bearer ${token}`
      );


    expect(response.statusCode)
      .toBe(200);

  });


});