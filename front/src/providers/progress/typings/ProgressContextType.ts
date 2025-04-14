import { Progress, ProgressInitializer } from "./Progress";

export interface ProgressContextType {
  progress: Progress;
  setSessionUnlocked: (value: boolean) => void;
  setMediaProvided: (value: boolean) => void;
  setCaptchaSolved: (value: boolean) => void;
  setElectricalOutletDisconnected: (value: boolean) => void;
  setCCTVSystemDown: (value: boolean) => void;
  resetProgress: () => void;
}

export const ProgressContextTypeInitializer: ProgressContextType = {
  progress: ProgressInitializer,
  setSessionUnlocked: () => {},
  setMediaProvided: () => {},
  setCaptchaSolved: () => {},
  setElectricalOutletDisconnected: () => {},
  setCCTVSystemDown: () => {},
  resetProgress: () => {},
};
