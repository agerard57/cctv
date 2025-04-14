import { Languages } from "@/providers";
import { Wallpapers } from "./Wallpapers";

export interface Settings {
  // TODO
  volume: number;
  // TODO
  brightness: number;
  // TODO
  wallpaper: Wallpapers;
  // TODO
  language: Languages;
  // TODO
  // TODO
  // TODO
  // TODO
  // TODO
}

export const SettingsInitializer: Settings = {
  volume: 100,
  brightness: 100,
  wallpaper: Wallpapers.DEFAULT,
  language: Languages.FR,
};
