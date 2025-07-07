import { FC, useState, ReactNode, useCallback, useEffect } from "react";
import { useConstants } from "@/providers";
import { i18n } from "@/providers/i18n";
import { isLanguageCode } from "../helpers";
import { Languages } from "../typings";
import { AppSettings, AppSettingsInitializer } from "../typings";
import { SettingsContext } from "../contexts";
import { logDebug } from "../../../core/helpers/logDebug";

interface Props {
  children: ReactNode;
}

export const SettingsProvider: FC<Props> = ({ children }) => {
  const appConstants = useConstants();

  const [appSettings, setAppSettings] = useState<AppSettings>(AppSettingsInitializer);

  const updateSettings = useCallback(
    <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      setAppSettings((prev) => ({ ...prev, [key]: value }));
      logDebug(appConstants.DEBUG_MODE, "SETTINGS", `${key}: ${value}`);
    },
    [appConstants.DEBUG_MODE],
  );

  const setLanguage = useCallback(
    (lang: Languages) => {
      if (!isLanguageCode(lang)) throw new Error(`Unknown language code: ${lang}`);
      i18n.changeLanguage(lang);
      updateSettings("language", lang);
    },
    [updateSettings],
  );

  useEffect(() => {
    const handleLangChange = (newLanguage: string) => {
      if (!isLanguageCode(newLanguage)) throw new Error(`Unknown language code: ${newLanguage}`);
      updateSettings("language", newLanguage as Languages);
    };
    i18n.on("languageChanged", handleLangChange);
    return () => {
      i18n.off("languageChanged", handleLangChange);
    };
  }, [updateSettings]);

  const resetSettings = useCallback(() => {
    setAppSettings(AppSettingsInitializer);
    logDebug(appConstants.DEBUG_MODE, "SETTINGS", "Reset to initial state");
  }, [appConstants.DEBUG_MODE]);

  return (
    <SettingsContext.Provider
      value={{
        appSettings,
        setWallpaper: (value) => updateSettings("wallpaper", value),
        setBrightness: (value) => updateSettings("brightness", value),
        setVolume: (value) => updateSettings("volume", value),
        setLanguage,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
