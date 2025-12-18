import type { MarketState } from './realState.js';

export type Theme = 'CALM' | 'TENSE' | 'TRANSITION';

export function resolveTheme(state: MarketState): Theme {
  switch (state) {
    case 'CLEAN':
      return 'CALM';
    case 'WAIT':
      return 'TRANSITION';
    case 'NOISE':
    case 'RISK':
      return 'TENSE';
  }
}
