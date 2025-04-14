import { FC, useState, ReactNode, useCallback } from "react";
import { Progress, ProgressInitializer } from "../typings";
import { useConstants } from "@/providers";
import { ProgressContext } from "../contexts";

interface Props {
  children: ReactNode;
}

export const ProgressProvider: FC<Props> = ({ children }) => {
  const appConstants = useConstants();

  // TODO Check all useStates and check if type and initializer are good
  const [progress, setProgress] = useState<Progress>(ProgressInitializer);

  const setSessionUnlocked = useCallback((value: boolean) => {
    setProgress((prev) => ({ ...prev, isSessionUnlocked: value }));
    // TODO Make a logger that only logs if DEBUG_MODE is true
    appConstants.DEBUG_MODE && console.info(`Progress updated: isSessionUnlocked = ${value}`);
  }, []);

  const setMediaProvided = useCallback((value: boolean) => {
    setProgress((prev) => ({ ...prev, isMediaProvided: value }));
    appConstants.DEBUG_MODE && console.info(`Progress updated: isMediaProvided = ${value}`);
  }, []);

  const setCaptchaSolved = useCallback((value: boolean) => {
    setProgress((prev) => ({ ...prev, isCaptchaSolved: value }));
    appConstants.DEBUG_MODE && console.info(`Progress updated: isCaptchaSolved = ${value}`);
  }, []);

  const setElectricalOutletDisconnected = useCallback((value: boolean) => {
    setProgress((prev) => ({ ...prev, isElectricalOutletDisconnected: value }));
    appConstants.DEBUG_MODE && console.info(`Progress updated: isElectricalOutletDisconnected = ${value}`);
  }, []);

  const setCCTVSystemDown = useCallback((value: boolean) => {
    setProgress((prev) => ({ ...prev, isCCTVSystemDown: value }));
    appConstants.DEBUG_MODE && console.info(`Progress updated: isCCTVSystemDown = ${value}`);
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(ProgressInitializer);
    appConstants.DEBUG_MODE && console.info("Progress reset to initial state");
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        setSessionUnlocked,
        setMediaProvided,
        setCaptchaSolved,
        setElectricalOutletDisconnected,
        setCCTVSystemDown,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
