import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import { initBotWebhook } from "./bot/index.js";

const app = express();
app.use(bodyParser.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "MarketPulseCore",
    time: new Date().toISOString(),
  });
});

app.post("/telegram/webhook", async (req, res) => {
  try {
    console.log("📩 Webhook update received");
    await initBotWebhook(req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`🚀 HTTP server running on port ${PORT}`);
});
