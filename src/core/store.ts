import fs from "node:fs";
import path from "node:path";

export type Tier = "FREE" | "PAID" | "PRO";

export type UserRecord = {
  tier: Tier;
  accessUntil?: string;      // ISO
  createdAt: string;         // ISO
  lastSeenAt?: string;       // ISO
};

export type DB = {
  users: Record<string, UserRecord>;
  usedTx: Record<string, { userId: number; usedAt: string; pack: Tier }>;
};

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "users.json");

function ensureDB() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dbPath)) {
    const init: DB = { users: {}, usedTx: {} };
    fs.writeFileSync(dbPath, JSON.stringify(init, null, 2));
  }
}

export function loadDB(): DB {
  ensureDB();
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

export function saveDB(db: DB) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

export function getUser(db: DB, userId: number): UserRecord {
  const k = String(userId);
  if (!db.users[k]) {
    db.users[k] = {
      tier: "FREE",
      createdAt: new Date().toISOString(),
    };
  }
  db.users[k].lastSeenAt = new Date().toISOString();
  return db.users[k];
}

export function hasActiveAccess(user: UserRecord): boolean {
  if (!user.accessUntil) return false;
  return new Date(user.accessUntil).getTime() > Date.now();
}

export function isTxUsed(db: DB, txHash: string): boolean {
  return Boolean(db.usedTx[txHash.toLowerCase()]);
}

export function markTxUsed(db: DB, txHash: string, userId: number, pack: Tier) {
  db.usedTx[txHash.toLowerCase()] = {
    userId,
    usedAt: new Date().toISOString(),
    pack,
  };
}

export function grantAccess(user: UserRecord, tier: Tier, days: number) {
  // Upgrade tier (PRO dominates PAID)
  if (tier === "PRO") user.tier = "PRO";
  else if (tier === "PAID" && user.tier === "FREE") user.tier = "PAID";

  const base = user.accessUntil
    ? Math.max(Date.now(), new Date(user.accessUntil).getTime())
    : Date.now();

  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + days);
  user.accessUntil = d.toISOString();
}
