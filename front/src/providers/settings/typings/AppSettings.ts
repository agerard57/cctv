import { Languages } from "@/providers";
import { Wallpapers } from "./Wallpapers";

export interface AppSettings {
  volume: number;
  brightness: number;
  wallpaper: Wallpapers;
  // TODO
  language: Languages;
}

export const AppSettingsInitializer: AppSettings = {
  volume: 50,
  brightness: 100,
  wallpaper: Wallpapers.DEFAULT,
  language: Languages.FR,
};
