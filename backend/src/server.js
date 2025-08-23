import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hey , welcome to SquadTalk!");
});

app.listen(ENV.PORT, () => {
  console.log("Server started on port:", ENV.PORT);
  connectDB();
});
