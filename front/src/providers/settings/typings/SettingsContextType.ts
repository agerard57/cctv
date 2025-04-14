import { Languages, Wallpapers } from "../typings";
import { Settings, SettingsInitializer } from "./Settings";

export interface SettingsContextType {
  settings: Settings;
  setVolume: (value: number) => void;
  setBrightness: (value: number) => void;
  setWallpaper: (value: Wallpapers) => void;
  setLanguage: (lang: Languages) => void;
  resetSettings: () => void;
}

export const SettingsContextTypeInitializer: SettingsContextType = {
  settings: SettingsInitializer,
  setVolume: () => {},
  setBrightness: () => {},
  setWallpaper: () => {},
  setLanguage: () => {},
  resetSettings: () => {},
};
