// src/index.ts
import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import { initBotWebhook } from "./bot/index.js";

const app = express();

// Telegram sends JSON updates
app.use(bodyParser.json({ limit: "2mb" }));

// Health endpoints (useful for Railway)
app.get("/", (_req, res) => res.status(200).send("OK"));
app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

// Initialize Telegram webhook route + handlers
initBotWebhook(app);

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
