import { FC, useState, useEffect } from "react";
import { Typography, Box, Divider } from "@mui/material";
import { useConstants, useSettings } from "@/providers";
import { ErrorSFX, LoadingSpinner, RfidScanSFX, RfidStatuses, useLoadingDots } from "@/core";
import { useTranslation } from "react-i18next";
import { DebugRfidButtons } from "../../../../../core/components/DebugRfidButtons";
import { fetchRfidStatus } from "@/core/helpers/rfid";
import { playSound } from "../../../../../core/helpers";
import { SuccessSFX } from "../../../../lockedScreen/assets";

interface AdvancedSettingsDialogProps {
  open: boolean;
  onSuccess: () => void;
}

export const AdvancedSettingsDialog: FC<AdvancedSettingsDialogProps> = ({ open, onSuccess }) => {
  const { t } = useTranslation("SettingsPage");
  const [rfidStatus, setRfidStatus] = useState<RfidStatuses>(RfidStatuses.NONE);
  const appConstants = useConstants();
  const [loading, setLoading] = useState(false);
  const { appSettings } = useSettings();
  const { loadingDots } = useLoadingDots(rfidStatus === RfidStatuses.NONE);


  const onHandleRfid = (rfidStatus: RfidStatuses) => {
    console.log(rfidStatus);
    if (rfidStatus === RfidStatuses.NONE || !open || loading) {
      return;
    }

    playSound(RfidScanSFX, appSettings.volume);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (rfidStatus === RfidStatuses.VALID) {
        playSound(SuccessSFX, appSettings.volume);

        setTimeout(() => {
          onSuccess();
        }, 3000);
      } else if (rfidStatus === RfidStatuses.INVALID) {
        playSound(ErrorSFX, appSettings.volume);
        setRfidStatus(RfidStatuses.INVALID);
      }
    }, 5000);
  };

  useEffect(() => {
    if (open || rfidStatus !== RfidStatuses.VALID || !loading) {
      const interval = setInterval(() => {
        fetchRfidStatus(appConstants.unlockedScreen.settings.VALID_RFID_CODE, undefined, (fetchedRfidStatus) => {
          if (fetchedRfidStatus !== RfidStatuses.NONE) {
            setRfidStatus(fetchedRfidStatus);
            onHandleRfid(fetchedRfidStatus);
          }
        });
      }, 500);

      return () => {
        clearInterval(interval);
      };
    }
  }, [open, rfidStatus, loading]);

  return (
    <div>
      <Typography
        variant="h6"
        fontWeight="bold"
        align="center"
        sx={{
          mb: 2,
          letterSpacing: "0.05em",
          color: "white",
        }}
      >{t("advancedSettings.dialog.title")}
      </Typography>
      <Typography
        variant="body2"
        align="center"
        color="rgba(255,255,255,0.7)"
        sx={{
          mb: 3,
          maxWidth: 400,
          mx: "auto",
          lineHeight: 1.4,
          fontSize: "0.9rem",
        }}
      >
        {t("advancedSettings.dialog.instruction")}
      </Typography>
      <Divider
        sx={{
          backgroundColor: "rgba(255,255,255,0.3)",
          my: 3,
          mx: "auto",
          width: "80%",
        }}
      />
      <div style={{ display: "flex", gap: 2, justifyContent: "space-around" }}>
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
            width: "100%",
          }}
        >
          {loading ? (
            <LoadingSpinner color="white" height="1vw" />
          ) : (
            <Typography variant="tableContent">
              {rfidStatus === RfidStatuses.NONE
                ? `${t("advancedSettings.dialog.waitingForScan")}${loadingDots}`
                : rfidStatus === RfidStatuses.VALID
                  ? t("advancedSettings.dialog.validCard")
                  : t("advancedSettings.dialog.invalidCard")}
            </Typography>
          )}
        </Box>
      </div>
      {appConstants.DEBUG_MODE && (
        <Box marginY={2} alignItems={"center"} display="flex" justifyContent="center">
          <DebugRfidButtons
            validRfidCode={appConstants.unlockedScreen.settings.VALID_RFID_CODE}
            onHandleRfid={onHandleRfid}
            onRfidSkip={onSuccess}
          />
        </Box>
      )}
    </div>
  );
};
