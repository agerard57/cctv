import { FC, useEffect, useState } from "react";
import { Button, Box, Snackbar } from "@mui/material";
import { SettingsCategory } from "./SettingsCategory";
import { SettingsCategoryContainer } from "./GeneralSettings";
import { enableIconlessKeys, SupportedKeys, useKeyState } from "../../../../../../providers/keyState";
import { PgDnKeyIcon, PgUpKeyIcon } from "../../../f1ReplayManagerPage/assets";
import { ProgressDialog, ShortcutChip } from "../../../../components";
import { SystemConfigurationDialog } from "./SystemConfigurationDialog";
import { ElectricalServices } from "@mui/icons-material";
import { useProgress } from "../../../../../../providers";

export const SystemConfiguration: FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const [energySaver, setEnergySaver] = useState<boolean>(false);
  const [autoUpdates, setAutoUpdates] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [progressDialogOpen, setProgressDialogOpen] = useState<boolean>(false);
  const { progress, setCCTVSystemDown } = useProgress();

  const handleCheckUpdates = () => {
    alert("Checking for updates...");
  };

  const handleManageStorage = () => {
    alert("Opening storage management...");
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
      label: "Energy Saver Mode",
      type: "toggle",
      value: energySaver,
      onClick: setEnergySaver,
      keyboardShortcut: "1",
    },
    { label: "Auto Updates", type: "toggle", value: autoUpdates, onClick: setAutoUpdates, keyboardShortcut: "3" },
    { label: "Storage Management", type: "button", onClick: handleManageStorage, value: null },
    { label: "Check for updates", type: "button", onClick: handleCheckUpdates, keyboardShortcut: "6", value: null },
    { label: "Stats for nerds", type: "toggle", value: 0 },
    {
      label: "Backup Frequency",
      type: "select",
      value: "daily",
      options: [{ value: "daily", label: "Daily" }],
    },
  ];

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
            Shutting Down CCTV System
          </>
        }
        messages={[
          "Initializing shutdown sequence...",
          "Disconnecting from network...",
          "Saving system state...",
          "Powering down components...",
          "Finalizing shutdown...",
        ]}
        onProgressDone={handleProgressDone} // Ensure this is passed
      />

      <SettingsCategoryContainer>
        <SettingsCategory settings={systemConfiguration} />
        {!progress.isCCTVSystemDown && (
          <Box marginY={2}>
            <Button variant="contained" color="error" onClick={handleResetSystem}>
              Shut Down CCTV System
            </Button>
            <ShortcutChip shortcut="7" />
          </Box>
        )}
      </SettingsCategoryContainer>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        message="Electrical outlet disconnected successfully"
      />
    </>
  );
};
