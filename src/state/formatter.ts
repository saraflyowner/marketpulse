import { MarketState } from "./realState.js";
import { Theme } from "./theme.js";

export function formatStatusMessage(): string {
  const state = MarketState.current();
  const theme = Theme[state];

  return (
    `📊 *Market Status*\n\n` +
    `State: *${state}*\n` +
    `Mood: ${theme.icon} ${theme.label}\n` +
    `Risk Level: *${theme.risk}*`
  );
}
