import express from "express";
import bodyParser from "body-parser";
import { handleTelegramUpdate } from "./bot/index.js";

const app = express();

/**
 * 🚨 خیلی مهم
 * تلگرام JSON خام می‌فرستد
 */
app.use(bodyParser.json());

app.post("/telegram/webhook", async (req, res) => {
  try {
    await handleTelegramUpdate(req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
