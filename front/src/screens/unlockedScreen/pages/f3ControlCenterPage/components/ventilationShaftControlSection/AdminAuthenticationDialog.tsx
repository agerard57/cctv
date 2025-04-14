import { FC, useState, useEffect, useCallback } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Alert, Box } from "@mui/material";
import { useKeyDown } from "@/providers";
import { PinInputs, usePinInputs, KeyButton } from "@/core";
import { MultiTapInput } from "./MultiTapInput";
import { CancelKeyIcon, EnterKeyIcon } from "../../assets";

interface AdminAuthenticationDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Add this new prop
}

export const AdminAuthenticationDialog: FC<AdminAuthenticationDialogProps> = ({ open, onClose, onSuccess }) => {
  const CAPTCHA_CODE = "2342";
  const [pinInput, setPinInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { pins, handlePinInput, handleBackspace } = usePinInputs(
    {
      correctCode: CAPTCHA_CODE,
      disableValidation: true, // Add this to signal intent to disable validation
    },
    {
      // Empty callbacks prevent validation effects from running
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
    // Allow backspacing pins as long as there are pins to backspace
    // and the password field is empty
    if (pinInput.length > 0 && password.length === 0) {
      setPinInput((prev) => prev.slice(0, -1));
      handleBackspace();
    }
  };

  // Define handleAuthenticate using useCallback to ensure stable reference
  const handleAuthenticate = useCallback(() => {
    const trimmedPassword = password.trim();

    // Check pin code and password - now using "abc" as the password
    // TODO - Replace with actual password
    if (pinInput === CAPTCHA_CODE && trimmedPassword === "a") {
      onSuccess?.(); // Call onSuccess callback if provided
      onClose();
    } else {
      // Failed authentication
      setError("Invalid PIN code or password. Please try again.");
    }
  }, [pinInput, CAPTCHA_CODE, password, onClose, onSuccess]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      // Clear form on close
      setPinInput(""); // Reset pinInput state to empty string
      setPassword("");
      setError("");

      // Force pins to reset by calling handleBackspace repeatedly (in case pins not empty)
      for (let i = 0; i < CAPTCHA_CODE.length; i++) {
        handleBackspace();
      }
    }
  }, [open, handleBackspace, CAPTCHA_CODE.length]);

  // Handle global key events
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
          // Only process backspace on PIN if password is empty
          if (password.length === 0) {
            handlePinBackspace();
          }
          // Otherwise, T9 component will handle backspace for the password
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

  // Check if PIN is complete
  const isPinComplete = pinInput.length === CAPTCHA_CODE.length;

  // Determine if authentication is possible (PIN complete AND password not empty)
  const canAuthenticate = isPinComplete && password.length > 0;

  // Create shared styling for consistent appearance between PIN and T9
  const inputContainerStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    borderRadius: "4px",
    padding: "8px 12px 12px 12px", // Increase bottom padding to prevent text clipping
    height: "4vh", // Increase height from 3vh to 4vh
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
      <DialogTitle id="admin-authentication-dialog-title">Admin Authentication Required</DialogTitle>
      <DialogContent sx={{ pt: 1, pb: 3 }}>
        <Typography variant="tableContent" sx={{ mb: 4 }}>
          This action requires administrative privileges. Please enter the PIN code and password:
        </Typography>
        <div style={{ display: "flex", gap: 2, justifyContent: "space-around" }}>
          <div>
            <Typography style={{ paddingTop: "2vh" }}>User ID</Typography>
            <Box sx={inputContainerStyle}>
              <PinInputs
                pinShape="rectangle"
                transparent={true} // Add the prop to make pins transparent
                pins={pins.map((status, index) => ({
                  status,
                  value: pinInput[index] || undefined,
                }))}
              />
            </Box>
          </div>
          <div>
            <Typography style={{ paddingTop: "2vh" }}>
              Password
              {!isPinComplete && (
                <Typography variant="caption" color="rgba(255,255,255,0.5)" sx={{ ml: 1 }}>
                  (Complete PIN first)
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
          padding: "8px 16px", // Set explicit padding
          overflowX: "hidden", // Prevent horizontal overflow
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
                  padding: "2px 0", // Adjust padding to align with text
                  marginRight: "8px", // Restore proper margin for icon
                  alignSelf: "center", // Ensure vertical centering
                },
                "& .MuiAlert-message": {
                  color: "#ff5959",
                  padding: "4px 0",
                  display: "flex",
                  alignItems: "center", // Center align text vertically
                  minHeight: "32px", // Ensure minimum height for proper alignment
                },
                display: "flex",
                alignItems: "center", // Center the flex children
              }}
            >
              Invalid ID or password.
            </Alert>
          )}
        </div>

        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
          <KeyButton
            label="Close"
            icon={CancelKeyIcon}
            direction="row"
            padding="0 1vw"
            isEnabled={true}
            // onClick={onClose}
          />
          <KeyButton
            label="Enter"
            icon={EnterKeyIcon}
            direction="row"
            padding="0 1vw"
            isEnabled={canAuthenticate}
            //onClick={handleAuthenticate}
          />
        </div>
      </DialogActions>
    </Dialog>
  );
};
