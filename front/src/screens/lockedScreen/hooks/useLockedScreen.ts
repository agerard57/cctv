import { useConstants, useKeyDown, useProgress } from "@/providers";
import { PinInputStatuses, usePinInputs } from "@/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screens } from "../../Screens";
import { BlockedSFX, ErrorSFX, SuccessSFX } from "../assets";
import { LoginMethods, RfidStatuses, SessionStatuses } from "../typings";

type UseLockedScreen = () => {
  selectedMethod: LoginMethods;
  sessionStatus: SessionStatuses;
  loading: boolean;
  pins: { status: PinInputStatuses; value?: string }[];
  remainingTries: number;
  blockedTimer: number | null;
  rfidStatus: RfidStatuses | null;
  handleRfidCode: (rfidCode: string) => void;
  handlePinInput: (key: string) => void;
  handleBackspace: () => void;
};

export const useLockedScreen: UseLockedScreen = () => {
  const appConstants = useConstants();
  const navigate = useNavigate();
  const { setSessionUnlocked } = useProgress();

  const [selectedMethod, setSelectedMethod] = useState<LoginMethods>(LoginMethods.KEYPAD);
  const [sessionStatus, setSessionStatus] = useState<SessionStatuses>(SessionStatuses.LOCKED);
  const [loading, setLoading] = useState<boolean>(false);
  const [rfidStatus, setRfidStatus] = useState<RfidStatuses | null>(null);
  const [blockedTimer, setBlockedTimer] = useState<number | null>(null);
  const [remainingTries, setRemainingTries] = useState<number>(appConstants.lockedScreen.keypad.MAX_TRIES);

  const { pins, handlePinInput, handleBackspace, resetPin } = usePinInputs(
    { correctCode: appConstants.lockedScreen.keypad.LOCK_SCREEN_CODE },
    {
      onFilled: () => setLoading(true),
      onSuccess: () => {
        setLoading(false);
        setSessionStatus(SessionStatuses.UNLOCKED);

        const redirectTimer = setTimeout(() => {
          setSessionUnlocked(true);
          navigate(Screens.UNLOCKED_SCREEN);
          // TODO remove magic number
        }, 3000);
        return () => clearTimeout(redirectTimer);
      },
      onError: () => {
        if (loading) return;
        setLoading(false);

        setRemainingTries((prev) => {
          if (prev <= 0) return prev;
          const newTries = prev - 1;

          if (newTries <= 0) {
            blockSession();
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

  const handleRfidCode = (rfidCode: string) => {
    if (sessionStatus !== SessionStatuses.LOCKED || loading) return;

    setRfidStatus(null);
    setLoading(true);

    /* TODO Also add SFX when scanned */

    setTimeout(() => {
      setLoading(false);
      if (rfidCode === appConstants.lockedScreen.cardReader.VALID_RFID_CODE) {
        new Audio(SuccessSFX).play().catch(() => {});
        setRfidStatus(RfidStatuses.SUCCESS);
        setSessionStatus(SessionStatuses.UNLOCKED);

        const redirectTimer = setTimeout(() => {
          setSessionUnlocked(true);
          navigate(Screens.UNLOCKED_SCREEN);
          // TODO remove magic number
        }, 3000);
        return () => clearTimeout(redirectTimer);
      } else {
        new Audio(ErrorSFX).play().catch(() => {});
        setRfidStatus(RfidStatuses.ERROR);
      }
    }, 5000);
  };

  const blockSession = () => {
    new Audio(BlockedSFX).play().catch(() => {});
    setSessionStatus(SessionStatuses.BLOCKED);
    setBlockedTimer(appConstants.lockedScreen.keypad.BLOCK_DURATION);

    const timer = setInterval(() => {
      setBlockedTimer((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setSessionStatus(SessionStatuses.LOCKED);
          setRemainingTries(appConstants.lockedScreen.keypad.MAX_TRIES);
          resetPin();
          return null;
        }
        return prev! - 1;
      });
    }, 1000);
  };

  useKeyDown(
    {
      F1: () => handleLoginMethodChange(LoginMethods.KEYPAD),
      F2: () => handleLoginMethodChange(LoginMethods.CARD_READER),

      // TODO Add cool spaces between all useKeyDown
      Backspace: handleBackspace,
    },
    // TODO Not sure about string
    (digit: string) => {
      if (selectedMethod === LoginMethods.KEYPAD) {
        handlePinInput(digit);
      }
    },
    [sessionStatus, loading, selectedMethod, pins],
  );

  useEffect(() => {
    if (selectedMethod === LoginMethods.CARD_READER && sessionStatus === SessionStatuses.LOCKED) {
      const interval = setInterval(async () => {
        try {
          const response = await axios.get("/api/rfid-code");
          const rfidCode = response.data.rfid_code;

          if (rfidCode) {
            handleRfidCode(rfidCode);
          }
        } catch (error) {
          console.error("Failed to fetch RFID code:", error);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [selectedMethod, sessionStatus, loading]);

  return {
    selectedMethod,
    sessionStatus,
    loading,
    pins: pins.map((status) => ({ status, value: undefined })),
    remainingTries,
    blockedTimer,
    rfidStatus,
    handleRfidCode,
    handlePinInput,
    handleBackspace,
  };
};
