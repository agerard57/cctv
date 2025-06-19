import { FC, useEffect, useState } from "react";
import { AdvancedSettings } from "./AdvancedSettings";
import { SettingsPageSections } from "../typings";
import { CategoryLayout } from "../../../components";
import { GeneralSettings } from "./GeneralSettings";
import { useProgress, useSettings } from "@/providers";
import { AdvancedSettingsDialog } from "./AdvancedSettingsDialog";
import { playSound } from "@/core";
import { CaptchaSuccessSFX } from "../../f2UserManagerPage/assets";

export const SettingsPage: FC = () => {
  const { progress, setAdvancedSettingsGranted } = useProgress();
  const { appSettings } = useSettings();

  const [dialogOpen, setDialogOpen] = useState(!progress.isAdvancedSettingsGranted);

  const handleSuccess = () => {
    setAdvancedSettingsGranted(true);
    // TODO refactor the import
    playSound(CaptchaSuccessSFX, appSettings.volume);
  };

  useEffect(() => {
    if (progress.isAdvancedSettingsGranted) {
      setDialogOpen(false);
    }
  }, [progress.isAdvancedSettingsGranted]);

  const categories = [
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
      content: <AdvancedSettings />,
      dialog: (
        <AdvancedSettingsDialog
          open={dialogOpen}
          onSuccess={handleSuccess}
        />
      ),
    },
  ];

  return <CategoryLayout<SettingsPageSections> categories={categories} namespace={"SettingsPage"} />;
};
