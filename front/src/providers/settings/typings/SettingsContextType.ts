import { Languages, Wallpapers } from "../typings";
import { AppSettings, AppSettingsInitializer } from "./AppSettings";

export interface SettingsContextType {
  appSettings: AppSettings;
  setVolume: (value: number) => void;
  setBrightness: (value: number) => void;
  setWallpaper: (value: Wallpapers) => void;
  setLanguage: (lang: Languages) => void;
  resetSettings: () => void;
}

export const SettingsContextTypeInitializer: SettingsContextType = {
  appSettings: AppSettingsInitializer,
  setVolume: () => {},
  setBrightness: () => {},
  setWallpaper: () => {},
  setLanguage: () => {},
  resetSettings: () => {},
};
