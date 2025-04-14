import { FC } from "react";
import { SystemConfiguration } from "./categories/SystemConfiguration";
import { CategoryLayout } from "../../..";

const categories = [
  {
    categoryName: "General Settings",
    // TODO Change
    content: <SystemConfiguration />,
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

export const SettingsPage: FC = () => <CategoryLayout categories={categories} />;
