import { useConstants, useKeyDown, useProgress, useSettings } from "@/providers";
import { ErrorSFX, PinInputStatuses, RfidScanSFX, RfidStatuses, usePinInputs } from "@/core";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screens } from "../../Screens";
import { BlockedSFX, SuccessSFX } from "../assets";
import { LoginMethods, SessionStatuses } from "../typings";
import { playSound } from "../../../core/helpers";
import { fetchRfidStatus } from "../../../core/helpers/rfid";

type UseLockedScreen = () => {
  selectedMethod: LoginMethods;
  sessionStatus: SessionStatuses;
  loading: boolean;
  pins: { status: PinInputStatuses; value?: string }[];
  remainingTries: number;
  blockedTimer: number | null;
  rfidStatus: RfidStatuses | null;
  onHandleRfid: (rfidCode: RfidStatuses) => void;
  unlockSession: () => void;
  handlePinInput: (key: string) => void;
  handleBackspace: () => void;
};

export const useLockedScreen: UseLockedScreen = () => {
  const appConstants = useConstants();
  const navigate = useNavigate();
  const { setSessionUnlocked } = useProgress();
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { appSettings } = useSettings();
  const [selectedMethod, setSelectedMethod] = useState<LoginMethods>(LoginMethods.KEYPAD);
  const [sessionStatus, setSessionStatus] = useState<SessionStatuses>(SessionStatuses.LOCKED);
  const [loading, setLoading] = useState(false);
  const [rfidStatus, setRfidStatus] = useState<RfidStatuses | null>(null);
  const [blockedTimer, setBlockedTimer] = useState<number | null>(null);
  const [remainingTries, setRemainingTries] = useState<number>(appConstants.lockedScreen.keypad.MAX_TRIES);

  const { pins, handlePinInput, handleBackspace, resetPin } = usePinInputs(
    { correctCode: appConstants.lockedScreen.keypad.VALID_PIN_CODE },
    {
      onFilled: () => setLoading(true),
      onSuccess: () => {
        setLoading(false);
        setSessionStatus(SessionStatuses.UNLOCKED);
        playSound(SuccessSFX, appSettings.volume);

        setTimeout(() => {
          unlockSession();
        }, 3000);
      },
      onError: () => {
        if (loading) return;
        setLoading(false);

        setRemainingTries((prev) => {
          if (prev <= 0) return prev;
          const newTries = prev - 1;

          if (newTries <= 0) {
            blockSession();
          } else {
            playSound(ErrorSFX, appSettings.volume);
          }

          return newTries;
        });
      },
    },
  );

  const handleLoginMethodChange = (method: LoginMethods) => {
    if (selectedMethod !== method && !loading) {
      setSelectedMethod(method);
      resetPin();
      setRfidStatus(null);
    }
  };

  const unlockSession = () => {
    setSessionUnlocked(true);
    navigate(Screens.UNLOCKED_SCREEN);
  };

  const onHandleRfid = (rfidStatus: RfidStatuses) => {
    if (rfidStatus === RfidStatuses.NONE || sessionStatus !== SessionStatuses.LOCKED || loading) {
      return;
    }

    playSound(RfidScanSFX, appSettings.volume);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (rfidStatus === RfidStatuses.VALID) {
        playSound(SuccessSFX, appSettings.volume);
        setSessionStatus(SessionStatuses.UNLOCKED);

        setTimeout(() => {
          unlockSession();
        }, 3000);
      } else if (rfidStatus === RfidStatuses.INVALID) {
        playSound(ErrorSFX, appSettings.volume);
        setRfidStatus(RfidStatuses.INVALID);
      }
    }, 5000);
  };

  const blockSession = () => {
    playSound(BlockedSFX, appSettings.volume);
    setSessionStatus(SessionStatuses.BLOCKED);
    setBlockedTimer(appConstants.lockedScreen.keypad.BLOCK_DURATION);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = setInterval(() => {
      setBlockedTimer((prev) => {
        if (prev === null || prev <= 1) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          setSessionStatus(SessionStatuses.LOCKED);
          setRemainingTries(appConstants.lockedScreen.keypad.MAX_TRIES);
          resetPin();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useKeyDown(
    {
      F1: () => handleLoginMethodChange(LoginMethods.KEYPAD),
      F2: () => handleLoginMethodChange(LoginMethods.CARD_READER),

      Backspace: () => {
        if (sessionStatus !== SessionStatuses.BLOCKED) {
          handleBackspace();
        }
      },
    },
    (digit: string) => {
      if (selectedMethod === LoginMethods.KEYPAD && sessionStatus !== SessionStatuses.BLOCKED) {
        handlePinInput(digit);
      }
    },
    [sessionStatus, loading, selectedMethod, pins],
  );

  useEffect(() => {
    if (selectedMethod === LoginMethods.CARD_READER && sessionStatus === SessionStatuses.LOCKED) {
      const interval = setInterval(() => {
        fetchRfidStatus(appConstants.lockedScreen.cardReader.VALID_RFID_CODE, undefined, (fetchedRfidStatus) => {
          if (fetchedRfidStatus !== RfidStatuses.NONE) {
            setRfidStatus(fetchedRfidStatus);
            onHandleRfid(fetchedRfidStatus);
          }
        });
      }, 500);

      return () => {
        clearInterval(interval);
      };
    }
  }, [selectedMethod, sessionStatus, loading]);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  return {
    selectedMethod,
    sessionStatus,
    loading,
    pins: pins.map((status) => ({ status, value: undefined })),
    remainingTries,
    blockedTimer,
    rfidStatus,
    onHandleRfid,
    unlockSession,
    handlePinInput,
    handleBackspace,
  };
};
