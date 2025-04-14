import { useState, useRef, Dispatch, SetStateAction } from "react";
import { UsbStatuses } from "../typings";
import { getUsbStatus } from "../services/usbStatus.service";
import { useKeyDown } from "@/providers/keyState/hooks";
import { useConstants } from "@/providers/constants";
import { useLoadingDots } from "@/core";
import { useProgress } from "../../../../../providers";

export type UseInsertMedia = (setCurrentUsbStatus: Dispatch<SetStateAction<UsbStatuses>>) => {
  debugStatus: UsbStatuses;
  setDebugStatus: Dispatch<SetStateAction<UsbStatuses>>;
  loading: boolean;
  shouldShake: boolean;
  progressBarValue: number;
  loadingDots: string;
};

export const useInsertMedia: UseInsertMedia = (setCurrentUsbStatus) => {
  const appConstants = useConstants();
  const [debugStatus, setDebugStatus] = useState<UsbStatuses>(UsbStatuses.MISSING);
  const [loading, setLoading] = useState<boolean>(false);
  const [shouldShake, setShouldShake] = useState<boolean>(false);
  const [progressBarValue, setProgressBarValue] = useState<number>(0);
  const usbStatusRef = useRef<UsbStatuses | null>(null);
  const { loadingDots } = useLoadingDots(loading || usbStatusRef.current === UsbStatuses.VALID);
  const { setMediaProvided } = useProgress();

  const checkUsbStatus = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { status } = await getUsbStatus(appConstants.DEBUG_MODE ? `?override_status=${debugStatus}` : "");

      if (usbStatusRef.current !== status) {
        usbStatusRef.current = status;
        setCurrentUsbStatus(status);
      }

      if (status !== UsbStatuses.VALID) {
        setShouldShake(true);
      }
    } catch (error) {
      console.error("Error fetching USB status:", error);
      if (usbStatusRef.current !== UsbStatuses.MISSING) {
        setCurrentUsbStatus(UsbStatuses.MISSING);
        usbStatusRef.current = UsbStatuses.MISSING;
      }
      setShouldShake(true);
    } finally {
      setTimeout(() => {
        setLoading(false);

        if (usbStatusRef.current === UsbStatuses.VALID) {
          const interval = setInterval(() => {
            setProgressBarValue((prev) => {
              if (prev >= 100) {
                clearInterval(interval);
                setMediaProvided(true);
                return 100;
              }
              return prev + 10;
            });
          }, 300);
        } else {
          setShouldShake(true);
          setTimeout(() => setShouldShake(false), 500);
        }
      }, 3000);
    }
  };

  useKeyDown({
    Enter: checkUsbStatus,
  });

  return {
    debugStatus,
    setDebugStatus,
    loading,
    shouldShake,
    progressBarValue,
    loadingDots,
  };
};
