import { useRef, useState } from "react";
import { PinInputStatuses } from "../typings";
import { KeyPressSFX, SuccessSFX, ErrorSFX } from "@/screens/lockedScreen/assets";
import { useConstants } from "../../providers";
import { playSound } from "../helpers";

type UsePinInputs = (
  settings: {
    correctCode: string;
    disableValidation?: boolean;
  },
  callbacks?: {
    onFilled?: () => void;
    onSuccess?: () => void;
    onError?: () => void;
  },
) => {
  pins: PinInputStatuses[];
  loading: boolean;
  handlePinInput: (key: string) => void;
  handleBackspace: () => void;
  resetPin: () => void;
};

export const usePinInputs: UsePinInputs = (settings, callbacks) => {
  const errorTriggered = useRef(false);
  const appConstants = useConstants();
  const codeLength = settings.correctCode.length;
  const disableValidation = settings.disableValidation || false;

  const [pin, setPin] = useState<string>("");
  const [pins, setPins] = useState<PinInputStatuses[]>(Array(codeLength).fill(PinInputStatuses.EMPTY));
  const [loading, setLoading] = useState<boolean>(false);

  const resetPin = () => {
    setPin("");
    setPins(Array(codeLength).fill(PinInputStatuses.EMPTY));
  };

  const handlePinInput = (key: string) => {
    if (loading) return;

    if (pin.length >= codeLength) {
      resetPin();
      setPin(key);
      setPins((prevPins) => {
        const newPinStatus = [...prevPins];
        newPinStatus[0] = PinInputStatuses.FILLED;
        return newPinStatus;
      });
      return;
    }

    playSound(KeyPressSFX);

    setPin((prevPin) => {
      const newPin = prevPin + key;

      setPins((prevPins) => {
        const newPinStatus = [...prevPins];
        newPinStatus[newPin.length - 1] = PinInputStatuses.FILLED;
        return newPinStatus;
      });

      if (newPin.length === codeLength) {
        if (disableValidation) {
          if (callbacks?.onFilled) callbacks.onFilled();
        } else {
          setLoading(true);
          if (callbacks?.onFilled) callbacks.onFilled();
          validatePin(newPin);
        }
      }

      return newPin;
    });
  };

  const handleBackspace = () => {
    if (pin.length === codeLength && !disableValidation) {
      resetPin();
      return;
    }

    if (pin.length === 0) return;

    setPin((prevPin) => {
      const newPin = prevPin.slice(0, -1);

      setPins((prevPins) => {
        const newPinStatus = [...prevPins];
        newPinStatus[newPin.length] = PinInputStatuses.EMPTY;
        return newPinStatus;
      });

      return newPin;
    });
  };

  const validatePin = (enteredPin: string) => {
    if (disableValidation) return;

    if (errorTriggered.current) return;
    errorTriggered.current = true;

    setTimeout(() => {
      if (loading) return;
      setLoading(false);

      if (enteredPin === settings.correctCode) {
        playSound(SuccessSFX);
        callbacks?.onSuccess?.();
      } else {
        playSound(ErrorSFX);
        setPins(Array(codeLength).fill(PinInputStatuses.ERROR));
        callbacks?.onError?.();
      }

      errorTriggered.current = false;
    }, appConstants.core.pins.VALIDATION_DELAY);
  };

  return {
    pins,
    loading,
    handlePinInput,
    handleBackspace,
    resetPin,
  };
};
