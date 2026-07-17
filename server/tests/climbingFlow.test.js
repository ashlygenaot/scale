process.env.JWT_SECRET = "testsecret";

import request from "supertest";
import app from "../app.js";

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


describe("Climbing workflow", () => {
  let token;


  beforeEach(async () => {
    await User.deleteMany();


    const user = await User.create({
      username: "climber",
      email: "climber@test.com",
      passwordHash: "hashedpassword",
    });


    token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  });



  test("creates a session and adds a climb", async () => {

    // Create session
    const sessionResponse = await request(app)
      .post("/api/sessions")
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        date: "2026-07-17",
        location: "Vertical Ventures",
        duration: 90,
        notes: "Great session"
      });


    expect(sessionResponse.statusCode)
      .toBe(201);


    const sessionId = sessionResponse.body._id;



    // Create climb
    const climbResponse = await request(app)
      .post(`/api/climbs/${sessionId}/climbs`)
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        name: "Blue Slab",
        grade: "V4",
        type: "boulder",
        status: "send",
        tries: 3,
        notes: "Hard start"
      });


    expect(climbResponse.statusCode)
      .toBe(201);


    expect(climbResponse.body.climb.name)
      .toBe("Blue Slab");



    // Get climbs from session
    const climbsResponse = await request(app)
      .get(`/api/climbs/${sessionId}/climbs`)
      .set(
        "Authorization",
        `Bearer ${token}`
      );


    expect(climbsResponse.statusCode)
      .toBe(200);


    expect(climbsResponse.body.climbs.length)
      .toBe(1);


    expect(climbsResponse.body.climbs[0].grade)
      .toBe("V4");

  });


});