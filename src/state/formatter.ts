import type { MarketState } from './realState.js';
import { resolveTheme } from './theme.js';

export function formatState(state: MarketState): string {
  const theme = resolveTheme(state);

  return `📊 Market State
State: ${state}
Theme: ${theme}`;
}
