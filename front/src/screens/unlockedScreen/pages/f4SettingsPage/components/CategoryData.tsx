import { SettingsPageSections } from "../typings";
import { GeneralSettings } from "./GeneralSettings";
import { SystemConfiguration } from "./SystemConfiguration";

// TODO Maybe do the same with control page
export const categories = [
  {
    categoryName: SettingsPageSections.GENERAL_SETTINGS,
    content: <GeneralSettings />,
  },
  {
    categoryName: SettingsPageSections.USER_PREFERENCES,
  },
  {
    categoryName: SettingsPageSections.PRIVACY_SETTINGS,
  },
  {
    categoryName: SettingsPageSections.ACCESSIBILITY_SETTINGS,
  },
  {
    categoryName: SettingsPageSections.NOTIFICATION_SETTINGS,
  },
  {
    categoryName: SettingsPageSections.SYSTEM_CONFIGURATION,
    content: <SystemConfiguration />,
  },
];
