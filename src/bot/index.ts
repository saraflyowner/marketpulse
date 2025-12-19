import { IncomingMessage, ServerResponse } from "http";

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not defined");
}

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || null;


async function sendMessage(chatId: number, text: string) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });
}


export async function handleTelegramWebhook(
  req: IncomingMessage,
  res: ServerResponse
) {
 
  if (WEBHOOK_SECRET) {
    const incomingSecret =
      req.headers["x-telegram-bot-api-secret-token"];
    if (incomingSecret !== WEBHOOK_SECRET) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
  }

  let body = "";
  req.on("data", chunk => (body += chunk));
  req.on("end", async () => {
    try {
      const update = JSON.parse(body);

      const message = update.message;
      if (!message || !message.text) {
        res.writeHead(200);
        res.end("OK");
        return;
      }

      const chatId = message.chat.id;
      const text = message.text.trim();

      console.log("📩 Incoming message:", {
        chatId,
        text,
      });

      if (text === "/start") {
        await sendMessage(
          chatId,
          "📊 MarketPulseCore is live.\n\n" +
            "Professional market state intelligence is online.\n\n" +
            "Use /status to check market conditions."
        );
      }

      if (text === "/status") {
        await sendMessage(
          chatId,
          "📈 Market Status\n\n" +
            "State: CLEAN\n" +
            "Mood: 🟢 Clear Market\n" +
            "Risk Level: Low"
        );
      }

      res.writeHead(200);
      res.end("OK");
    } catch (err) {
      console.error("❌ Webhook error:", err);
      res.writeHead(500);
      res.end("Internal Error");
    }
  });
}
