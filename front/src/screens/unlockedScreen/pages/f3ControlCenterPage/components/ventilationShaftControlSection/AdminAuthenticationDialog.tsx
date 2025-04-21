import { FC, useState, useEffect, useCallback } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Alert, Box } from "@mui/material";
import { useConstants, useKeyDown } from "@/providers";
import { PinInputs, usePinInputs, KeyButton, PinInputStatuses } from "@/core";
import { MultiTapInput } from "./MultiTapInput";
import { CancelKeyIcon, EnterKeyIcon } from "../../assets";
import { useTranslation } from "react-i18next";

interface AdminAuthenticationDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminAuthenticationDialog: FC<AdminAuthenticationDialogProps> = ({ open, onClose, onSuccess }) => {
  const { t } = useTranslation("ControlCenterPage");
  const appConstants = useConstants();
  const CAPTCHA_CODE = appConstants.unlockedScreen.controlCenter.CAPTCHA.ID;
  const CAPTCHA_PASSWORD = appConstants.unlockedScreen.controlCenter.CAPTCHA.PASSWORD;
  const [pinInput, setPinInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { pins, handlePinInput, handleBackspace } = usePinInputs(
    {
      correctCode: CAPTCHA_CODE,
      disableValidation: true,
    },
    {
      onFilled: () => {},
      onSuccess: () => {},
      onError: () => {},
    },
  );

  const handlePinEntry = (key: string) => {
    if (pinInput.length < CAPTCHA_CODE.length) {
      setPinInput((prev) => prev + key);
      handlePinInput(key);
    }
  };

  const handlePinBackspace = () => {
    if (pinInput.length > 0 && password.length === 0) {
      setPinInput((prev) => prev.slice(0, -1));
      handleBackspace();
    }
  };

  const handleAuthenticate = useCallback(() => {
    if (pinInput === CAPTCHA_CODE && password.trim() === CAPTCHA_PASSWORD) {
      onSuccess?.();
      onClose();
    } else {
      setError(t("adminAuthentication.invalidCredentials"));
    }
  }, [pinInput, CAPTCHA_CODE, password, onClose, onSuccess, t]);

  useEffect(() => {
    if (!open) {
      setPinInput("");
      setPassword("");
      setError("");

      // Reset pins only if the dialog was previously open
      if (pins.some((pin) => pin !== PinInputStatuses.EMPTY)) {
        for (let i = 0; i < CAPTCHA_CODE.length; i++) {
          handleBackspace();
        }
      }
    }
  }, [open]);

  useKeyDown(
    {
      Delete: () => {
        if (open) {
          onClose();
        }
      },
      Enter: () => {
        if (open) {
          if (open && password.length > 0) {
            handleAuthenticate();
          }
        }
      },
      Backspace: () => {
        if (open) {
          if (password.length === 0) {
            handlePinBackspace();
          }
        }
      },
    },
    (digit: string) => {
      if (open && !isNaN(Number(digit))) {
        handlePinEntry(digit);
      }
    },
    [open, onClose, handleAuthenticate, handlePinBackspace, handlePinEntry],
  );

  const isPinComplete = pinInput.length === CAPTCHA_CODE.length;

  const canAuthenticate = isPinComplete && password.length > 0;

  const inputContainerStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    borderRadius: "4px",
    padding: "8px 12px 12px 12px",
    height: "4vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "8px",
    "&:hover": {
      borderColor: "rgba(255, 255, 255, 0.8)",
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="admin-authentication-dialog-title"
      sx={{
        "& .MuiDialog-paper": {
          backdropFilter: "blur(10px)",
          padding: "20px",
          background: "rgba(107, 79, 102, 0.6)",
          color: "white",
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle id="admin-authentication-dialog-title">{t("adminAuthentication.title")}</DialogTitle>
      <DialogContent sx={{ pt: 1, pb: 3 }}>
        <Typography variant="tableContent" sx={{ mb: 4 }}>
          {t("adminAuthentication.description")}
        </Typography>
        <div style={{ display: "flex", gap: 2, justifyContent: "space-around" }}>
          <div>
            <Typography style={{ paddingTop: "2vh" }}>{t("adminAuthentication.userId")}</Typography>
            <Box sx={inputContainerStyle}>
              <PinInputs
                pinShape="rectangle"
                transparent={true}
                pins={pins.map((status, index) => ({
                  status,
                  value: pinInput[index] || undefined,
                }))}
              />
            </Box>
          </div>
          <div>
            <Typography style={{ paddingTop: "2vh" }}>
              {t("adminAuthentication.password")}
              {!isPinComplete && (
                <Typography variant="caption" color="rgba(255,255,255,0.5)" sx={{ ml: 1 }}>
                  {t("adminAuthentication.completePinFirst")}
                </Typography>
              )}
            </Typography>
            <Box sx={inputContainerStyle}>
              <MultiTapInput onChange={(e) => setPassword(e)} enabled={isPinComplete} />
            </Box>
          </div>
        </div>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 16px",
          overflowX: "hidden",
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
            label={t("adminAuthentication.close")}
            icon={CancelKeyIcon}
            direction="row"
            padding="0 1vw"
            isEnabled={true}
          />
          <KeyButton
            label={t("adminAuthentication.enter")}
            icon={EnterKeyIcon}
            direction="row"
            padding="0 1vw"
            isEnabled={canAuthenticate}
          />
        </div>
      </DialogActions>
    </Dialog>
  );
};
