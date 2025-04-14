import { FC, useEffect } from "react";
import styled from "@emotion/styled";
import { SettingsCategory } from "./SettingsCategory";
import { Languages, useKeyDown, useSettings, Wallpapers } from "../../../../../../providers";
import { enableIconlessKeys, SupportedKeys, useKeyState } from "../../../../../../providers/keyState";
import { PgDnKeyIcon, PgUpKeyIcon } from "../../../f1ReplayManagerPage/assets";

export const SettingsCategoryContainer = styled.div`
  margin: 4vh 0;
`;

export const GeneralSettings: FC = () => {
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
    { label: "Dark Mode", type: "toggle", value: true },
    {
      label: "Volume",
      type: "slider",
      value: settings.volume,
      onChange: (value: number) => setVolume(value),
      min: 0,
      max: 100,
      keyboardShortcut: ["2", "3"], // Left: Increment, Right: Decrement
    },
    {
      label: "Brightness",
      type: "slider",
      value: settings.brightness,
      onChange: (value: number) => setBrightness(value),
      min: 40,
      max: 100,
      keyboardShortcut: ["4", "5"], // Left: Increment, Right: Decrement
    },
  ];

  const displaySettings = [
    { label: "Screen Saver", type: "toggle", value: 0 },
    {
      label: "Wallpaper",
      type: "select",
      // TODO Infer type T
      value: settings.wallpaper,
      onChange: (value: Wallpapers) => {
        setWallpaper(value);
      },
      options: [
        { value: Wallpapers.DEFAULT, label: "Default" },
        { value: Wallpapers.LAS_VEGAS, label: "Las Vegas" },
        { value: Wallpapers.MONEY, label: "Money" },
        { value: Wallpapers.CATS, label: "Cats" },
      ],
      keyboardShortcut: ["9"],
    },
    {
      label: "Screen Resolution",
      type: "select",
      value: "4k",
      options: [{ value: "4k", label: "4K" }],
    },
    {
      label: "Refresh Rate",
      type: "slider",
      value: 23,
    },
  ];

  const regionalSettings = [
    {
      label: "Timezone",
      type: "select",
      // TODO The first shown language should be the one set in the settings
      value: settings.language === Languages.FR ? "utc" : "est",
      options: [
        { value: "utc", label: "UTC" },
        { value: "est", label: "EST" },
      ],
    },
    {
      label: "Language",
      type: "select",
      // TODO The first shown language should be the one set in the settings
      // default: settings.language
      value: settings.language,
      onChange: (lang: Languages) => setLanguage(lang),
      options: [
        { value: Languages.FR, label: "French" },
        { value: Languages.EN, label: "English" },
      ],
      keyboardShortcut: ["#"],
    },
    {
      label: "Keyboard Layout",
      type: "select",
      value: "t9",
      options: [{ value: "t9", label: "Multi-tap keypad" }],
    },
    { label: "Auto-Correct", type: "toggle", value: 0 },
  ];

  const securitySettings = [
    { label: "Gesture Control", type: "toggle", value: 0 },
    { label: "Face Recognition", type: "toggle", value: 0 },
    {
      label: "Unlock method",
      type: "select",
      value: "both",
      options: [{ value: "both", label: "Card + Pin" }],
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
      <SettingsCategory title="Display Settings" settings={displaySettings} />
      <SettingsCategory title="Regional Settings" settings={regionalSettings} />
      <SettingsCategory title="Security Settings" settings={securitySettings} />
    </SettingsCategoryContainer>
  );
};
