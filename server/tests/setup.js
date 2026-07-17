import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo;

export async function connectTestDB() {
  mongo = await MongoMemoryServer.create();

  await mongoose.connect(mongo.getUri());
}

export async function closeTestDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  await mongo.stop();
}