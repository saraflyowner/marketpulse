import { MarketState } from "./realState";
import { Theme } from "./theme";

export function formatFree(state: MarketState, theme: Theme): string {
  return `Market State — Today

${state.regime} / ${state.structure}

Volatility is ${
    state.volatility === "HIGH" ? "elevated" : "moderate"
  }.
Market structure is ${state.structure.toLowerCase()}.
Clarity is limited.`;
}

export function formatPaid(state: MarketState, theme: Theme): string {
  return `Market Regime — Today

State:
${state.regime} / ${state.structure}

Context:
Volatility is ${state.volatility.toLowerCase()}.
Market structure is changing.

Interpretation:
${
  theme === "CALM"
    ? "Market conditions are stable. Patience is appropriate."
    : theme === "TENSION"
    ? "Market tension is elevated. Sharp moves are possible."
    : "Market conditions are unstable. Patience is favored over urgency. Waiting for clearer structure is reasonable."
}

Confidence: ${state.confidence}`;
}

export function formatPro(
  state: MarketState,
  theme: Theme,
  history: string[]
): string {
  return `Market Regime — Pro View

Today:
${state.regime} / ${state.structure}
Volatility: ${state.volatility}

Recent Regime History:
${history.map((h) => `- ${h}`).join("\n")}

Interpretation:
Current conditions represent a transition phase.
Similar regimes in the past
tended to remain unstable before clarity emerged.

Confidence: ${state.confidence}`;
}
