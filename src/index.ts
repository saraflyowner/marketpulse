import http from "http";
import { handleTelegramWebhook } from "./bot/index.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const server = http.createServer(async (req, res) => {
  // Health check
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "marketpulse" }));
    return;
  }

  // Telegram webhook endpoint
  if (req.method === "POST" && req.url === "/telegram/webhook") {
    await handleTelegramWebhook(req, res);
    return;
  }

  // Default
  res.writeHead(404);
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
