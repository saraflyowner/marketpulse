export type MarketStateType = "CLEAN" | "NOISE" | "WAIT" | "RISK";

export class MarketState {
  static current(): MarketStateType {
    const states: MarketStateType[] = ["CLEAN", "NOISE", "WAIT", "RISK"];
    return states[Math.floor(Math.random() * states.length)];
  }
}
