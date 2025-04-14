import { Core } from "@/core/i18n";
import { LockedScreen } from "@/screens/lockedScreen/i18n";
import { UnlockedScreen } from "@/screens/unlockedScreen/i18n";
import { ReplayManagerPage } from "@/screens/unlockedScreen/pages/f1ReplayManagerPage/i18n";
import { UserManagerPage } from "@/screens/unlockedScreen/pages/f2UserManagerPage/i18n";
import { ControlCenterPage } from "@/screens/unlockedScreen/pages/f3ControlCenterPage/i18n";
import { SettingsPage } from "@/screens/unlockedScreen/pages/f4SettingsPage/i18n";

import { Languages } from "../settings";

type ModuleNames =
  | "Core"
  | "LockedScreen"
  | "UnlockedScreen"
  | "ControlCenterPage"
  | "ReplayManagerPage"
  | "SettingsPage"
  | "UserManagerPage";

type Modules = Record<ModuleNames, Record<Languages, Record<string, any>>>;

const normalize = (modules: Modules, formatNamespace: (name: ModuleNames) => string = (name) => name) =>
  Object.entries(modules).reduce(
    (acc, [namespace, translations]) => ({
      fr: {
        ...acc[Languages.FR],
        [formatNamespace(namespace as ModuleNames)]: translations[Languages.FR],
      },
      en: {
        ...acc[Languages.EN],
        [formatNamespace(namespace as ModuleNames)]: translations[Languages.EN],
      },
    }),
    { fr: {}, en: {} },
  );

const moduleResources = normalize({
  Core,
  LockedScreen,
  UnlockedScreen,
  ControlCenterPage,
  ReplayManagerPage,
  SettingsPage,
  UserManagerPage,
});

export const resources: Record<Languages, Record<string, any>> = {
  fr: { ...moduleResources[Languages.FR] },
  en: { ...moduleResources[Languages.EN] },
};
