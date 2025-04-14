import { FC, useState, ReactNode, useCallback } from "react";
import { useConstants } from "@/providers";
import { i18n } from "@/providers/i18n";
import { isLanguageCode } from "../helpers";
import { Languages, Wallpapers } from "../typings";
import { Settings, SettingsInitializer } from "../typings";
import { SettingsContext } from "../contexts";

interface Props {
  children: ReactNode;
}

export const SettingsProvider: FC<Props> = ({ children }) => {
  const appConstants = useConstants();

  const [settings, setSettings] = useState<Settings>(SettingsInitializer);

  const setWallpaper = useCallback((value: Wallpapers) => {
    setSettings((prev) => ({ ...prev, wallpaper: value }));
    // TODO Make a logger that only logs if DEBUG_MODE is true
    appConstants.DEBUG_MODE && console.info(`Settings updated: wallpaper = ${value}`);
  }, []);

  const setBrightness = useCallback((value: number) => {
    setSettings((prev) => ({ ...prev, brightness: value }));
    // TODO Make a logger that only logs if DEBUG_MODE is true
    appConstants.DEBUG_MODE && console.info(`Settings updated: brightness = ${value}`);
  }, []);

  const setVolume = useCallback((value: number) => {
    setSettings((prev) => ({ ...prev, volume: value }));
    // TODO Make a logger that only logs if DEBUG_MODE is true
    appConstants.DEBUG_MODE && console.info(`Settings updated: volume = ${value}`);
  }, []);

  const setLanguage = useCallback((lang: Languages) => {
    if (!isLanguageCode(lang)) throw new Error(`Unknown language code: ${lang}`);
    i18n.changeLanguage(lang);
    setSettings((prev) => ({ ...prev, language: lang }));
    appConstants.DEBUG_MODE && console.info(`Language changed to: ${lang}`);
  }, []);

  i18n.on("languageChanged", (newLanguage: string) => {
    if (!isLanguageCode(newLanguage)) throw new Error(`Unknown language code: ${newLanguage}`);
    setSettings((prev) => ({ ...prev, language: newLanguage as Languages }));
  });

  const resetSettings = useCallback(() => {
    setSettings(SettingsInitializer);
    appConstants.DEBUG_MODE && console.info("Settings reset to initial state");
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setBrightness,
        setVolume,
        setWallpaper,
        setLanguage,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
