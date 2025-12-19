import TelegramBot from "node-telegram-bot-api";

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("❌ BOT_TOKEN is not defined");
}

export const bot = new TelegramBot(token, {
  webHook: true
});

export async function handleTelegramUpdate(update: any) {
  await bot.processUpdate(update);
}

bot.onText(/\/start/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    "🚀 Professional market state intelligence is online."
  );
});

bot.onText(/\/status/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `📊 Market Status\nState: CLEAN\nMood: 🟢 Clear Market\nRisk Level: Low`
  );
});
