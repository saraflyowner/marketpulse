import { MarketState } from "./realState";

export type Theme = "CALM" | "TENSION" | "TRANSITION";

export function detectTheme(state: MarketState): Theme {
  if (state.volatility === "LOW") return "CALM";
  if (state.structure === "TRANSITION") return "TRANSITION";
  return "TENSION";
}
