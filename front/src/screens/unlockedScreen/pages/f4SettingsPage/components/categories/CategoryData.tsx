import { GeneralSettings } from "./GeneralSettings";
import { SystemConfiguration } from "./SystemConfiguration";

export const categories = [
  {
    categoryName: "General Settings",
    content: <GeneralSettings />,
  },
  {
    categoryName: "User Preferences",
  },
  {
    categoryName: "Privacy Settings",
  },
  {
    categoryName: "Accessibility Settings",
  },
  {
    categoryName: "Notification Settings",
  },
  {
    categoryName: "System Configuration",
    content: <SystemConfiguration />,
  },
];
