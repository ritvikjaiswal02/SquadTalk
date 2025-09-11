// routes/guidelines.js
import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

/**
 * Helper to get clerk userId from request.
 * Your clerk middleware exposes req.auth() in your examples.
 * We assume req.auth() returns an object with isAuthenticated and userId.
 */
const getClerkUserId = (req) => {
  try {
    const auth = req.auth && typeof req.auth === "function" ? req.auth() : req.auth;
    // auth might be object or function result; try to read userId
    return auth?.userId || auth?.user_id || auth?.id || null;
  } catch (err) {
    return null;
  }
};

/**
 * GET /api/guidelines
 * Returns whether the currently authenticated user has accepted guidelines.
 * Public: requires authentication via Clerk middleware (mounted globally).
 */
router.get("/", async (req, res) => {
  try {
    // ensure user is authenticated
    const auth = req.auth && typeof req.auth === "function" ? req.auth() : req.auth;
    if (!auth || !auth.isAuthenticated) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const clerkUserId = getClerkUserId(req);
    if (!clerkUserId) {
      return res.status(400).json({ message: "Missing user id" });
    }

    // Find user by clerkId
    let user = await User.findOne({ clerkId: clerkUserId }).select(
      "acceptedGuidelines guidelinesAcceptedAt clerkId email name"
    );

    // If no user yet, respond with default false (frontend should still save localStorage)
    if (!user) {
      return res.json({ accepted: false, user: null });
    }

    return res.json({ accepted: !!user.acceptedGuidelines, user });
  } catch (err) {
    console.error("GET /api/guidelines error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/guidelines/accept
 * Mark the current user as having accepted guidelines.
 */
router.post("/accept", async (req, res) => {
  try {
    const auth = req.auth && typeof req.auth === "function" ? req.auth() : req.auth;
    if (!auth || !auth.isAuthenticated) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const clerkUserId = getClerkUserId(req);
    if (!clerkUserId) {
      return res.status(400).json({ message: "Missing user id" });
    }

    // Upsert user record if not present. You may already create users elsewhere — adjust as needed.
    const update = {
      acceptedGuidelines: true,
      guidelinesAcceptedAt: new Date(),
    };

    const options = { new: true, upsert: true, setDefaultsOnInsert: true };

    // If user record contains other required fields (email, name) and upsert would fail,
    // you might instead fetch the user and require it to exist. Here we upsert minimally.
    const user = await User.findOneAndUpdate({ clerkId: clerkUserId }, update, options);

    return res.json({
      success: true,
      accepted: !!user.acceptedGuidelines,
      guidelinesAcceptedAt: user.guidelinesAcceptedAt,
    });
  } catch (err) {
    console.error("POST /api/guidelines/accept error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
