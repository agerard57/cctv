export interface Progress {
  isSessionUnlocked: boolean;
  isMediaProvided: boolean;
  isCaptchaSolved: boolean;
  isElectricalOutletDisconnected: boolean;
  isCCTVSystemDown: boolean;
}

export const ProgressInitializer: Progress = {
  isSessionUnlocked: false,
  isMediaProvided: false,
  isCaptchaSolved: false,
  isElectricalOutletDisconnected: false,
  isCCTVSystemDown: false,
};
