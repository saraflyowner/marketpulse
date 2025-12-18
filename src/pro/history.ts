import type { MarketState } from '../state/realState.js';

export function getHistory(): MarketState[] {
  return ['CLEAN', 'WAIT', 'NOISE', 'RISK'];
}
