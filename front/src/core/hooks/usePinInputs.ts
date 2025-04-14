import { useRef, useState } from "react";
import { PinInputStatuses } from "../typings";
import { KeyPressSFX, SuccessSFX, ErrorSFX } from "@/screens/lockedScreen/assets";

type UsePinInputs = (
  settings: {
    correctCode: string;
    disableValidation?: boolean; // Add optional disableValidation flag
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
      resetPin(); // Reset pins
      setPin(key); // Immediately set the first value of the new input
      setPins((prevPins) => {
        const newPinStatus = [...prevPins];
        newPinStatus[0] = PinInputStatuses.FILLED; // Mark the first pin as filled
        return newPinStatus;
      });
      return;
    }

    new Audio(KeyPressSFX).play().catch(() => {});

    setPin((prevPin) => {
      const newPin = prevPin + key;

      setPins((prevPins) => {
        const newPinStatus = [...prevPins];
        newPinStatus[newPin.length - 1] = PinInputStatuses.FILLED;
        return newPinStatus;
      });

      if (newPin.length === codeLength) {
        if (disableValidation) {
          // Skip validation if disableValidation is true
          if (callbacks?.onFilled) callbacks.onFilled();
        } else {
          // Otherwise proceed with normal validation
          setLoading(true);
          if (callbacks?.onFilled) callbacks.onFilled();
          validatePin(newPin);
        }
      }

      return newPin;
    });
  };

  const handleBackspace = () => {
    // Only clear all pins if validation is enabled and pin is full
    if (pin.length === codeLength && !disableValidation) {
      resetPin(); // Clear all pins if the password is full and validation is enabled
      return;
    }

    // TODO REMOVE COMMENTS
    // TODO TIMER LOCK SCREEN GOES 2 BY 2: 6 -> 4 -> 2...
    if (pin.length === 0) return; // Do nothing if no pins are entered

    // Remove the last character
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
    if (disableValidation) return; // Skip validation if disabled

    if (errorTriggered.current) return;
    errorTriggered.current = true;

    setTimeout(() => {
      if (loading) return;
      setLoading(false);

      if (enteredPin === settings.correctCode) {
        new Audio(SuccessSFX).play().catch(() => {});
        callbacks?.onSuccess?.();
      } else {
        new Audio(ErrorSFX).play().catch(() => {});
        setPins(Array(codeLength).fill(PinInputStatuses.ERROR));
        callbacks?.onError?.();
      }

      errorTriggered.current = false;
    }, 5000);
  };

  return {
    pins,
    loading,
    handlePinInput,
    handleBackspace,
    resetPin,
  };
};
