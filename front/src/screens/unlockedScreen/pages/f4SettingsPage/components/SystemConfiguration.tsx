import { FC, useEffect, useState } from "react";
import { Button, Box, Snackbar } from "@mui/material";
import { SettingsCategory } from "./SettingsCategory";
import { SettingsCategoryContainer } from "./GeneralSettings";
import { enableIconlessKeys, SupportedKeys, useKeyDown, useKeyState } from "../../../../../providers/keyState";
import { PgDnKeyIcon, PgUpKeyIcon } from "../../f1ReplayManagerPage/assets";
import { ProgressDialog, ShortcutChip } from "../../../components";
import { SystemConfigurationDialog } from "./SystemConfigurationDialog";
import { ElectricalServices } from "@mui/icons-material";
import { useProgress } from "../../../../../providers";
import { useTranslation } from "react-i18next";

export const SystemConfiguration: FC = () => {
  const { t } = useTranslation("SettingsPage");
  const [showSuccess, setShowSuccess] = useState(false);

  const [energySaver, setEnergySaver] = useState<boolean>(false);
  const [autoUpdates, setAutoUpdates] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [progressDialogOpen, setProgressDialogOpen] = useState<boolean>(false);
  const { progress, setCCTVSystemDown } = useProgress();

  const handleCheckUpdates = () => {
    alert(t("systemConfiguration.checkingUpdates"));
  };

  const handleManageStorage = () => {
    alert(t("systemConfiguration.openingStorage"));
  };

  const handleResetSystem = () => {
    setDialogOpen(true); // Open the dialog for keycard validation
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleAuthenticationSuccess = () => {
    console.log("SystemConfiguration: handleAuthenticationSuccess called"); // Debug log
    setDialogOpen(false);
    setProgressDialogOpen(true);
  };

  const handleProgressDone = () => {
    console.log("SystemConfiguration: handleProgressDone called"); // Debug log
    setProgressDialogOpen(false);
    setCCTVSystemDown(true);
    setShowSuccess(true);
  };

  const systemConfiguration = [
    {
      label: t("systemConfiguration.energySaverMode"),
      type: "toggle",
      value: energySaver,
      onClick: setEnergySaver,
      keyboardShortcut: "1",
    },
    {
      label: t("systemConfiguration.autoUpdates"),
      type: "toggle",
      value: autoUpdates,
      onClick: setAutoUpdates,
      keyboardShortcut: "3",
    },
    {
      label: t("systemConfiguration.storageManagement"),
      type: "button",
      onClick: handleManageStorage,
      value: null,
    },
    {
      label: t("systemConfiguration.checkForUpdates"),
      type: "button",
      onClick: handleCheckUpdates,
      keyboardShortcut: "6",
      value: null,
    },
    {
      label: t("systemConfiguration.statsForNerds"),
      type: "toggle",
      value: 0,
    },
    {
      label: t("systemConfiguration.backupFrequency"),
      type: "select",
      value: "daily",
      options: [{ value: "daily", label: t("systemConfiguration.daily") }],
    },
  ];

  useKeyDown(
    {
      1: () => {
        setEnergySaver((prev) => !prev);
      },
      3: () => {
        setAutoUpdates((prev) => !prev);
      },
      6: () => {
        handleCheckUpdates();
      },
      7: () => {
        if (!progress.isCCTVSystemDown) {
          handleResetSystem();
        }
      },
    },
    undefined,
    [progress.isCCTVSystemDown],
  );

  const { updateKeyState, resetKeyStates } = useKeyState();

  useEffect(() => {
    updateKeyState({
      ...enableIconlessKeys([
        SupportedKeys.DIGIT_1,
        SupportedKeys.DIGIT_3,
        SupportedKeys.DIGIT_6,
        ...(!progress.isCCTVSystemDown ? [SupportedKeys.DIGIT_7] : []),
      ]),
      PageUp: PgUpKeyIcon,
      PageDown: PgDnKeyIcon,
    });
    return () => {
      resetKeyStates();
    };
  }, [updateKeyState, resetKeyStates]);

  return (
    <>
      <SystemConfigurationDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSuccess={handleAuthenticationSuccess}
      />

      <ProgressDialog
        open={progressDialogOpen}
        title={
          <>
            {/* TODO Change icon */}
            <ElectricalServices />
            {t("systemConfiguration.shuttingDown")}
          </>
        }
        messages={[
          t("systemConfiguration.initializeShutdown"),
          t("systemConfiguration.disconnectingNetwork"),
          t("systemConfiguration.savingState"),
          t("systemConfiguration.poweringDown"),
          t("systemConfiguration.finalizingShutdown"),
        ]}
        onProgressDone={handleProgressDone} // Ensure this is passed
      />

      <SettingsCategoryContainer>
        <SettingsCategory settings={systemConfiguration} />
        {!progress.isCCTVSystemDown && (
          <Box marginY={2}>
            <Button variant="contained" color="error" onClick={handleResetSystem}>
              {t("systemConfiguration.shutdownSystem")}
            </Button>
            <ShortcutChip shortcut="7" />
          </Box>
        )}
      </SettingsCategoryContainer>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        message={t("systemConfiguration.shutdownSuccess")}
      />
    </>
  );
};
