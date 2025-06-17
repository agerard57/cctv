import { useState, useRef, Dispatch, SetStateAction, useEffect, useCallback } from "react";
import { UsbStatuses } from "../typings";
import { useLoadingDots } from "@/core";
import { useProgress, useSettings } from "../../../../../providers";
import { useConstants } from "@/providers/constants";
import { getUsbDevices } from "../../../../../core/services/usbDevices.service";
import { playSound } from "../../../../../core/helpers";
import { UsbInvalidSFX, UsbPlugSFX, UsbValidSFX } from "../assets";

export type UseInsertMedia = (setCurrentUsbStatus: Dispatch<SetStateAction<UsbStatuses>>) => {
  debugDevice: string | undefined;
  setDebugDevice: Dispatch<SetStateAction<string | undefined>>;
  loading: boolean;
  shouldShake: boolean;
  progressBarValue: number;
  loadingDots: string;
};

export const useInsertMedia: UseInsertMedia = (setCurrentUsbStatus) => {
  const appConstants = useConstants();
  const { VALID_USB, POLLING_INTERVAL, LOADING_DELAY, PROGRESS_INTERVAL, SHAKE_DURATION } =
    appConstants.unlockedScreen.replayManager.USB;

  const [debugDevice, setDebugDevice] = useState<string | undefined>(undefined);
  const prevDeviceListRef = useRef<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);
  const [progressBarValue, setProgressBarValue] = useState<number>(0);
  const currentStatusRef = useRef<UsbStatuses>(UsbStatuses.MISSING);
  const { loadingDots } = useLoadingDots(loading || currentStatusRef.current === UsbStatuses.VALID);
  const { setMediaProvided } = useProgress();
  const { appSettings } = useSettings();

  const determineUsbStatus = useCallback(
    (devices: string[]): UsbStatuses => {
      if (devices.includes(VALID_USB)) {
        return UsbStatuses.VALID;
      } else if (devices.length > 0) {
        return UsbStatuses.INVALID;
      } else {
        return UsbStatuses.MISSING;
      }
    },
    [VALID_USB]
  );

  const hasDeviceListChanged = (oldList: string[], newList: string[]): boolean => {
    if (oldList.length !== newList.length) return true;

    const oldSet = new Set(oldList);
    return newList.some((device) => !oldSet.has(device));
  };

  const checkUsbDevices = async () => {
    try {
      let newDevices: string[] = [];

      const response = await getUsbDevices(debugDevice);
      newDevices = response.devices;

      if (hasDeviceListChanged(prevDeviceListRef.current, newDevices)) {
        prevDeviceListRef.current = [...newDevices];

        const newStatus = determineUsbStatus(newDevices);

        if (currentStatusRef.current === UsbStatuses.INVALID && newStatus === UsbStatuses.MISSING) {
          playSound(UsbPlugSFX, appSettings.volume);
        }

        currentStatusRef.current = newStatus;

        if (newStatus !== UsbStatuses.MISSING) {
          playSound(UsbPlugSFX, appSettings.volume);
          setLoading(true);
        }

        setCurrentUsbStatus(newStatus);

        if (newStatus === UsbStatuses.INVALID) {
          setShouldShake(true);
        }

        setTimeout(() => {
          setLoading(false);

          if (newStatus === UsbStatuses.VALID) {
            playSound(UsbValidSFX, appSettings.volume);
            const interval = setInterval(() => {
              setProgressBarValue((prev) => {
                if (prev >= 100) {
                  clearInterval(interval);
                  setMediaProvided(true);
                  return 100;
                }
                return prev + 10;
              });
            }, PROGRESS_INTERVAL);
          } else if (newStatus === UsbStatuses.INVALID) {
            playSound(UsbInvalidSFX, appSettings.volume);
            setShouldShake(true);
            setTimeout(() => setShouldShake(false), SHAKE_DURATION);
          }
        }, LOADING_DELAY);
      }
    } catch (error) {
      console.error("Error checking USB devices:", error);
      if (currentStatusRef.current !== UsbStatuses.MISSING) {
        playSound(UsbPlugSFX, appSettings.volume);
        setCurrentUsbStatus(UsbStatuses.MISSING);
        currentStatusRef.current = UsbStatuses.MISSING;
        prevDeviceListRef.current = [];
      }
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), SHAKE_DURATION);
    }
  };

  useEffect(() => {
    checkUsbDevices();

    const intervalId = setInterval(() => {
      checkUsbDevices();
    }, POLLING_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [debugDevice]);

  return {
    debugDevice,
    setDebugDevice,
    loading,
    shouldShake,
    progressBarValue,
    loadingDots,
  };
};
