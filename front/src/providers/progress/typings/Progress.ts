export interface Progress {
  isSessionUnlocked: boolean;
  isMediaProvided: boolean;
  isCaptchaSolved: boolean;
  isAdminModeEnabled: boolean;
  isElectricalOutletDisconnected: boolean;
  isAdvancedSettingsGranted: boolean;
  isCCTVSystemDown: boolean;
}

export const ProgressInitializer: Progress = {
  isSessionUnlocked: false,
  isMediaProvided: false,
  isCaptchaSolved: false,
  isAdminModeEnabled: false,
  isElectricalOutletDisconnected: false,
  isAdvancedSettingsGranted: false,
  isCCTVSystemDown: false,
};
