import { FC, useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
// @ts-ignore I really dislike putting this... Oh well...
import { Noise } from "noisejs";
import { KeyButton } from "@/core";
import { LoadingSpinner, PinInputs, usePinInputs } from "@/core";
import { useTranslation } from "react-i18next";
import { useConstants } from "../../../../../providers/constants";
import styled from "@emotion/styled";
import { useKeyDown } from "../../../../../providers/keyState/hooks";
import { EnterKeyIcon, SpaceKeyIcon } from "../assets";

const CaptchaContainer = styled.div`
  padding: 10vh 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CaptchaImage = styled("canvas")`
  width: 23vw;
  height: 13vh;
  background: white;
  border: 2px solid black;
  border-radius: 25px;
  margin-top: 1vh;
`;

export const Captcha: FC<{ onSolve: () => void }> = ({ onSolve }) => {
  const { t } = useTranslation("UserManagerPage");
  const appConstants = useConstants();

  const [input, setInput] = useState(""); // Track entered digits
  const [noiseLevel, setNoiseLevel] = useState(10); // Start at max noise
  const [loading, setLoading] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(0); // Track last refresh time
  const [isSpacebarHeld, setIsSpacebarHeld] = useState(false); // Track if spacebar is held

  const CAPTCHA_CODE = appConstants.unlockedScreen.userManager.CAPTCHA_CODE;

  const {
    pins,
    handlePinInput: originalHandlePinInput,
    handleBackspace: originalHandleBackspace,
  } = usePinInputs(
    {
      correctCode: CAPTCHA_CODE,
    },
    {
      onFilled: () => setLoading(true),
      onSuccess: () => {
        setLoading(false);
        onSolve();
      },
      onError: () => setLoading(false),
    },
  );

  // TODO Fix this mess. Reentering code doesnt work
  const handlePinInput = (key: string) => {
    if (input.length < CAPTCHA_CODE.length) {
      setInput((prev) => prev + key); // Update input state
      originalHandlePinInput(key); // Call original handler
    }
  };

  const handleBackspace = () => {
    if (input.length > 0) {
      setInput((prev) => prev.slice(0, -1)); // Remove last character from input
      originalHandleBackspace(); // Call original handler
    }
  };

  const generateReadableColor = () => {
    let r, g, b;
    do {
      r = Math.random() * 255;
      g = Math.random() * 255;
      b = Math.random() * 255;

      // Calculate luminance
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

      // Ensure luminance is within a readable range (e.g., between 50 and 200)
      if (luminance > 50 && luminance < 200) break;
    } while (true);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const generateCaptcha = () => {
    const canvas = document.getElementById("captchaCanvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Generate noise with random colors
    const noiseGenerator = new Noise(Math.random());
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const adjustedNoiseLevel = Math.max(noiseLevel, 0.1);

    for (let i = 0; i < pixels.length; i += 4) {
      const value = noiseGenerator.simplex2(i % canvas.width, Math.floor(i / canvas.width)) * adjustedNoiseLevel * 255;
      const noiseValue = Math.floor(value);

      // Assign random colors to each pixel
      pixels[i] = 255 - noiseValue + Math.random() * 50; // Red channel
      pixels[i + 1] = 255 - noiseValue + Math.random() * 50; // Green channel
      pixels[i + 2] = 255 - noiseValue + Math.random() * 50; // Blue channel
      pixels[i + 3] = 255; // Alpha (opacity)
    }

    ctx.putImageData(imageData, 0, 0);

    // Add random lines
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`;
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.stroke();
    }

    // Add random dots
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 2 + 1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`;
      ctx.fill();
    }

    // Random transformations for CAPTCHA text with readable colors
    ctx.font = "bold 15px Arial";

    const xPosition = Math.random() * (canvas.width - 100);
    const yPosition = Math.random() * (canvas.height - 20);
    const rotation = (Math.random() - 0.5) * 0.4;
    const kerning = Math.random() * 5 + 5;

    ctx.save();
    ctx.translate(xPosition, yPosition);
    ctx.rotate(rotation);

    let currentX = 0;
    for (let i = 0; i < CAPTCHA_CODE.length; i++) {
      const char = CAPTCHA_CODE[i];
      ctx.fillStyle = generateReadableColor(); // Use readable color for each letter
      ctx.fillText(char, currentX, 0);
      currentX += kerning;
    }

    ctx.restore();
  };

  useEffect(() => {
    generateCaptcha();
  }, [noiseLevel]);

  const handleRefresh = () => {
    const now = Date.now();
    const cooldown = 1000; // 1-second cooldown

    if (loading || now - lastRefreshTime < cooldown || isSpacebarHeld) return; // Prevent refresh if cooldown or spacebar is held

    setLastRefreshTime(now); // Update last refresh time
    setLoading(true); // Set loading to true
    setTimeout(() => {
      // Reduce noise level by 30% of the current value, ensuring it doesn't drop below 0.1
      setNoiseLevel((prev) => Math.max(prev * 0.5, 0.1));
      setLoading(false); // Reset loading after 1 second
    }, 1000); // 1-second delay
  };

  const handleSubmit = () => {
    if (loading) return;

    setLoading(true);
    setTimeout(() => setLoading(false), 3000); // 3s loading

    if (input === CAPTCHA_CODE) {
      onSolve();
    }
  };

  useKeyDown(
    {
      Enter: handleSubmit,
      " ": () => {
        if (!isSpacebarHeld) {
          setIsSpacebarHeld(true); // Mark spacebar as held
          handleRefresh();
        }
      },
      Backspace: handleBackspace,
    },
    (digit: string) => {
      handlePinInput(digit);
    },
    [loading, input, pins, isSpacebarHeld],
  );

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      // TODO Space has an enum
      if (event.code === "Space") {
        setIsSpacebarHeld(false); // Reset spacebar held flag on key release
      }
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // TODO This CSS is dis.cus.ting
  return (
    <CaptchaContainer>
      <Typography>{t("captcha.verificationPrompt")}</Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 25,
          padding: "1vw",
          borderRadius: 17,
        }}
      >
        <CaptchaImage id="captchaCanvas" />
        <div style={{ display: "flex", gap: 10 }}>
          {loading ? (
            // TODO Put loading spinner in PinInputs
            <LoadingSpinner color="white" />
          ) : (
            <PinInputs
              pinShape="rectangle"
              pins={pins.map((status, index) => ({
                status,
                value: input[index] || undefined,
              }))}
            />
          )}
        </div>
      </div>
      <Box display="flex" mt={1} gap={2}>
        <KeyButton
          // TODO Icons and keyboard layout update
          label={t("captcha.refreshCaptcha")}
          icon={SpaceKeyIcon}
          direction="column"
          padding="0.7vh 1vw"
          // TODO IsEnabled State
          isEnabled={!loading}
        />
        <KeyButton
          label={t("captcha.enter")}
          icon={EnterKeyIcon}
          direction="column"
          padding="0.7vh 1vw"
          // TODO IsEnabled State
          isEnabled={!loading}
        />
      </Box>
    </CaptchaContainer>
  );
};
