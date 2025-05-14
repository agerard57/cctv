import { FC, useState, useEffect, useRef } from "react";
import { useKeyState, allDigits, enableIconlessKeys } from "@/providers/keyState";
import { PgDnKeyIcon, PgUpKeyIcon, SpaceKeyIcon } from "../assets";
import { UserTable } from "./UserTable";
import { ProgressBar } from "./ProgressBar";
import { Captcha } from "./Captcha";
import { useConstants } from "@/providers/constants";
import { DebugUserTable } from "./DebugUserTable";
import { useProgress } from "../../../../../providers";

export const UserManagerPage: FC = () => {
  const { progress, setCaptchaSolved } = useProgress();
  const { updateKeyState, resetKeyStates } = useKeyState();
  const appConstants = useConstants();

  const [isCaptchaDisplayed, setIsCaptchaDisplayed] = useState(false);
  const [isProgressBarComplete, setIsProgressBarComplete] = useState(progress.isCaptchaSolved);
  const tableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isProgressBarComplete) {
      if (isCaptchaDisplayed) {
        updateKeyState({
          ...enableIconlessKeys(allDigits),
          " ": SpaceKeyIcon,
        });
      } else {
        resetKeyStates();
      }
    } else {
      updateKeyState({
        PageUp: PgUpKeyIcon,
        PageDown: PgDnKeyIcon,
      });
    }

    return () => {
      resetKeyStates();
    };
  }, [updateKeyState, resetKeyStates, isCaptchaDisplayed, isProgressBarComplete]);

  useEffect(() => {
    if (isProgressBarComplete && tableRef.current) {
      tableRef.current.focus();
    }
  }, [isProgressBarComplete]);

  const handleCaptchaSolve = () => {
    setIsCaptchaDisplayed(false);
    setCaptchaSolved(true);
  };

  const handleCaptchaRequest = () => {
    setIsCaptchaDisplayed(true);
  };

  const handleSkip = () => {
    setCaptchaSolved(true);
    setIsProgressBarComplete(true);
  };

  if (!isProgressBarComplete) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
        <ProgressBar
          onCaptchaRequired={handleCaptchaRequest}
          onProgressBarComplete={() => setIsProgressBarComplete(true)}
          isCaptchaDisplayed={isCaptchaDisplayed}
        >
          {isCaptchaDisplayed && <Captcha onSolve={handleCaptchaSolve} />}
        </ProgressBar>
        {appConstants.DEBUG_MODE && <DebugUserTable onClick={handleSkip} />}
      </div>
    );
  }

  return <UserTable ref={tableRef} />;
};
