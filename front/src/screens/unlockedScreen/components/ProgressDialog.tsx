import { FC, useEffect, useState, ReactNode } from "react";
import { Dialog, DialogTitle, DialogContent, LinearProgress, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { playLoopingSound, stopSound } from "../../../core";
import { ProgressSFX } from "../assets/sfx";
import { useSettings } from "../../../providers";

interface ProgressDialogProps {
  open: boolean;
  title: ReactNode;
  messages: string[];
  onProgressDone: () => void;
}

export const ProgressDialog: FC<ProgressDialogProps> = ({ open, title, messages, onProgressDone }) => {
  const { t } = useTranslation("UnlockedScreen");
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const PROGRESS_SOUND_ID = "f3-progressbar-sound";
  const { appSettings } = useSettings();

  useEffect(() => {
    if (open) {
      playLoopingSound(PROGRESS_SOUND_ID, ProgressSFX, appSettings.volume);
    }

    return () => {
      stopSound(PROGRESS_SOUND_ID);
    };
  }, [open, appSettings.volume, PROGRESS_SOUND_ID]);

  useEffect(() => {
    if (open) {
      setProgress(0);
    }
  }, [open]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (open) {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + Math.random() * 6 + 5;

          const messageIndex = Math.min(Math.floor(newProgress / (100 / messages.length)), messages.length - 1);
          setCurrentMessage(messages[messageIndex]);

          if (newProgress >= 100) {
            clearInterval(timer);

            setTimeout(() => {
              onProgressDone();
            }, 400);

            return 100;
          }

          return newProgress;
        });
      }, 200);
    }

    return () => {
      clearInterval(timer);
    };
  }, [open, onProgressDone, messages]);

  return (
    <Dialog
      open={open}
      aria-labelledby="progress-dialog"
      disableEscapeKeyDown
      sx={{
        "& .MuiDialog-paper": {
          backdropFilter: "blur(10px)",
          padding: "20px",
          background: "rgba(107, 79, 102, 0.6)",
          color: "white",
          borderRadius: "8px",
          minWidth: "400px",
        },
      }}
    >
      <DialogTitle
        id="progress-dialog"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2, mb: 4 }}>
          <Typography variant="body2" sx={{ mb: 2, fontFamily: "monospace" }}>
            {currentMessage}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "rgba(255,255,255,0.2)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                backgroundColor: "#ff5252",
              },
            }}
          />

          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "right",
              mt: 1,
              fontFamily: "monospace",
            }}
          >
            {t("progressDialog.percentComplete", { percent: Math.round(progress) })}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
