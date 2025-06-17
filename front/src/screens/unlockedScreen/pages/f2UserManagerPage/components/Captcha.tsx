import { FC, useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
// @ts-ignore I really dislike putting this... Oh well...
import { Noise } from "noisejs";
import { KeyButton, playSound } from "@/core";
import { PinInputs, usePinInputs } from "@/core";
import { useTranslation } from "react-i18next";
import { useConstants } from "../../../../../providers/constants";
import styled from "@emotion/styled";
import { useKeyDown } from "../../../../../providers/keyState/hooks";
import { CaptchaRefreshSFX, CaptchaSuccessSFX, SpaceKeyIcon } from "../assets";
import { useSettings } from "../../../../../providers";

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

  const [noiseLevel, setNoiseLevel] = useState(10);
  const [loading, setLoading] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const [isSpacebarHeld, setIsSpacebarHeld] = useState(false);
  const [isRefreshBlocked, setIsRefreshBlocked] = useState(false); // Track if refresh is blocked
  const inputRef = useRef<string>("");
  const { appSettings } = useSettings();

  const CAPTCHA_CODE = appConstants.unlockedScreen.userManager.CAPTCHA_CODE;

  const {
    pins,
    handlePinInput: originalHandlePinInput,
    handleBackspace: originalHandleBackspace,
    resetPin,
  } = usePinInputs(
    {
      correctCode: CAPTCHA_CODE,
    },
    {
      onFilled: () => setLoading(true),
      onSuccess: () => {
        playSound(CaptchaSuccessSFX, appSettings.volume);
        setLoading(false);
        onSolve();
      },
      onError: () => {
        setLoading(false);
        // Don't auto-reset, let user action trigger reset
      },
    },
  );

  // Custom handlers that keep our inputRef in sync
  const handlePinInput = (key: string) => {
    if (loading) return;

    // If we're in error state, reset first
    if (pins.some((status) => status === "error")) {
      resetPin();
      inputRef.current = key;
      originalHandlePinInput(key);
      return;
    }

    // Otherwise, just append the key
    if (inputRef.current.length < CAPTCHA_CODE.length) {
      inputRef.current += key;
      originalHandlePinInput(key);
    }
  };

  const handleBackspace = () => {
    // If we're in error state, reset everything
    if (pins.some((status) => status === "error")) {
      resetPin();
      inputRef.current = "";
      return;
    }

    // Otherwise just remove the last character
    if (inputRef.current.length > 0) {
      inputRef.current = inputRef.current.slice(0, -1);
      originalHandleBackspace();
    }
  };

  const generateReadableColor = () => {
    let r, g, b;
    do {
      r = Math.random() * 255;
      g = Math.random() * 255;
      b = Math.random() * 255;

      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

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

    const noiseGenerator = new Noise(Math.random());
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const adjustedNoiseLevel = Math.max(noiseLevel, 0.1);

    for (let i = 0; i < pixels.length; i += 4) {
      const value = noiseGenerator.simplex2(i % canvas.width, Math.floor(i / canvas.width)) * adjustedNoiseLevel * 255;
      const noiseValue = Math.floor(value);

      pixels[i] = 255 - noiseValue + Math.random() * 50;
      pixels[i + 1] = 255 - noiseValue + Math.random() * 50;
      pixels[i + 2] = 255 - noiseValue + Math.random() * 50;
      pixels[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);

    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`;
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.stroke();
    }

    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 2 + 1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`;
      ctx.fill();
    }

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
      ctx.fillStyle = generateReadableColor();
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
    const cooldown = 2000;

    // TODO TRY TO REFACTOR LOGIC TO CLEAN
    if (loading || now - lastRefreshTime < cooldown || isSpacebarHeld || isRefreshBlocked) {
      return;
    }

    setLastRefreshTime(now);
    setLoading(true);

    setTimeout(() => {
      setNoiseLevel((prev) => {
        const newNoiseLevel = Math.max(prev * 0.5, 0.1);

        if (newNoiseLevel <= 0.1) {
          setIsRefreshBlocked(true);
        }

        return newNoiseLevel;
      });
      setLoading(false);
      playSound(CaptchaRefreshSFX, appSettings.volume);
    }, cooldown);
  };

  useKeyDown(
    {
      " ": () => {
        if (!isSpacebarHeld) {
          setIsSpacebarHeld(true);
          handleRefresh();
        }
      },
      Backspace: handleBackspace,
    },
    (digit: string) => {
      if (!loading) {
        handlePinInput(digit);
      }
    },
    [loading, pins, isSpacebarHeld, isRefreshBlocked],
  );

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setIsSpacebarHeld(false);
      }
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

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
          <PinInputs
            loading={loading}
            pinShape="rectangle"
            pins={pins.map((status, index) => ({
              status,
              value: index < inputRef.current.length ? inputRef.current[index] : undefined,
            }))}
          />
        </div>
      </div>
      <Box display="flex" mt={1} gap={2}>
        <KeyButton
          label={t("captcha.refreshCaptcha")}
          icon={SpaceKeyIcon}
          direction="column"
          padding="0.7vh 3vw"
          isEnabled={!loading && !isRefreshBlocked}
        />
      </Box>
    </CaptchaContainer>
  );
};
