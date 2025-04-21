import { Languages } from "@/providers";
import { Wallpapers } from "./Wallpapers";
import { i18n } from "@/providers/i18n";

export interface AppSettings {
  volume: number;
  brightness: number;
  wallpaper: Wallpapers;
  language: Languages;
}

export const AppSettingsInitializer: AppSettings = {
  // PROD 100
  volume: 50,
  brightness: 100,
  wallpaper: Wallpapers.DEFAULT,
  language: i18n.language as Languages,
};
