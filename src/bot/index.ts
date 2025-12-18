import TelegramBot, { Message } from 'node-telegram-bot-api';

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v || !v.trim()) {
    console.error(`❌ Missing ENV: ${name}`);
    process.exit(1);
  }
  return v.trim();
}

export async function startBot(): Promise<TelegramBot> {
  const BOT_TOKEN = mustEnv('BOT_TOKEN');

  const bot = new TelegramBot(BOT_TOKEN, { polling: true });

  console.log('🤖 MarketPulseCore bot started');

  bot.onText(/^\/start$/, async (msg: Message) => {
    await bot.sendMessage(
      msg.chat.id,
      `👋 Welcome to MarketPulseCore

Market regime awareness only.
No signals. No financial advice.

Commands:
/status
/help`
    );
  });

  bot.onText(/^\/help$/, async (msg: Message) => {
    await bot.sendMessage(
      msg.chat.id,
      `ℹ️ Help

MarketPulse provides:
• Regime context
• Risk environment
• Volatility state`
    );
  });

  bot.onText(/^\/status$/, async (msg: Message) => {
    await bot.sendMessage(
      msg.chat.id,
      `✅ Status: ONLINE
🌐 Mode: Global
🔒 Access: Controlled`
    );
  });

  bot.on('message', async (msg: Message) => {
    if (!msg.text || msg.text.startsWith('/')) return;
    await bot.sendMessage(msg.chat.id, '❓ Unknown command. Use /help');
  });

  bot.on('polling_error', (err: Error) => {
    console.error('⚠️ Polling error:', err.message);
  });

  return bot;
}
