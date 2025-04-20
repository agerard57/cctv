import { useState, useRef, Dispatch, SetStateAction, useEffect, useCallback } from "react";
import { UsbStatuses } from "../typings";
import { useLoadingDots } from "@/core";
import { useProgress } from "../../../../../providers";
import { useConstants } from "@/providers/constants";
import { getUsbDevices } from "../../../../../core/services/usbDevices.service";

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
  const { VALID_USB, INVALID_USB_LIST, POLLING_INTERVAL, LOADING_DELAY, PROGRESS_INTERVAL, SHAKE_DURATION } =
    appConstants.unlockedScreen.replayManager.USB;

  const [debugDevice, setDebugDevice] = useState<string | undefined>(undefined);
  const prevDeviceListRef = useRef<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);
  const [progressBarValue, setProgressBarValue] = useState<number>(0);
  const currentStatusRef = useRef<UsbStatuses>(UsbStatuses.MISSING);
  const { loadingDots } = useLoadingDots(loading || currentStatusRef.current === UsbStatuses.VALID);
  const { setMediaProvided } = useProgress();

  // Determine USB status based on device list
  const determineUsbStatus = useCallback(
    (devices: string[]): UsbStatuses => {
      if (devices.includes(VALID_USB)) {
        return UsbStatuses.VALID;
      }

      // Check if any invalid devices are present
      for (const invalidDevice of INVALID_USB_LIST) {
        if (devices.includes(invalidDevice)) {
          return UsbStatuses.INVALID;
        }
      }

      return UsbStatuses.MISSING;
    },
    [VALID_USB, INVALID_USB_LIST],
  );

  // Check if device list has changed
  const hasDeviceListChanged = (oldList: string[], newList: string[]): boolean => {
    if (oldList.length !== newList.length) return true;

    const oldSet = new Set(oldList);
    return newList.some((device) => !oldSet.has(device));
  };

  const checkUsbDevices = async () => {
    try {
      // Use debug devices if in debug mode, otherwise fetch from API
      let newDevices: string[] = [];

      const response = await getUsbDevices(debugDevice);
      newDevices = response.devices;

      // Only process if device list has changed
      if (hasDeviceListChanged(prevDeviceListRef.current, newDevices)) {
        prevDeviceListRef.current = [...newDevices];

        const newStatus = determineUsbStatus(newDevices);
        currentStatusRef.current = newStatus;

        if (newStatus !== UsbStatuses.MISSING) {
          setLoading(true);
        }

        setCurrentUsbStatus(newStatus);

        if (newStatus === UsbStatuses.INVALID) {
          setShouldShake(true);
        }

        // Simulate processing delay
        setTimeout(() => {
          setLoading(false);

          if (newStatus === UsbStatuses.VALID) {
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
            setShouldShake(true);
            setTimeout(() => setShouldShake(false), SHAKE_DURATION);
          }
        }, LOADING_DELAY);
      }
    } catch (error) {
      console.error("Error checking USB devices:", error);
      if (currentStatusRef.current !== UsbStatuses.MISSING) {
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
