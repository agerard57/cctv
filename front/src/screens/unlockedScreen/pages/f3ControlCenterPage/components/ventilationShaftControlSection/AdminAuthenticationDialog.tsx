import { FC, useState, useEffect, useCallback } from "react";
import { Box, Typography, Alert, Divider } from "@mui/material";
import { useConstants, useKeyDown } from "@/providers";
import { PinInputs, usePinInputs, KeyButton, PinInputStatuses } from "@/core";
import { MultiTapInput } from "./MultiTapInput";
import { EnterKeyIcon } from "../../assets";
import { useTranslation } from "react-i18next";

interface AdminAuthenticationDialogProps {
  open: boolean;
  onSuccess: () => void;
}

export const AdminAuthenticationDialog: FC<AdminAuthenticationDialogProps> = ({ open, onSuccess }) => {
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
      onFilled: () => { },
      onSuccess: () => { },
      onError: () => { },
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
      onSuccess();
    } else {
      setError(t("adminAuthentication.invalidCredentials"));
    }
  }, [pinInput, CAPTCHA_CODE, password, onSuccess, onSuccess, t]);

  useEffect(() => {
    if (!open) {
      setPinInput("");
      setPassword("");
      setError("");

      if (pins.some((pin) => pin !== PinInputStatuses.EMPTY)) {
        for (let i = 0; i < CAPTCHA_CODE.length; i++) {
          handleBackspace();
        }
      }
    }
  }, [open]);

  useKeyDown(
    {
      Enter: () => {
        if (password.length > 0) {
          handleAuthenticate();
        }
      },
      Backspace: () => {
        if (password.length === 0) {
          handlePinBackspace();
        }
      },
    },
    (digit: string) => {
      if (!isNaN(Number(digit))) {
        handlePinEntry(digit);
      }
    },
    [handleAuthenticate, handlePinBackspace, handlePinEntry],
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

  if (!open) {
    return undefined;
  }

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
      >
        {t("adminAuthentication.title")}
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
        {t("adminAuthentication.description")}
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
        <div>
          <Typography
            variant="subtitle2"
            color="rgba(255,255,255,0.9)"
            sx={{ pt: "2vh", mb: 1 }}
          >
            {t("adminAuthentication.userId")}
          </Typography>
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
          <Typography
            variant="subtitle2"
            color="rgba(255,255,255,0.9)"
            sx={{ pt: "2vh", mb: 1 }}
          >
            {t("adminAuthentication.password")}
            {!isPinComplete && (
              <Typography
                variant="caption"
                color="rgba(255,255,255,0.6)"
                sx={{ ml: 1, fontSize: "0.7rem" }}
              >
                {t("adminAuthentication.completePinFirst")}
              </Typography>
            )}
          </Typography>
          <Box sx={inputContainerStyle}>
            <MultiTapInput onChange={(e) => setPassword(e)} enabled={isPinComplete} />
          </Box>
        </div>
      </div>
      {error && (
        <Alert
          severity="error"
          sx={{
            backgroundColor: "transparent",
            color: "red",
            padding: "0 8px",
            mt: 2,
          }}
        >
          {error}
        </Alert>
      )}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <KeyButton
          label={t("adminAuthentication.enter")}
          icon={EnterKeyIcon}
          direction="row"
          padding="0 1vw"
          isEnabled={canAuthenticate}
        />
      </Box>
    </div>
  );
};
