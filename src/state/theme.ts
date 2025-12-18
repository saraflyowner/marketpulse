import { MarketStateType } from "./realState";

export const Theme: Record<
  MarketStateType,
  { icon: string; label: string; risk: string }
> = {
  CLEAN: { icon: "🟢", label: "Clear Market", risk: "Low" },
  NOISE: { icon: "🟡", label: "Noisy", risk: "Medium" },
  WAIT:  { icon: "🔵", label: "Wait Mode", risk: "Controlled" },
  RISK:  { icon: "🔴", label: "High Risk", risk: "High" }
};
