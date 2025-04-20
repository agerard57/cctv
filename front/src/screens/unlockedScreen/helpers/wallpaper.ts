import { CatsWallpaper, DefaultWallpaper, LasVegasWallpaper, MoneyWallpaper, PokerWallpaper } from "@/core";
import { Wallpapers } from "@/providers";

type GetWallpaper = (wallpaper: Wallpapers) => string;

/**
 * Determines the wallpaper image based on the selected wallpaper type.
 * @param wallpaper - The selected wallpaper type.
 * @returns The corresponding wallpaper image url.
 */
export const getWallpaper: GetWallpaper = (wallpaper) => {
  switch (wallpaper) {
    case Wallpapers.MONEY:
      return MoneyWallpaper;
    case Wallpapers.LAS_VEGAS:
      return LasVegasWallpaper;
    case Wallpapers.CATS:
      return CatsWallpaper;
    case Wallpapers.POKER:
      return PokerWallpaper;
    default:
      return DefaultWallpaper;
  }
};
