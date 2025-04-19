import { FC, useState, useEffect, useRef } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Alert, Box } from "@mui/material";
import { useConstants, useKeyDown, useSettings } from "@/providers";
import { KeyButton, LoadingSpinner, RfidStatuses, useLoadingDots } from "@/core";
import { CancelKeyIcon } from "../../f1ReplayManagerPage/assets";
import { useTranslation } from "react-i18next";
import { DebugRfidButtons } from "../../../../../core/components/DebugRfidButtons";
import { fetchRfidStatus } from "@/core/helpers/rfid";
import { playSound } from "../../../../../core/helpers";
import { ErrorSFX, SuccessSFX } from "../../../../lockedScreen/assets";

interface SystemConfigurationDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SystemConfigurationDialog: FC<SystemConfigurationDialogProps> = ({ open, onClose, onSuccess }) => {
  const { t } = useTranslation("SettingsPage");
  const [rfidStatus, setRfidStatus] = useState<RfidStatuses>(RfidStatuses.NONE);
  const appConstants = useConstants();
  const [loading, setLoading] = useState(false);
  const { appSettings } = useSettings();
  const { loadingDots } = useLoadingDots(rfidStatus === RfidStatuses.NONE);
  const hasHandledRfid = useRef(false); // Track if RFID has been handled
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Track the interval

  useEffect(() => {
    if (open) {
      hasHandledRfid.current = false; // Reset when dialog opens
      intervalRef.current = setInterval(() => {
        fetchRfidStatus(appConstants.unlockedScreen.settings.VALID_RFID_CODE, undefined, (fetchedRfidStatus) => {
          if (rfidStatus !== fetchedRfidStatus) {
            setRfidStatus(fetchedRfidStatus);
          }
        });
      }, 500);
    } else {
      setRfidStatus(RfidStatuses.NONE);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [open]);

  useEffect(() => {
    if (rfidStatus !== RfidStatuses.NONE && !hasHandledRfid.current) {
      onHandleRfid(rfidStatus);
      hasHandledRfid.current = true; // Mark as handled
    }
  }, [rfidStatus]);

  const onHandleRfid = (rfidStatus: RfidStatuses) => {
    if (rfidStatus === RfidStatuses.NONE || !open || loading) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (rfidStatus === RfidStatuses.VALID) {
        playSound(SuccessSFX, appSettings.volume);

        setTimeout(() => {
          onSuccess();
        }, 3000);
      } else {
        playSound(ErrorSFX, appSettings.volume);
      }
    }, 5000);
  };

  useKeyDown({
    Delete: () => {
      if (open) {
        onClose();
      }
    },
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="system-configuration-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            backdropFilter: "blur(10px)",
            padding: "20px",
            background: "rgba(50, 50, 100, 0.6)",
            color: "white",
            borderRadius: "8px",
          },
        }}
      >
        <DialogTitle id="system-configuration-dialog-title">{t("systemConfiguration.dialog.title")}</DialogTitle>
        <DialogContent sx={{ pt: 1, pb: 3 }}>
          <Typography variant="tableContent" sx={{ mb: 4 }}>
            {t("systemConfiguration.dialog.instruction")}
          </Typography>
          <Box
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              borderRadius: "4px",
              padding: "8px 12px",
              height: "4vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "8px",
            }}
          >
            {loading ? (
              <LoadingSpinner color="white" />
            ) : (
              <Typography variant="tableContent">
                {rfidStatus === RfidStatuses.NONE
                  ? `${t("systemConfiguration.dialog.waitingForScan")}${loadingDots}`
                  : rfidStatus === RfidStatuses.VALID
                    ? t("systemConfiguration.dialog.validCard")
                    : t("systemConfiguration.dialog.invalidCard")}
              </Typography>
            )}
          </Box>
          <Box marginY={2}>
            <DebugRfidButtons
              validRfidCode={appConstants.unlockedScreen.settings.VALID_RFID_CODE}
              onHandleRfid={onHandleRfid}
              onRfidSkip={onSuccess}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "8px 16px",
          }}
        >
          {/* TODO not the right icon */}
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <KeyButton
              label={t("systemConfiguration.dialog.closeButton")}
              icon={CancelKeyIcon}
              direction="row"
              padding="0 1vw"
              isEnabled={true}
            />
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
};
