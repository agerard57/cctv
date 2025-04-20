import { FC, useEffect } from "react";
import styled from "@emotion/styled";
import { SettingsCategory } from "./SettingsCategory";
import { Languages, useKeyDown, useSettings, Wallpapers } from "@/providers";
import { enableIconlessKeys, SupportedKeys, useKeyState } from "@/providers";
import { PgDnKeyIcon, PgUpKeyIcon } from "../../f1ReplayManagerPage/assets";
import { useTranslation } from "react-i18next";
import { SettingProps } from "./Setting";

export const SettingsCategoryContainer = styled.div`
  margin: 4vh 0;
`;

export const GeneralSettings: FC = () => {
  const { t } = useTranslation("SettingsPage");

  const { appSettings, setLanguage, setWallpaper, setBrightness, setVolume } = useSettings();

  useKeyDown({
    2: () => {
      const newVolume = Math.max(appSettings.volume - 5, 0);
      setVolume(newVolume);
    },
    3: () => {
      const newVolume = Math.min(appSettings.volume + 5, 100);
      setVolume(newVolume);
    },
    4: () => {
      const newBrightness = Math.max(appSettings.brightness - 5, 40);
      setBrightness(newBrightness);
    },
    5: () => {
      const newBrightness = Math.min(appSettings.brightness + 5, 100);
      setBrightness(newBrightness);
    },
    9: () => {
      const wallpaperOptions = Object.values(Wallpapers);
      const currentWallpaperIndex = wallpaperOptions.indexOf(appSettings.wallpaper);
      const nextWallpaperIndex = (currentWallpaperIndex + 1) % wallpaperOptions.length;

      setWallpaper(wallpaperOptions[nextWallpaperIndex]);
    },
    "#": () => {
      const newLanguage = appSettings.language === Languages.FR ? Languages.EN : Languages.FR;

      setLanguage(newLanguage);
    },
  });

  const generalSettings: SettingProps[] = [
    { label: t("generalSettings.darkMode"), type: "toggle", value: true },
    {
      // TODO Add SFX
      label: t("generalSettings.volume"),
      type: "slider",
      value: appSettings.volume,
      onChange: (value: number) => setVolume(value),
      min: 0,
      max: 100,
      keyboardShortcut: ["2", "3"],
    },
    {
      label: t("generalSettings.brightness"),
      type: "slider",
      value: appSettings.brightness,
      onChange: (value: number) => setBrightness(value),
      min: 40,
      max: 100,
      keyboardShortcut: ["4", "5"],
    },
  ];

  const displaySettings: SettingProps[] = [
    { label: t("generalSettings.displaySettings.screenSaver"), type: "toggle", value: 0 },
    {
      label: t("generalSettings.displaySettings.wallpaper"),
      type: "select",
      value: appSettings.wallpaper,
      onChange: (value: Wallpapers) => {
        setWallpaper(value);
      },
      options: [
        { value: Wallpapers.DEFAULT, label: t("generalSettings.displaySettings.wallpaperOptions.default") },
        { value: Wallpapers.LAS_VEGAS, label: t("generalSettings.displaySettings.wallpaperOptions.lasVegas") },
        { value: Wallpapers.MONEY, label: t("generalSettings.displaySettings.wallpaperOptions.money") },
        { value: Wallpapers.POKER, label: t("generalSettings.displaySettings.wallpaperOptions.poker") },
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

  const regionalSettings: SettingProps[] = [
    {
      label: t("generalSettings.regionalSettings.timezone"),
      type: "select",
      value: appSettings.language === Languages.FR ? "utc" : "est",
      options: [
        { value: "utc", label: t("generalSettings.regionalSettings.timezoneOptions.utc") },
        { value: "est", label: t("generalSettings.regionalSettings.timezoneOptions.est") },
      ],
    },
    {
      label: t("generalSettings.regionalSettings.language"),
      type: "select",
      value: appSettings.language,
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

  const securitySettings: SettingProps[] = [
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
