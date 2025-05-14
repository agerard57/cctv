import { FC, useEffect, useState } from "react";
import { Button, Box, Snackbar, LinearProgress } from "@mui/material";
import { SettingsCategory } from "./SettingsCategory";
import { SettingsCategoryContainer } from "./GeneralSettings";
import { enableIconlessKeys, SupportedKeys, useKeyDown, useKeyState } from "../../../../../providers/keyState";
import { PgDnKeyIcon, PgUpKeyIcon } from "../../f1ReplayManagerPage/assets";
import { ProgressDialog, ShortcutChip } from "../../../components";
import { SystemConfigurationDialog } from "./SystemConfigurationDialog";
import { PowerOff } from "@mui/icons-material";
import { useProgress, useSettings } from "../../../../../providers";
import { useTranslation } from "react-i18next";
import { SettingProps } from "./Setting";
import { ButtonOffSFX, ButtonOnSFX, ProgressDoneSFX } from "../../../assets/sfx";
import { playSound } from "../../../../../core";

// PROD We have to add a screen after shutdown with snow
export const SystemConfiguration: FC = () => {
  const { t } = useTranslation("SettingsPage");
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; progress?: boolean }>({
    open: false,
    message: "",
    progress: false,
  });
  const [energySaver, setEnergySaver] = useState(false);
  const [autoUpdates, setAutoUpdates] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [checkUpdatesDisabled, setCheckUpdatesDisabled] = useState(false);
  const { progress, setCCTVSystemDown } = useProgress();
  const { appSettings, setBrightness } = useSettings();
  const { updateKeyState, resetKeyStates } = useKeyState();

  const showSnackbar = (message: string, progress = false, duration = 3000) => {
    setSnackbar({ open: true, message, progress });
    setTimeout(() => setSnackbar({ open: false, message: "", progress: false }), duration);
  };

  const handleCheckUpdates = () => {
    if (checkUpdatesDisabled) return;

    showSnackbar(t("systemConfiguration.checkingUpdates"), true, 3000);
    setTimeout(() => {
      showSnackbar(t("systemConfiguration.noUpdatesAvailable"), false, 5000);
      playSound(ProgressDoneSFX, appSettings.volume);
      setCheckUpdatesDisabled(true);
    }, 3000);
  };

  const handleResetSystem = () => {
    setDialogOpen(true);
  };

  const authenticate = () => {
    setDialogOpen(false);
    setProgressDialogOpen(true);
  };

  const handleProgressDone = () => {
    setProgressDialogOpen(false);
    setCCTVSystemDown(true);
    showSnackbar(t("systemConfiguration.shutdownSuccess"));
  };

  const systemConfiguration: SettingProps[] = [
    {
      label: t("systemConfiguration.energySaverMode"),
      type: "toggle",
      value: energySaver,
      keyboardShortcut: ["1"],
    },
    {
      label: t("systemConfiguration.autoUpdates"),
      type: "toggle",
      value: autoUpdates,
      keyboardShortcut: ["3"],
    },
    {
      label: t("systemConfiguration.storageManagement"),
      type: "button",
      value: null,
    },
    {
      label: t("systemConfiguration.checkForUpdates"),
      type: "button",
      value: null,
      keyboardShortcut: checkUpdatesDisabled ? undefined : ["6"],
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
        showSnackbar(
          energySaver ? t("systemConfiguration.energySaverDisabled") : t("systemConfiguration.energySaverEnabled"),
        );
        !energySaver ? setBrightness(60) : setBrightness(100);
        playSound(!energySaver ? ButtonOnSFX : ButtonOffSFX, appSettings.volume);
      },
      3: () => {
        setAutoUpdates((prev) => !prev);
        showSnackbar(
          autoUpdates ? t("systemConfiguration.autoUpdatesDeactivated") : t("systemConfiguration.autoUpdatesActivated"),
        );
        playSound(!autoUpdates ? ButtonOnSFX : ButtonOffSFX, appSettings.volume);
      },
      6: () => {
        if (!checkUpdatesDisabled) handleCheckUpdates();
        playSound(energySaver ? ButtonOnSFX : ButtonOffSFX, appSettings.volume);
        playSound(ButtonOnSFX, appSettings.volume);
      },
      7: () => {
        if (!progress.isCCTVSystemDown) {
          playSound(ButtonOnSFX, appSettings.volume);
          handleResetSystem();
        }
      },
    },
    undefined,
    [progress.isCCTVSystemDown, checkUpdatesDisabled],
  );

  useEffect(() => {
    updateKeyState({
      ...enableIconlessKeys([
        SupportedKeys.DIGIT_1,
        SupportedKeys.DIGIT_3,
        ...(!checkUpdatesDisabled ? [SupportedKeys.DIGIT_6] : []),
        ...(!progress.isCCTVSystemDown ? [SupportedKeys.DIGIT_7] : []),
      ]),
      PageUp: PgUpKeyIcon,
      PageDown: PgDnKeyIcon,
    });
    return () => {
      resetKeyStates();
    };
  }, [updateKeyState, resetKeyStates, progress.isCCTVSystemDown, checkUpdatesDisabled]);

  return (
    <>
      <SystemConfigurationDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSuccess={authenticate} />

      <ProgressDialog
        open={progressDialogOpen}
        title={
          <>
            <PowerOff />
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
        onProgressDone={handleProgressDone}
      />

      <SettingsCategoryContainer>
        <SettingsCategory settings={systemConfiguration} />
        <Box style={{ padding: "0 1vw" }}>
          <Button variant="contained" color="error" onClick={handleResetSystem} disabled={progress.isCCTVSystemDown}>
            {t("systemConfiguration.shutdownSystem")}
          </Button>
          {!progress.isCCTVSystemDown && <ShortcutChip shortcut="7" />}
        </Box>
      </SettingsCategoryContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.progress ? null : 5000}
        onClose={() => setSnackbar({ open: false, message: "", progress: false })}
        message={
          snackbar.progress ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column", // Change to column to stack elements vertically
                alignItems: "flex-start", // Align items to the left
                gap: "10px", // Add spacing between the title and progress bar
              }}
            >
              <span>{snackbar.message}</span>
              <LinearProgress
                color="primary" // Use the primary color from the MUI theme
                sx={{
                  width: "100%", // Make the progress bar take full width
                  height: "4px", // Set a height for better visibility
                }}
              />
            </Box>
          ) : (
            snackbar.message
          )
        }
      />
    </>
  );
};
