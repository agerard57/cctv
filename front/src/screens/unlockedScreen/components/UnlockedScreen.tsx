import styled from "@emotion/styled";
import {
  AsteriskKeyIcon,
  CatsBackgroundImage,
  DefaultBackgroundImage,
  F1KeyIcon,
  F2KeyIcon,
  F3KeyIcon,
  F4KeyIcon,
  LasVegasBackgroundImage,
  MoneyBackgroundImage,
} from "../assets";
import { Typography, useTheme } from "@mui/material";

import { KeyButton, SecurityBrandText, SecurityProfilePicture } from "@/core";
import { FC, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { UnlockedScreenPages as UnlockedScreenPagesEnum } from "../typings";
import { UnlockedScreenPages } from "../typings";
import { Controls } from "./Controls";
import { ReplayManagerPage } from "@/screens/unlockedScreen/pages/f1ReplayManagerPage";
import { UserManagerPage } from "@/screens/unlockedScreen/pages/f2UserManagerPage";
import { ControlCenterPage } from "@/screens/unlockedScreen/pages/f3ControlCenterPage";
import { SettingsPage } from "@/screens/unlockedScreen/pages/f4SettingsPage";
import { SupportedKeys } from "@/providers/keyState";
import { useKeyDown } from "../../../providers/keyState/hooks";
import { useConstants, useSettings, Wallpapers } from "../../../providers";

const UnlockedScreenPagesComponentsMap: Record<UnlockedScreenPagesEnum, FC> = {
  [UnlockedScreenPagesEnum.REPLAY_MANAGER]: ReplayManagerPage,
  [UnlockedScreenPagesEnum.USER_MANAGER]: UserManagerPage,
  [UnlockedScreenPagesEnum.CONTROL_CENTER]: ControlCenterPage,
  [UnlockedScreenPagesEnum.SETTINGS]: SettingsPage,
};

const BackgroundImage = styled("div", {
  shouldForwardProp: (prop) => prop !== "wallpaper",
})<{ wallpaper: string }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background-image: url(${({ wallpaper }) => wallpaper});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(5px) brightness(60%);
`;

const getWallpaper = (wallpaper: Wallpapers): string => {
  switch (wallpaper) {
    case Wallpapers.MONEY:
      return MoneyBackgroundImage;
    case Wallpapers.LAS_VEGAS:
      return LasVegasBackgroundImage;
    case Wallpapers.CATS:
      return CatsBackgroundImage;
    default:
      return DefaultBackgroundImage;
  }
};

// TODO Make core generic
const WhiteContainerBase = styled.div<{ background: string }>`
  backdrop-filter: blur(10px);
  background: ${({ background }) => background};
`;

const Navbar = styled(WhiteContainerBase, {
  shouldForwardProp: (prop) => prop !== "isVisible",
})<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: ${({ isVisible }) => (isVisible ? "83vw" : "88vw")};
  height: 8vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 3vw;
  border-bottom-right-radius: 20px;
  transition: width 0.2s ease-in-out;
`;

// TODO When loading a page, loading and preload everything

const FunctionButtonsContainer = styled(WhiteContainerBase, {
  shouldForwardProp: (prop) => prop !== "isVisible",
})<{ isVisible: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 10px 20px 10px 10px;
  border-radius: 0 0 0 10px;
  gap: 10px;
  position: absolute;
  top: 0;
  right: 0;
  transform: ${({ isVisible }) => (isVisible ? "translateX(0)" : "translateX(50%)")};
  transition: transform 0.2s ease-in-out;
  position: fixed;
  width: max-content;
`;

const ControlsKeyContainer = styled(WhiteContainerBase, {
  shouldForwardProp: (prop) => prop !== "isVisible",
})<{ isVisible: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 10px 20px 10px 10px;
  border-top-left-radius: ${({ isVisible }) => (isVisible ? "0" : "10px")};
  gap: 10px;
  position: absolute;
  bottom: 0;
  right: 0;
  transform: ${({ isVisible }) => (isVisible ? "translateX(0)" : "translateX(50%)")};
  transition: transform 0.2s ease-in-out;
  position: fixed;
  width: max-content;
`;

// TODO Add loading for... loading... assets...
// TODO Reduce assets size and normalize to webp

// TODO MOVE TO CORE HELPERS
// TODO MOVE CONTROLS TO REPLAYMANAGER

// TODO MAKE THE CAPTCHA UNLOCK PERMANENT (WHEN SWITCHING AND SWITCHING BACK TO F2)

// TODO SAVE UNLOCKED PAGES STATES (F1 USB, F2 CAPTCHA)

// TODO BUG WHEN YOU
// TRIGGER THE ISVISIBLE ANIMATION FOR THE SIDE MENU THEN IMMEDIATLY HOLD *
// EXAMPLE: RELOAD THE PAGE AND WHEN YOU HAVE ISVISIBLETRUE, HOLD *. IT WILL DISAPPEAR NONTHELESS AND WHEN YOU HOLD IT AGAIN, IT WILL BUG AND ISVISIBLE WILL QUICKLY ALTERNATE BETWEEN TRUE AND FALSE (CHANGING VALUE YET TO BE CONFIRMED, JUST DESCRIBING THE BEHAVIOUR)
export const UnlockedScreen: FC = () => {
  const theme = useTheme();
  const { t } = useTranslation("UnlockedScreen");
  const [isVisible, setIsVisible] = useState(true);
  const [areControlsVisible, setAreControlsVisible] = useState(false);
  const isAsteriskKeyPressed = useRef(false);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const keyHeldRef = useRef(false);

  const { settings } = useSettings();

  const appConstants = useConstants();
  const [currentPage, setCurrentPage] = useState<UnlockedScreenPages>(appConstants.unlockedScreen.DEFAULT_PAGE);

  const functionButtons = {
    [UnlockedScreenPages.REPLAY_MANAGER]: {
      label: UnlockedScreenPages.REPLAY_MANAGER,
      icon: F1KeyIcon,
    },
    [UnlockedScreenPages.USER_MANAGER]: {
      label: UnlockedScreenPages.USER_MANAGER,
      icon: F2KeyIcon,
    },
    [UnlockedScreenPages.CONTROL_CENTER]: {
      label: UnlockedScreenPages.CONTROL_CENTER,
      icon: F3KeyIcon,
    },
    [UnlockedScreenPages.SETTINGS]: {
      label: UnlockedScreenPages.SETTINGS,
      icon: F4KeyIcon,
    },
  };

  const CurrentPage = UnlockedScreenPagesComponentsMap[currentPage];

  const allowedKeys = [
    UnlockedScreenPages.REPLAY_MANAGER,
    UnlockedScreenPages.USER_MANAGER,
    UnlockedScreenPages.CONTROL_CENTER,
    UnlockedScreenPages.SETTINGS,
    SupportedKeys.ASTERISK,
  ];

  // TODO See where it goes, I removed it from core.
  useKeyDown(
    allowedKeys.reduce(
      (callbacks, key) => {
        callbacks[key] = () => {
          if (Object.values(UnlockedScreenPages).includes(key as UnlockedScreenPages)) {
            if (pressTimerRef.current) return;
            keyHeldRef.current = true;
            setCurrentPage(key as UnlockedScreenPages);
            pressTimerRef.current = setTimeout(() => {
              setIsVisible(true);
              pressTimerRef.current = null;
            }, 90);
          } else if (key === SupportedKeys.ASTERISK) {
            if (!isAsteriskKeyPressed.current) {
              isAsteriskKeyPressed.current = true;
              setAreControlsVisible(true);
              setIsVisible(true);
            }
          }
        };
        return callbacks;
      },
      {} as Partial<Record<string, () => void>>,
    ),
  );

  const handleKeyUp = (event: KeyboardEvent) => {
    if (Object.values(UnlockedScreenPages).includes(event.key as UnlockedScreenPages)) {
      keyHeldRef.current = false;
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }
      setIsVisible(false);
    }

    if (event.key === SupportedKeys.ASTERISK) {
      isAsteriskKeyPressed.current = false;
      setTimeout(() => {
        setIsVisible(false);
        setAreControlsVisible(false);
      }, 1000);
    }
  };

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!keyHeldRef.current) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [currentPage]);

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <BackgroundImage wallpaper={getWallpaper(settings.wallpaper)} />
      <Navbar isVisible={isVisible} background={theme.app.core.whiteTransparentBackground}>
        <SecurityBrandText size="small" />
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={functionButtons[currentPage].icon}
            alt={`${currentPage} icon`}
            style={{
              height: "2.5vh",
              filter: "invert(100%)",
            }}
          />
          <Typography variant="pageTitle" style={{}}>
            {t(`title.${currentPage.toLowerCase()}`)}
          </Typography>
        </div>
        <div style={{ display: "flex", alignItems: "center", paddingRight: "2vw" }}>
          <img
            src={SecurityProfilePicture}
            alt="Security profile picture"
            style={{ padding: "0 1vw 0 0", height: "4vh" }}
          />
          {/* TODO This will have to be voided */}
          <Typography>{t("user.userName", { ns: "Core" })}</Typography>
        </div>
      </Navbar>
      <div style={{ position: "absolute", top: "13vh", right: 0, zIndex: 1 }}>
        <FunctionButtonsContainer isVisible={isVisible} background={theme.app.core.whiteTransparentBackground}>
          {Object.entries(functionButtons).map(([key, { label, icon }]) => (
            <KeyButton key={key} label={label} icon={icon} isEnabled={currentPage === key} />
          ))}
        </FunctionButtonsContainer>
      </div>
      <div style={{ position: "absolute", top: "13vh", right: 0, zIndex: 1 }}>
        <ControlsKeyContainer isVisible={isVisible} background={theme.app.core.whiteTransparentBackground}>
          <KeyButton label={"Keyboard"} icon={AsteriskKeyIcon} direction="column" isEnabled />
        </ControlsKeyContainer>
      </div>

      {isVisible && areControlsVisible && <Controls />}
      <div
        style={{
          margin: "11vh 6vw 5vh 1vw",
          display: "flex",
          flexDirection: "row",
          gap: "2vw",
          height: "85%",
          justifyContent: "space-around",
        }}
      >
        <CurrentPage />
      </div>
    </div>
  );
};
