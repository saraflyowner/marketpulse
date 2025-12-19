import TelegramBot from "node-telegram-bot-api";
import { formatStatusMessage } from "../state/formatter.js";

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("BOT_TOKEN is not set");
}

const bot = new TelegramBot(token);

export async function initBotWebhook(update: any) {
  if (!update.message) return;

  const chatId = update.message.chat.id;
  const text = update.message.text || "";

  if (text === "/start") {
    await bot.sendMessage(
      chatId,
      "👋 Welcome to MarketPulse\nUse /status to get market regime"
    );
    return;
  }

  if (text === "/status") {
    const msg = formatStatusMessage();
    await bot.sendMessage(chatId, msg);
    return;
  }
}
