import 'dotenv/config';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { startBot } from './bot/index.js';

const PORT = Number(process.env.PORT ?? 3000);

async function bootstrap(): Promise<void> {
  const app = express();
  app.use(bodyParser.json());

  app.get('/', (_req: Request, res: Response) => {
    res.json({ status: 'MarketPulseCore online' });
  });

  app.post('/telegram', (_req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.listen(PORT, () => {
    console.log(`🌐 HTTP server running on port ${PORT}`);
  });

  await startBot();
}

bootstrap().catch((err: unknown) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
