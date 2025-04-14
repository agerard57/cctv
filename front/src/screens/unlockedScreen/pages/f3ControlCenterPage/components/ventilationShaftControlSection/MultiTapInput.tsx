import React, { useState, useEffect, useRef } from "react";
import { TextField } from "@mui/material";

interface MultiTapInputProps {
  onChange: (password: string) => void;
  enabled?: boolean; // Add enabled prop
}

// Key mappings based on numpad keys
const keys = [
  {
    name: "Numpad1",
    display: "1",
    content: ["."],
  },
  {
    name: "Numpad2",
    display: "2",
    content: ["a", "b", "c"],
  },
  {
    name: "Numpad3",
    display: "3",
    content: ["d", "e", "f"],
  },
  {
    name: "Numpad4",
    display: "4",
    content: ["g", "h", "i"],
  },
  {
    name: "Numpad5",
    display: "5",
    content: ["j", "k", "l"],
  },
  {
    name: "Numpad6",
    display: "6",
    content: ["m", "n", "o"],
  },
  {
    name: "Numpad7",
    display: "7",
    content: ["p", "q", "r", "s"],
  },
  {
    name: "Numpad8",
    display: "8",
    content: ["t", "u", "v"],
  },
  {
    name: "Numpad9",
    display: "9",
    content: ["w", "x", "y", "z"],
  },
  {
    name: "NumpadMultiply",
    display: "*",
  },
  {
    name: "Numpad0",
    display: "0",
    content: [" "],
  },
  {
    name: "NumpadDivide",
    display: "#",
  },
];

export const MultiTapInput: React.FC<MultiTapInputProps> = ({ onChange, enabled = true }) => {
  const [input, setInput] = useState("");
  const [displayInput, setDisplayInput] = useState("");
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);
  const [lastKeyPosition, setLastKeyPosition] = useState(-1);
  const [state, setState] = useState(0);
  // Add state for cursor blinking
  const [cursorVisible, setCursorVisible] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Add cursor blinking effect
  useEffect(() => {
    cursorIntervalRef.current = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500); // Blink every 500ms

    return () => {
      if (cursorIntervalRef.current) {
        clearInterval(cursorIntervalRef.current);
      }
    };
  }, []);

  // Clear the timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Focus the input field when component mounts and enabled changes
  useEffect(() => {
    if (enabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [enabled]);

  // Notify parent component of password changes
  useEffect(() => {
    onChange(input);
  }, [input, onChange]);

  const finalizeCurrentCharacter = () => {
    setLastKeyPressed(null);
    setCurrentKey(null);
    setState(0);
  };

  const handleBackspace = () => {
    if (input.length > 0) {
      // Remove the last character from both inputs
      setInput((prev) => prev.slice(0, -1));
      setDisplayInput((prev) => prev.slice(0, -1));

      // Reset the cycle state if needed
      if (lastKeyPosition === input.length - 1) {
        setLastKeyPressed(null);
        setState(0);
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    // Handle backspace key
    if (event.key === "Backspace" || event.code === "NumpadDecimal") {
      if (enabled) {
        handleBackspace();
        return;
      }
    }

    const key = event.code;
    const keyObj = keys.find((k) => k.name === key);

    if (!keyObj) return;

    startTimeRef.current = Date.now();
    setCurrentKey(key);
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const key = event.code;
    const keyObj = keys.find((k) => k.name === key);

    if (!keyObj || key !== currentKey) return;

    const keyPressTime = Date.now() - startTimeRef.current;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (keyObj.content === undefined) {
      // For keys without character cycling (like * or #)
      setInput((prev) => prev + keyObj.display);
      setDisplayInput((prev) => prev + keyObj.display);
      setLastKeyPosition(input.length);
      setLastKeyPressed(null);
    } else {
      // For keys with character cycling
      if (key === lastKeyPressed && lastKeyPosition === input.length - 1 && keyPressTime < 1000) {
        // Same key pressed again quickly - cycle through characters
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
        // Long press - use the key's number value
        setInput((prev) => prev + keyObj.display);
        setDisplayInput((prev) => prev + keyObj.display);
        setLastKeyPosition(input.length);
        setLastKeyPressed(key);
        setState(0);
      } else {
        // New key or first press - use first character
        setInput((prev) => prev + keyObj.content[0]);
        setDisplayInput((prev) => prev + keyObj.content[0]);
        setLastKeyPosition(input.length);
        setLastKeyPressed(key);
        setState(0);
      }

      // Set timeout to finalize character after delay
      timerRef.current = setTimeout(() => {
        finalizeCurrentCharacter();
      }, 1000);
    }
  };

  // Only attach event listeners when enabled
  useEffect(() => {
    if (enabled) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [currentKey, state, lastKeyPressed, lastKeyPosition, input, enabled, handleBackspace]);

  return (
    <TextField
      inputRef={inputRef}
      value={displayInput + (cursorVisible && enabled ? "|" : "")}
      fullWidth
      variant="standard" // Change to standard to remove outlined borders
      disabled={!enabled}
      InputProps={{
        readOnly: true,
        disableUnderline: true, // Remove underline from standard variant
        sx: {
          "& .MuiInputBase-input": {
            padding: 0,
            color: enabled ? "white" : "rgba(255, 255, 255, 0.5)",
            fontSize: "1.5vw",
            fontWeight: "bold",
            textAlign: "center",
            height: "100%",
          },
          // Remove all container styling that would conflict with parent Box
          backgroundColor: "transparent",
          border: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        },
      }}
      sx={{
        // Remove margins that might cause positioning issues
        margin: 0,
        width: "100%",
        height: "100%",
      }}
      placeholder=""
    />
  );
};
