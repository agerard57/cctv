import { FC, useEffect } from "react";
import styled from "@emotion/styled";
import { SettingsCategory } from "./SettingsCategory";
import { Languages, useKeyDown, useSettings, Wallpapers } from "@/providers";
import { enableIconlessKeys, SupportedKeys, useKeyState } from "@/providers";
import { PgDnKeyIcon, PgUpKeyIcon } from "../../f1ReplayManagerPage/assets";
import { useTranslation } from "react-i18next";

export const SettingsCategoryContainer = styled.div`
  margin: 4vh 0;
`;

export const GeneralSettings: FC = () => {
  const { t } = useTranslation("SettingsPage");
  // General Settings
  const { settings, setLanguage, setWallpaper, setBrightness, setVolume } = useSettings();

  useKeyDown({
    2: () => {
      // Decrement volume
      const newVolume = Math.max(settings.volume - 5, 0);
      setVolume(newVolume);
    },
    3: () => {
      // Increment volume
      const newVolume = Math.min(settings.volume + 5, 100);
      setVolume(newVolume);
    },
    4: () => {
      // Decrement brightness
      const newBrightness = Math.max(settings.brightness - 5, 40);
      setBrightness(newBrightness);
    },
    5: () => {
      // Increment brightness
      const newBrightness = Math.min(settings.brightness + 5, 100);
      setBrightness(newBrightness);
    },
    9: () => {
      const wallpaperOptions = Object.values(Wallpapers);
      const currentWallpaperIndex = wallpaperOptions.indexOf(settings.wallpaper);
      const nextWallpaperIndex = (currentWallpaperIndex + 1) % wallpaperOptions.length;

      setWallpaper(wallpaperOptions[nextWallpaperIndex]);
    },
    "#": () => {
      const newLanguage = settings.language === Languages.FR ? Languages.EN : Languages.FR;

      setLanguage(newLanguage);
    },
  });

  const generalSettings = [
    { label: t("generalSettings.darkMode"), type: "toggle", value: true },
    {
      label: t("generalSettings.volume"),
      type: "slider",
      value: settings.volume,
      onChange: (value: number) => setVolume(value),
      min: 0,
      max: 100,
      keyboardShortcut: ["2", "3"], // Left: Increment, Right: Decrement
    },
    {
      label: t("generalSettings.brightness"),
      type: "slider",
      value: settings.brightness,
      onChange: (value: number) => setBrightness(value),
      min: 40,
      max: 100,
      keyboardShortcut: ["4", "5"], // Left: Increment, Right: Decrement
    },
  ];

  const displaySettings = [
    { label: t("generalSettings.displaySettings.screenSaver"), type: "toggle", value: 0 },
    {
      label: t("generalSettings.displaySettings.wallpaper"),
      type: "select",
      // TODO Infer type T
      value: settings.wallpaper,
      onChange: (value: Wallpapers) => {
        setWallpaper(value);
      },
      options: [
        { value: Wallpapers.DEFAULT, label: t("generalSettings.displaySettings.wallpaperOptions.default") },
        { value: Wallpapers.LAS_VEGAS, label: t("generalSettings.displaySettings.wallpaperOptions.lasVegas") },
        { value: Wallpapers.MONEY, label: t("generalSettings.displaySettings.wallpaperOptions.money") },
        { value: Wallpapers.CATS, label: t("generalSettings.displaySettings.wallpaperOptions.cats") },
      ],
      keyboardShortcut: ["9"],
    },
    {
      label: t("generalSettings.displaySettings.screenResolution"),
      type: "select",
      value: "4k",
      options: [{ value: "4k", label: t("generalSettings.displaySettings.resolutionOptions.4k") }],
    },
    {
      label: t("generalSettings.displaySettings.refreshRate"),
      type: "slider",
      value: 23,
    },
  ];

  const regionalSettings = [
    {
      label: t("generalSettings.regionalSettings.timezone"),
      type: "select",
      // TODO The first shown language should be the one set in the settings
      value: settings.language === Languages.FR ? "utc" : "est",
      options: [
        { value: "utc", label: t("generalSettings.regionalSettings.timezoneOptions.utc") },
        { value: "est", label: t("generalSettings.regionalSettings.timezoneOptions.est") },
      ],
    },
    {
      label: t("generalSettings.regionalSettings.language"),
      type: "select",
      // TODO The first shown language should be the one set in the settings
      // default: settings.language
      value: settings.language,
      onChange: (lang: Languages) => setLanguage(lang),
      options: [
        { value: Languages.FR, label: t("generalSettings.regionalSettings.languageOptions.french") },
        { value: Languages.EN, label: t("generalSettings.regionalSettings.languageOptions.english") },
      ],
      keyboardShortcut: ["#"],
    },
    {
      label: t("generalSettings.regionalSettings.keyboardLayout"),
      type: "select",
      value: "t9",
      options: [{ value: "t9", label: t("generalSettings.regionalSettings.keyboardOptions.t9") }],
    },
    { label: t("generalSettings.regionalSettings.autoCorrect"), type: "toggle", value: 0 },
  ];

  const securitySettings = [
    { label: t("generalSettings.securitySettings.gestureControl"), type: "toggle", value: 0 },
    { label: t("generalSettings.securitySettings.faceRecognition"), type: "toggle", value: 0 },
    {
      label: t("generalSettings.securitySettings.unlockMethod"),
      type: "select",
      value: "both",
      options: [{ value: "both", label: t("generalSettings.securitySettings.unlockOptions.both") }],
    },
  ];

  const { updateKeyState, resetKeyStates } = useKeyState();

  useEffect(() => {
    updateKeyState({
      ...enableIconlessKeys([
        SupportedKeys.DIGIT_2,
        SupportedKeys.DIGIT_3,
        SupportedKeys.DIGIT_4,
        SupportedKeys.DIGIT_5,
        SupportedKeys.DIGIT_9,
        SupportedKeys.HASH,
      ]),
      PageUp: PgUpKeyIcon,
      PageDown: PgDnKeyIcon,
    });
    return () => {
      resetKeyStates();
    };
  }, [updateKeyState, resetKeyStates]);

  return (
    <SettingsCategoryContainer>
      <SettingsCategory settings={generalSettings} />
      <SettingsCategory title={t("generalSettings.displaySettings.title")} settings={displaySettings} />
      <SettingsCategory title={t("generalSettings.regionalSettings.title")} settings={regionalSettings} />
      <SettingsCategory title={t("generalSettings.securitySettings.title")} settings={securitySettings} />
    </SettingsCategoryContainer>
  );
};
