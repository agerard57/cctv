import { Languages } from "@/providers";
import { Wallpapers } from "./Wallpapers";

export interface Settings {
  // TODO
  volume: number;
  brightness: number;
  wallpaper: Wallpapers;
  // TODO
  language: Languages;
}

export const SettingsInitializer: Settings = {
  volume: 100,
  brightness: 100,
  wallpaper: Wallpapers.DEFAULT,
  language: Languages.FR,
};
