/* ======================================================
   MarketPulse Telegram Bot – Production Ready
   Network: Base
   Payment: Native USDC on Base
   ====================================================== */

import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import {
  JsonRpcProvider,
  Contract,
  getAddress,
  Interface,
  Log
} from 'ethers';

/* =========================
   ENV validation helpers
   ========================= */

function mustEnv(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Missing ENV: ${name}`);
  return value;
}

function mustAddress(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Missing ENV: ${name}`);
  return getAddress(value);
}

/* =========================
   Load & validate ENV
   ========================= */

const BOT_TOKEN = mustEnv(process.env.BOT_TOKEN, 'BOT_TOKEN');
const BASE_RPC = mustEnv(process.env.BASE_RPC, 'BASE_RPC');

const USDC_ADDRESS = mustAddress(process.env.USDC_ADDRESS, 'USDC_ADDRESS');

const PAY_WALLET_PACK_5 = mustAddress(
  process.env.PAY_WALLET_PACK_5,
  'PAY_WALLET_PACK_5'
);
const PAY_WALLET_PACK_10 = mustAddress(
  process.env.PAY_WALLET_PACK_10,
  'PAY_WALLET_PACK_10'
);
const PAY_WALLET_PACK_15 = mustAddress(
  process.env.PAY_WALLET_PACK_15,
  'PAY_WALLET_PACK_15'
);

const FREE_DAILY_LIMIT = Number(process.env.FREE_DAILY_LIMIT || 1);

/* =========================
   Blockchain setup
   ========================= */

const provider = new JsonRpcProvider(BASE_RPC);

const USDC_ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 value)'
];
const usdcInterface = new Interface(USDC_ABI);
const usdcContract = new Contract(USDC_ADDRESS, USDC_ABI, provider);

/* =========================
   In-memory state (MVP)
   ========================= */

type Tier = 'FREE' | 'PAID' | 'PRO';

const userTier = new Map<number, Tier>();
const dailyUsage = new Map<number, number>();

/* =========================
   Telegram bot
   ========================= */

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('✅ MarketPulse Bot is running (full PRO features enabled)');

/* =========================
   Helpers
   ========================= */

function canUseFree(userId: number): boolean {
  const used = dailyUsage.get(userId) || 0;
  return used < FREE_DAILY_LIMIT;
}

function incFree(userId: number) {
  dailyUsage.set(userId, (dailyUsage.get(userId) || 0) + 1);
}

function marketState(): string {
  // فعلاً State-only (بدون سیگنال)
  return [
    'Market State',
    'RISK-OFF / TRANSITION',
    'Volatility: HIGH',
    'Theme: TRANSITION'
  ].join('\n');
}

/* =========================
   Commands
   ========================= */

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `MarketPulse

Daily market awareness.
No signals. No stress.

Commands:
/state     → daily snapshot
/buy_paid  → PAID access
/buy_pro   → PRO access
/verify <txHash> → unlock access

Use once a day.
Clarity before action.`
  );
});

bot.onText(/\/state/, (msg) => {
  const uid = msg.from!.id;
  const tier = userTier.get(uid) || 'FREE';

  if (tier === 'FREE') {
    if (!canUseFree(uid)) {
      bot.sendMessage(msg.chat.id, 'Daily free limit reached. Use /buy_paid.');
      return;
    }
    incFree(uid);
  }

  bot.sendMessage(msg.chat.id, marketState());
});

bot.onText(/\/buy_paid/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `PAID Plan
Amount: 5 USDC
Network: Base
Send to:
${PAY_WALLET_PACK_5}

Then run:
/verify <txHash>`
  );
});

bot.onText(/\/buy_pro/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `PRO Plan
Amount: 10 USDC
Network: Base
Send to:
${PAY_WALLET_PACK_10}

Then run:
/verify <txHash>`
  );
});

bot.onText(/\/verify (.+)/, async (msg, match) => {
  const txHash = match?.[1];
  if (!txHash) return;

  try {
    const tx = await provider.getTransactionReceipt(txHash);
    if (!tx) {
      bot.sendMessage(msg.chat.id, 'Transaction not found yet.');
      return;
    }

    for (const log of tx.logs as Log[]) {
      if (log.address.toLowerCase() !== USDC_ADDRESS.toLowerCase()) continue;

      const parsed = usdcInterface.parseLog(log);
      if (!parsed) continue;

      const to = getAddress(parsed.args.to);
      const amount = Number(parsed.args.value) / 1e6;

      if (to === PAY_WALLET_PACK_5 && amount >= 5) {
        userTier.set(msg.from!.id, 'PAID');
        bot.sendMessage(msg.chat.id, '✅ PAID access unlocked.');
        return;
      }

      if (to === PAY_WALLET_PACK_10 && amount >= 10) {
        userTier.set(msg.from!.id, 'PRO');
        bot.sendMessage(msg.chat.id, '🚀 PRO access unlocked.');
        return;
      }
    }

    bot.sendMessage(msg.chat.id, 'Payment not valid for upgrade.');
  } catch (err: any) {
    bot.sendMessage(msg.chat.id, `Error verifying tx: ${err.message}`);
  }
});

/* =========================
   Safety: log polling errors
   ========================= */

bot.on('polling_error', (err) => {
  console.error('polling_error:', err.message);
});
