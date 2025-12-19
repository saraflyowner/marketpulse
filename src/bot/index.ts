// src/bot/index.ts
import type { Express, Request, Response } from "express";
import TelegramBot from "node-telegram-bot-api";
import { formatStatusMessage } from "../state/formatter.js";

// IMPORTANT: In production webhook mode, DO NOT enable polling.
const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error("❌ BOT_TOKEN is not defined in environment variables");
}

const bot = new TelegramBot(BOT_TOKEN);

// Register bot commands/handlers
bot.onText(/^\/start\b/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    "Professional market state intelligence is online."
  );
});

bot.onText(/^\/status\b/, async (msg) => {
  const text = formatStatusMessage();
  await bot.sendMessage(msg.chat.id, text, { disable_web_page_preview: true });
});

// Webhook initializer
export function initBotWebhook(app: Express) {
  // This MUST match the webhook URL you set in Telegram:
  // https://<your-railway-domain>/telegram/webhook
  app.post("/telegram/webhook", (req: Request, res: Response) => {
    try {
      // Telegram update is in req.body
      bot.processUpdate(req.body);
      // Telegram requires fast 200 OK response
      return res.sendStatus(200);
    } catch (err) {
      console.error("❌ Webhook processing error:", err);
      return res.sendStatus(500);
    }
  });

  // Optional: quick test endpoint
  app.get("/telegram/webhook", (_req, res) => {
    res.status(200).send("Webhook endpoint is alive.");
  });
}

export default bot;
