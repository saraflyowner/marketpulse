import fs from "node:fs";
import path from "node:path";
import { MarketState } from "../state/realState";

const dataDir = path.join(process.cwd(), "data");
const file = path.join(dataDir, "state-history.json");

type Item = {
  date: string;
  regime: string;
  structure: string;
  volatility: string;
};

function load(): Item[] {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function save(arr: Item[]) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(arr, null, 2));
}

export function logState(state: MarketState) {
  const arr = load();
  arr.push({
    date: new Date().toISOString().slice(0, 10),
    regime: state.regime,
    structure: state.structure,
    volatility: state.volatility,
  });
  save(arr.slice(-30)); // نگه‌دار 30 روز آخر
}

export function getHistoryLines(days = 7): string[] {
  const arr = load().slice(-days);
  return arr.map(
    (x) => `${x.date}: ${x.regime} / ${x.structure} (${x.volatility})`
  );
}

export function getComparison(): string {
  const arr = load();
  if (arr.length < 2) {
    return "Not enough history to detect regime change.";
  }

  const last = arr[arr.length - 1];
  const prev = arr[arr.length - 2];

  let changes: string[] = [];

  if (last.regime !== prev.regime) {
    changes.push(`Risk regime shifted: ${prev.regime} → ${last.regime}`);
  }
  if (last.structure !== prev.structure) {
    changes.push(
      `Market structure changed: ${prev.structure} → ${last.structure}`
    );
  }
  if (last.volatility !== prev.volatility) {
    changes.push(
      `Volatility changed: ${prev.volatility} → ${last.volatility}`
    );
  }

  if (changes.length === 0) {
    return "No meaningful regime change detected compared to the previous state.";
  }

  return changes.join("\n");
}
