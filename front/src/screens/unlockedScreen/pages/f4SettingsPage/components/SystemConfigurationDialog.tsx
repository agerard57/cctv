import { FC, useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Alert, Box } from "@mui/material";
import { useKeyDown } from "@/providers";
import { KeyButton } from "@/core";
import axios from "axios";
import { DebugSystemConfigurationRfidButtons } from "./DebugSystemConfigurationRfidButtons";
import { CancelKeyIcon } from "../../f1ReplayManagerPage/assets";
import { useTranslation } from "react-i18next";

interface SystemConfigurationDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SystemConfigurationDialog: FC<SystemConfigurationDialogProps> = ({ open, onClose, onSuccess }) => {
  const { t } = useTranslation("SettingsPage");
  const [rfidCode, setRfidCode] = useState("");
  const [error, setError] = useState("");
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (open) {
      interval = setInterval(async () => {
        try {
          const response = await axios.get("/api/rfid-code");
          const fetchedCode = response.data.rfid_code;

          if (fetchedCode) {
            setRfidCode(fetchedCode);
          }
        } catch (error) {
          console.error("Failed to fetch RFID code:", error);
        }
      }, 1000);
    } else {
      setRfidCode("");
      setError("");
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [open]);

  useEffect(() => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      if (open || progressDialogOpen) {
        rootElement.setAttribute("inert", "true");
      } else {
        rootElement.removeAttribute("inert");
      }
    }
    return () => {
      if (rootElement) {
        rootElement.removeAttribute("inert");
      }
    };
  }, [open, progressDialogOpen]);

  const handleAuthenticate = () => {
    // TODO See, 'cause maybe we need it
    // setLoading(true);
    setTimeout(() => {
      if (rfidCode) {
        setProgressDialogOpen(true);
        onClose();
      } else {
        setError(t("systemConfiguration.dialog.invalidCard"));
      }
    }, 1000);
  };

  useKeyDown(
    {
      Delete: () => {
        if (open) {
          onClose();
        }
      },
      Enter: () => {
        if (open && rfidCode) {
          handleAuthenticate();
        }
      },
    },
    undefined,
    [open, onClose, handleAuthenticate, rfidCode],
  );

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
            <Typography>{rfidCode || t("systemConfiguration.dialog.waitingForScan")}</Typography>
          </Box>
          <Box marginY={2}>
            <DebugSystemConfigurationRfidButtons
              handleRfidCode={(code) => setRfidCode(code)}
              handleSkipRfid={() => onSuccess()}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 16px",
          }}
        >
          <div style={{ flexShrink: 1, overflow: "hidden" }}>
            {error && (
              <Alert
                severity="error"
                sx={{
                  backgroundColor: "transparent",
                  color: "red",
                  padding: "0 8px",
                  "& .MuiAlert-icon": {
                    color: "#ff5959",
                    padding: "2px 0",
                    marginRight: "8px",
                    alignSelf: "center",
                  },
                  "& .MuiAlert-message": {
                    color: "#ff5959",
                    padding: "4px 0",
                    display: "flex",
                    alignItems: "center",
                    minHeight: "32px",
                  },
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {error}
              </Alert>
            )}
          </div>

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
