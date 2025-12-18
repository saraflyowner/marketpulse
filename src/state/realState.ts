// src/state/realState.ts
export type MarketState = {
  regime: "RISK-ON" | "RISK-OFF" | "NEUTRAL-RISK";
  structure: "TREND" | "RANGE" | "TRANSITION";
  volatility: "LOW" | "RISING" | "HIGH";
  liquidity: "THIN" | "NORMAL" | "ABUNDANT";
  horizon: "INTRADAY" | "24H" | "SWING";
  confidence: "LOW" | "MEDIUM" | "HIGH";
};

export function generateMarketState(): MarketState {
 
  const hour = new Date().getUTCHours();

  if (hour >= 12 && hour <= 18) {
    return {
      regime: "NEUTRAL-RISK",
      structure: "RANGE",
      volatility: "RISING",
      liquidity: "NORMAL",
      horizon: "24H",
      confidence: "MEDIUM",
    };
  }

  return {
    regime: "RISK-OFF",
    structure: "TRANSITION",
    volatility: "HIGH",
    liquidity: "THIN",
    horizon: "24H",
    confidence: "MEDIUM",
  };
}
