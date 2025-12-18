import TelegramBot, { Message } from "node-telegram-bot-api";
import { formatStatusMessage } from "../state/formatter";

const BOT_TOKEN = process.env.BOT_TOKEN!;
if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not defined");
}

export const bot = new TelegramBot(BOT_TOKEN);

/**
 * Webhook handler (called from index.ts)
 */
export async function initBotWebhook(update: any) {
  await bot.processUpdate(update);
}

/**
 * Commands
 */
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
      "ℹ️ Available commands:\n/status\n/help"
    );
  }
});
