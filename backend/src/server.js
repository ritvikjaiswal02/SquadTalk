import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";

const app = express();

app.use(express.json());
app.use(clerkMiddleware);

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/", (req, res) => {
  res.send("Hey , welcome to SquadTalk!");
});

// Run locally with app.listen
if (ENV.NODE_ENV !== "production") {
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(ENV.PORT, () => {
        console.log(`🚀 Server running on http://localhost:${ENV.PORT}`);
      });
    } catch (error) {
      console.error("❌ Error starting server:", error);
      process.exit(1);
    }
  };
  startServer();
} else {
  // On Vercel, just connect DB once when serverless function initializes
  connectDB().catch((err) => console.error("❌ DB connection failed:", err));
}

export default app;
