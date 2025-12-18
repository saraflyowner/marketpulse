import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import TelegramBot from 'node-telegram-bot-api';
import { startBot, setWebhook } from './bot';

/**
 * ============================
 * Environment validation
 * ============================
 */
const {
  BOT_TOKEN,
  BOT_MODE = 'webhook',
  PORT = '3000',
  PUBLIC_URL,
} = process.env;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is missing');
  process.exit(1);
}

if (BOT_MODE === 'webhook' && !PUBLIC_URL) {
  console.error('❌ PUBLIC_URL is required in webhook mode');
  process.exit(1);
}

/**
 * ============================
 * Express server
 * ============================
 */
const app = express();
app.use(bodyParser.json());

/**
 * Health check (Railway / uptime)
 */
app.get('/', (_req, res) => {
  res.status(200).send('MarketPulseCore is alive');
});

/**
 * ============================
 * Telegram Webhook Endpoint
 * ============================
 */
let telegramBot: TelegramBot;

app.post('/telegram', (req, res) => {
  if (!telegramBot) {
    res.sendStatus(500);
    return;
  }

  telegramBot.processUpdate(req.body);
  res.sendStatus(200);
});

/**
 * ============================
 * Bootstrap
 * ============================
 */
async function bootstrap() {
  console.log('🚀 Bootstrapping MarketPulseCore');

  // Start bot (no polling in prod)
  telegramBot = await startBot();

  if (BOT_MODE === 'webhook') {
    const webhookUrl = `${PUBLIC_URL}/telegram`;
    await setWebhook(webhookUrl);
    console.log('🔗 Webhook registered:', webhookUrl);
  }

  app.listen(Number(PORT), () => {
    console.log(`🌐 Server listening on port ${PORT}`);
    console.log(`🤖 Bot mode: ${BOT_MODE}`);
  });
}

/**
 * ============================
 * Global error safety
 * ============================
 */
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

/**
 * ============================
 * Start system
 * ============================
 */
bootstrap().catch((err) => {
  console.error('❌ Bootstrap failed:', err);
  process.exit(1);
});
