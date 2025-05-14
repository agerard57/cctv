import React, { useState, useEffect, useRef } from "react";
import { TextField } from "@mui/material";
import { useKeyDown, useSettings } from "../../../../../../providers";
import { PinBackspaceSFX, PinInputSFX } from "../../../../../../core/assets";
import { playSound } from "../../../../../../core";

interface MultiTapInputProps {
  onChange: (password: string) => void;
  enabled?: boolean;
}

const keys = [
  {
    key: "1",
    content: ["."],
  },
  {
    key: "2",
    content: ["A", "B", "C"],
  },
  {
    key: "3",
    content: ["D", "E", "F"],
  },
  {
    key: "4",
    content: ["G", "H", "I"],
  },
  {
    key: "5",
    content: ["J", "K", "L"],
  },
  {
    key: "6",
    content: ["M", "N", "O"],
  },
  {
    key: "7",
    content: ["P", "Q", "R", "S"],
  },
  {
    key: "8",
    content: ["T", "U", "V"],
  },
  {
    key: "9",
    content: ["W", "X", "Y", "Z"],
  },
  {
    key: "0",
    content: [" "],
  },
];

export const MultiTapInput: React.FC<MultiTapInputProps> = ({ onChange, enabled = true }) => {
  const [input, setInput] = useState("");
  const [displayInput, setDisplayInput] = useState("");
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);
  const [lastKeyPosition, setLastKeyPosition] = useState(-1);
  const [state, setState] = useState(0);
  const { appSettings } = useSettings();

  const [cursorVisible, setCursorVisible] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    cursorIntervalRef.current = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => {
      if (cursorIntervalRef.current) {
        clearInterval(cursorIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (enabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [enabled]);

  useEffect(() => {
    onChange(input);
  }, [input, onChange]);

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key;
      handleKeyRelease(key);
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [currentKey, state, lastKeyPressed, lastKeyPosition, input]);

  const finalizeCurrentCharacter = () => {
    setLastKeyPressed(null);
    setCurrentKey(null);
    setState(0);
  };

  const handleBackspace = () => {
    if (input.length > 0) {
      playSound(PinBackspaceSFX, appSettings.volume);
      setInput((prev) => prev.slice(0, -1));
      setDisplayInput((prev) => prev.slice(0, -1));

      if (lastKeyPosition === input.length - 1) {
        setLastKeyPressed(null);
        setState(0);
      }
    }
  };

  const handleKeyPress = (key: string) => {
    const keyObj = keys.find((k) => k.key === key);

    if (!keyObj) {
      return;
    }

    playSound(PinInputSFX, appSettings.volume);
    startTimeRef.current = Date.now();
    setCurrentKey(key);
  };

  const handleKeyRelease = (key: string) => {
    const keyObj = keys.find((k) => k.key === key);

    if (!keyObj || key !== currentKey) return;

    const keyPressTime = Date.now() - startTimeRef.current;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (keyObj.content === undefined) {
      setDisplayInput((prev) => prev + keyObj.key);
      setLastKeyPosition(input.length);
      setLastKeyPressed(null);
    } else {
      if (key === lastKeyPressed && lastKeyPosition === input.length - 1 && keyPressTime < 1000) {
        setInput((prev) => {
          const updatedValue = prev.split("");
          const newState = (state + 1) % keyObj.content.length;
          updatedValue[lastKeyPosition] = keyObj.content[newState];
          setState(newState);
          return updatedValue.join("");
        });
        setDisplayInput((prev) => {
          const updatedValue = prev.split("");
          const newState = (state + 1) % keyObj.content.length;
          updatedValue[lastKeyPosition] = keyObj.content[newState];
          return updatedValue.join("");
        });
      } else if (keyPressTime >= 1000) {
        setInput((prev) => prev + keyObj.key);
        setDisplayInput((prev) => prev + keyObj.key);
        setLastKeyPosition(input.length);
        setLastKeyPressed(key);
        setState(0);
      } else {
        setInput((prev) => prev + keyObj.content[0]);
        setDisplayInput((prev) => prev + keyObj.content[0]);
        setLastKeyPosition(input.length);
        setLastKeyPressed(key);
        setState(0);
      }

      timerRef.current = setTimeout(() => {
        finalizeCurrentCharacter();
      }, 1000);
    }
  };

  useKeyDown(
    {
      Backspace: () => {
        if (enabled) {
          handleBackspace();
        }
      },
    },
    (digit: string) => {
      if (enabled && !isNaN(Number(digit))) {
        handleKeyPress(digit);
      }
    },
    [currentKey, state, lastKeyPressed, lastKeyPosition, input, enabled],
  );

  return (
    <TextField
      inputRef={inputRef}
      value={displayInput + (cursorVisible && enabled ? "|" : "")}
      fullWidth
      variant="standard"
      disabled={!enabled}
      InputProps={{
        readOnly: true,
        disableUnderline: true,
        sx: {
          "& .MuiInputBase-input": {
            padding: 0,
            color: enabled ? "white" : "rgba(255, 255, 255, 0.5)",
            fontSize: "1.5vw",
            fontWeight: "bold",
            textAlign: "center",
            height: "100%",
          },

          backgroundColor: "transparent",
          border: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        },
      }}
      sx={{
        margin: 0,
        width: "100%",
        height: "100%",
      }}
      placeholder=""
    />
  );
};
