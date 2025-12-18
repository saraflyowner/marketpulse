export type MarketState = 'CLEAN'|'NOISE'|'WAIT'|'RISK';
export const generateState = (): MarketState => ['CLEAN','NOISE','WAIT','RISK'][Math.floor(Math.random()*4)];
