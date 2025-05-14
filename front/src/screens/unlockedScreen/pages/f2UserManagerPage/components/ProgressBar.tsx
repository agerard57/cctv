import styled from "@emotion/styled";
import { FC, useState, useEffect } from "react";
import { Typography, LinearProgress } from "@mui/material";
import { BlackContainerBase } from "@/core";

import { useTranslation } from "react-i18next";
import { JSX } from "@emotion/react/jsx-runtime";
import { useProgress, useSettings } from "../../../../../providers";
import { playSound, playLoopingSound, pauseSound, resumeSound, stopSound } from "../../../../../core";
import { ProgressInterruptedSFX } from "../assets";
import { ProgressMessageSFX } from "../../../assets";
import { ProgressSFX } from "../../../assets/sfx";

// TODO Find all comments in code and // and /* */
const ProgressBarContainer = styled(BlackContainerBase)`
  width: 50vw;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  align-self: center;
  justify-items: center;
  align-content: center;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 6vh 6vw;
`;

const StyledLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== "isError",
})<{ isError: boolean }>`
  width: calc(100% - 20px);
  margin: 10px 10px;

  & .MuiLinearProgress-bar {
    background-color: ${(props) => (props.isError ? "red" : undefined)};
  }
`;

export const ProgressBar: FC<{
  children: false | JSX.Element;
  onCaptchaRequired: () => void;
  onProgressBarComplete: () => void;
  isCaptchaDisplayed: boolean;
}> = ({ children, onCaptchaRequired, onProgressBarComplete, isCaptchaDisplayed }) => {
  const { t } = useTranslation("UserManagerPage");
  const [progressBarValue, setProgressBarValue] = useState(0);
  const [message, setMessage] = useState(t("progressBar.initializing"));
  const [lastThreshold, setLastThreshold] = useState(0);
  const { progress } = useProgress();
  const [captchaNeeded, setCaptchaNeeded] = useState(false);
  const { appSettings } = useSettings();
  const PROGRESS_SOUND_ID = "f2-progressbar-sound";

  const isError = !progress.isCaptchaSolved && progressBarValue >= 89;

  useEffect(() => {
    playLoopingSound(PROGRESS_SOUND_ID, ProgressSFX, appSettings.volume);

    return () => {
      stopSound(PROGRESS_SOUND_ID);
    };
  }, [appSettings.volume, PROGRESS_SOUND_ID]);

  useEffect(() => {
    if (isCaptchaDisplayed) {
      pauseSound(PROGRESS_SOUND_ID);
    } else if (progress.isCaptchaSolved && progressBarValue < 100) {
      resumeSound(PROGRESS_SOUND_ID);
    }

    if (progressBarValue >= 100) {
      stopSound(PROGRESS_SOUND_ID);
    }
  }, [isCaptchaDisplayed, progress.isCaptchaSolved, progressBarValue]);

  useEffect(() => {
    if (captchaNeeded && !isCaptchaDisplayed) {
      onCaptchaRequired();
      setCaptchaNeeded(false);
    }
  }, [captchaNeeded, isCaptchaDisplayed, onCaptchaRequired]);

  useEffect(() => {
    const messages = [
      { threshold: 10, text: t("progressBar.fetchingDatabase") },
      { threshold: 30, text: t("progressBar.decryptingData") },
      { threshold: 50, text: t("progressBar.loadingAccessLevels") },
      { threshold: 70, text: t("progressBar.verifyingCredentials") },
      { threshold: 89, text: t("progressBar.errorDescription") },
      { threshold: 90, text: t("progressBar.finalizing") },
    ];

    const interval = setInterval(
      () => {
        setProgressBarValue((prev) => {
          if (!progress.isCaptchaSolved && prev + 5 >= 89 && !isCaptchaDisplayed && !captchaNeeded) {
            playSound(ProgressInterruptedSFX, appSettings.volume);
            clearInterval(interval);
            setCaptchaNeeded(true);
            return 89;
          }

          if (prev >= 100) {
            clearInterval(interval);
            onProgressBarComplete();
            return prev;
          }

          const increment = Math.floor(Math.random() * 6) + 5;
          const nextProgress = Math.min(prev + increment, isCaptchaDisplayed ? 89 : 100);

          const nextMessage = messages.find((msg) => msg.threshold > lastThreshold && msg.threshold <= nextProgress);
          if (nextMessage) {
            playSound(ProgressMessageSFX, appSettings.volume);
            setMessage(nextMessage.text);
            setLastThreshold(nextMessage.threshold);
          }

          return nextProgress;
        });
      },
      Math.random() * 300 + 200,
    );

    return () => clearInterval(interval);
  }, [onProgressBarComplete, isCaptchaDisplayed, lastThreshold, t, progress.isCaptchaSolved, captchaNeeded]);

  return (
    <ProgressBarContainer>
      <Typography variant="pageTitle" color={isError ? "red" : undefined}>
        {!isError ? `${progressBarValue}%` : t("progressBar.error")}
      </Typography>
      <StyledLinearProgress variant="determinate" value={progressBarValue} isError={isError} />
      <Typography style={{ color: isError ? "red" : undefined }}>{message}</Typography>
      {children}
    </ProgressBarContainer>
  );
};
