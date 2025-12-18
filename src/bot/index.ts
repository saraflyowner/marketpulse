import TelegramBot from 'node-telegram-bot-api';

let bot: TelegramBot | null = null;

export async function startBot() {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const MODE = process.env.BOT_MODE || 'webhook';

  if (!BOT_TOKEN) {
    throw new Error('BOT_TOKEN is missing');
  }

  if (MODE === 'polling') {
    bot = new TelegramBot(BOT_TOKEN, { polling: true });
    console.log('🤖 Bot started in POLLING mode');
  } else {
    bot = new TelegramBot(BOT_TOKEN);
    console.log('🤖 Bot started in WEBHOOK mode');
  }

  registerHandlers(bot);
}

export function setWebhook(url: string) {
  if (!bot) throw new Error('Bot not initialized');
  return bot.setWebHook(url);
}

function registerHandlers(bot: TelegramBot) {
  bot.onText(/^\/start$/, async (msg) => {
    await bot.sendMessage(
      msg.chat.id,
      `👋 Welcome to MarketPulse

Market state intelligence.
No signals. No noise.

Commands:
/status
/help`
    );
  });

  bot.onText(/^\/help$/, async (msg) => {
    await bot.sendMessage(
      msg.chat.id,
      `ℹ️ MarketPulse Help

• Market regime
• Risk environment
• Volatility context

No financial advice.`
    );
  });

  bot.onText(/^\/status$/, async (msg) => {
    await bot.sendMessage(
      msg.chat.id,
      `✅ MarketPulseCore is online
🌐 Mode: ${process.env.BOT_MODE || 'webhook'}`
    );
  });

  bot.on('message', async (msg) => {
    if (!msg.text) return;
    if (msg.text.startsWith('/')) return;

    await bot.sendMessage(
      msg.chat.id,
      '❓ Unknown command. Use /help.'
    );
  });

  bot.on('polling_error', (e) =>
    console.error('⚠️ Polling error:', e.message)
  );
}
