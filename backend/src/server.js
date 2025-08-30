import "../instrument.mjs";
import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";
import chatRoutes from "./routes/chat.route.js";
import * as Sentry from "@sentry/node";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware());

app.get("/debug-sentry", (req, res) => {
  throw new Error("My first Sentry Error");
});

app.get("/", (req, res) => {
  res.send("Hey , welcome to SquadTalk!");
});

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);

Sentry.setupExpressErrorHandler(app);
const startServer = async () => {
  try {
    await connectDB();
    // Run locally with app.listen
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => {
        console.log("Server running on port:", ENV.PORT);
      });
    }
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};
startServer();

export default app;
