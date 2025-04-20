import { FC, useState, ReactNode, useCallback } from "react";
import { Progress, ProgressInitializer } from "../typings";
import { useConstants } from "@/providers";
import { ProgressContext } from "../contexts";
import { logDebug } from "../../../core/helpers/logDebug";

interface Props {
  children: ReactNode;
}

export const ProgressProvider: FC<Props> = ({ children }) => {
  const appConstants = useConstants();

  const [progress, setProgress] = useState<Progress>(ProgressInitializer);

  const updateProgress = useCallback(
    <K extends keyof Progress>(key: K, value: Progress[K]) => {
      setProgress((prev) => ({ ...prev, [key]: value }));
      logDebug(appConstants.DEBUG_MODE, "PROGRESS", `${key}: ${value}`);
    },
    [appConstants.DEBUG_MODE],
  );

  const resetProgress = useCallback(() => {
    setProgress(ProgressInitializer);
    logDebug(appConstants.DEBUG_MODE, "PROGRESS", "Reset to initial state");
  }, [appConstants.DEBUG_MODE]);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        setSessionUnlocked: (value) => updateProgress("isSessionUnlocked", value),
        setMediaProvided: (value) => updateProgress("isMediaProvided", value),
        setCaptchaSolved: (value) => updateProgress("isCaptchaSolved", value),
        setElectricalOutletDisconnected: (value) => updateProgress("isElectricalOutletDisconnected", value),
        setCCTVSystemDown: (value) => updateProgress("isCCTVSystemDown", value),
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
