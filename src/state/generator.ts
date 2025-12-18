import type { MarketState } from './realState.js';

const STATES: readonly MarketState[] = ['CLEAN', 'NOISE', 'WAIT', 'RISK'];

export function generateState(): MarketState {
  return STATES[Math.floor(Math.random() * STATES.length)];
}
