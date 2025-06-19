import { FC, useEffect, useState } from "react";
import { Button, Box, Snackbar, LinearProgress } from "@mui/material";
import { SettingsCategory } from "./SettingsCategory";
import { SettingsCategoryContainer } from "./GeneralSettings";
import { enableIconlessKeys, SupportedKeys, useKeyDown, useKeyState } from "../../../../../providers/keyState";
import { PgDnKeyIcon, PgUpKeyIcon } from "../../f1ReplayManagerPage/assets";
import { ProgressDialog, ShortcutChip } from "../../../components";
import { PowerOff } from "@mui/icons-material";
import { useProgress, useSettings } from "../../../../../providers";
import { useTranslation } from "react-i18next";
import { SettingProps } from "./Setting";
import { ProgressDoneSFX } from "../../../assets/sfx";
import { playSound } from "../../../../../core";

// PROD We have to add a screen after shutdown with snow
export const AdvancedSettings: FC = () => {
  const { t } = useTranslation("SettingsPage");
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; progress?: boolean }>({
    open: false,
    message: "",
    progress: false,
  });
  const [energySaver, setEnergySaver] = useState(false);
  const [autoUpdates, setAutoUpdates] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
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

    showSnackbar(t("advancedSettings.checkingUpdates"), true, 3000);
    setTimeout(() => {
      showSnackbar(t("advancedSettings.noUpdatesAvailable"), false, 5000);
      playSound(ProgressDoneSFX, appSettings.volume);
      setCheckUpdatesDisabled(true);
    }, 3000);
  };

  const handleProgressDone = () => {
    setDialogOpen(false);
    setCCTVSystemDown(true);
    showSnackbar(t("advancedSettings.shutdownSuccess"));
  };

  const advancedSettings: SettingProps[] = [
    {
      label: t("advancedSettings.energySaverMode"),
      type: "toggle",
      value: energySaver,
      keyboardShortcut: ["1"],
    },
    {
      label: t("advancedSettings.autoUpdates"),
      type: "toggle",
      value: autoUpdates,
      keyboardShortcut: ["3"],
    },
    {
      label: t("advancedSettings.storageManagement"),
      type: "button",
      value: null,
    },
    {
      label: t("advancedSettings.checkForUpdates"),
      type: "button",
      value: null,
      keyboardShortcut: checkUpdatesDisabled ? undefined : ["6"],
    },
    {
      label: t("advancedSettings.statsForNerds"),
      type: "toggle",
      value: 0,
    },
    {
      label: t("advancedSettings.backupFrequency"),
      type: "select",
      value: "daily",
      options: [{ value: "daily", label: t("advancedSettings.daily") }],
    },
  ];

  useKeyDown(
    progress.isAdvancedSettingsGranted
      ? {
        1: () => {
          setEnergySaver((prev) => !prev);
          showSnackbar(
            energySaver
              ? t("advancedSettings.energySaverDisabled")
              : t("advancedSettings.energySaverEnabled"),
          );
          !energySaver ? setBrightness(60) : setBrightness(100);
        },
        3: () => {
          setAutoUpdates((prev) => !prev);
          showSnackbar(
            autoUpdates
              ? t("advancedSettings.autoUpdatesDeactivated")
              : t("advancedSettings.autoUpdatesActivated"),
          );
        },
        6: () => {
          if (!checkUpdatesDisabled) handleCheckUpdates();
        },
        7: () => {
          if (!progress.isCCTVSystemDown) setDialogOpen(true);
        },
      }
      : {},
    undefined,
    [
      progress.isAdvancedSettingsGranted,
      progress.isCCTVSystemDown,
      checkUpdatesDisabled,
    ],
  );

  useEffect(() => {
    const digitKeys = progress.isAdvancedSettingsGranted
      ? [
        SupportedKeys.DIGIT_1,
        SupportedKeys.DIGIT_3,
        ...(!checkUpdatesDisabled ? [SupportedKeys.DIGIT_6] : []),
        ...(!progress.isCCTVSystemDown ? [SupportedKeys.DIGIT_7] : []),
      ]
      : [];
    updateKeyState({
      ...enableIconlessKeys(digitKeys),
      PageUp: PgUpKeyIcon,
      PageDown: PgDnKeyIcon,
    });
    return () => {
      resetKeyStates();
    };
  }, [
    updateKeyState,
    resetKeyStates,
    progress.isCCTVSystemDown,
    checkUpdatesDisabled,
    progress.isAdvancedSettingsGranted,
  ]);

  return (
    <>
      <ProgressDialog
        open={dialogOpen}
        title={
          <>
            <PowerOff />
            {t("advancedSettings.shuttingDown")}
          </>
        }
        messages={[
          t("advancedSettings.initializeShutdown"),
          t("advancedSettings.disconnectingNetwork"),
          t("advancedSettings.savingState"),
          t("advancedSettings.poweringDown"),
          t("advancedSettings.finalizingShutdown"),
        ]}
        onProgressDone={handleProgressDone}
      />

      <SettingsCategoryContainer>
        <SettingsCategory settings={advancedSettings} />
        <Box style={{ padding: "0 1vw" }}>
          <Button variant="contained" color="error" onClick={() => setDialogOpen(true)} disabled={progress.isCCTVSystemDown}>
            {t("advancedSettings.shutdownSystem")}
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
