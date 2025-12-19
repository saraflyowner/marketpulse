import TelegramBot, { Message } from "node-telegram-bot-api";
import { formatStatusMessage } from "../state/formatter.js";

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not defined");
}

export const bot = new TelegramBot(BOT_TOKEN, {
  polling: false, // ✅ production (webhook)
});

console.log("🤖 Telegram bot initialized (webhook mode)");

export async function initBotWebhook(update: any) {
  await bot.processUpdate(update);
}

bot.onText(/^\/start$/, async (msg: Message) => {
  await bot.sendMessage(
    msg.chat.id,
    "🤖 *MarketPulseCore*\n\nProfessional market state intelligence is online.",
    { parse_mode: "Markdown" }
  );
});

bot.onText(/^\/status$/, async (msg: Message) => {
  const text = formatStatusMessage();
  await bot.sendMessage(msg.chat.id, text, { parse_mode: "Markdown" });
});

bot.on("message", async (msg: Message) => {
  if (!msg.text?.startsWith("/")) {
    await bot.sendMessage(
      msg.chat.id,
      "ℹ️ Available commands:\n/start\n/status"
    );
  }
});
