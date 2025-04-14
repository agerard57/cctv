import { FC } from "react";
import { useTheme } from "@mui/material";
import { SecurityProfilePicture, SecurityBrandText, PinInputs, LoadingSpinner } from "@/core";
import { RfidStatuses, SessionStatuses } from "../typings";
import { useConstants } from "@/providers/constants";
import { ErrorMessagesSection } from "./ErrorMessagesSection";
import { LoginMethods } from "../typings/LoginMethods";
import { useLockedScreen } from "../hooks";
import { LoginMethodSelector } from "./LoginMethodSelector";
import { RfidPrompt } from "./RfidPrompt";
import { SessionStatusDisplay } from "./SessionStatusDisplay";
import { UserInfoDisplay } from "./UserInfoDisplay";
import { BackgroundImage, LockedScreenContainer, LockedScreenBox } from "../styles";
import { DebugRfidButtons } from "./DebugRfidButtons";

// TODO SFX For F1, F2, ... too
// TODO Move the SFX hook to core since F1 menus are on multiple pages
// TODO The GStreamer FDK AAC plugin is missing, AAC playback is unlikely to work.
// TODO SFX The Flip Side Pager

export const LockedScreen: FC = () => {
  const theme = useTheme();
  const appConstants = useConstants();

  const { selectedMethod, sessionStatus, loading, pins, remainingTries, blockedTimer, rfidStatus, handleRfidCode } =
    useLockedScreen();

  return (
    /* TODO Maybe set to <> */
    <div>
      <BackgroundImage />
      <LockedScreenContainer>
        <div style={{ display: "flex", justifyContent: "flex-start", width: "70vw", marginBottom: "0.5vh" }}>
          <SecurityBrandText size="medium" />
        </div>
        <LockedScreenBox style={{ background: theme.app.core.whiteTransparentBackground }}>
          {sessionStatus === SessionStatuses.LOCKED && !loading && (
            <LoginMethodSelector selectedMethod={selectedMethod} />
          )}
          {!loading && (
            <ErrorMessagesSection
              isSessionBlocked={sessionStatus === SessionStatuses.BLOCKED}
              blockedTimer={blockedTimer || 0}
              isKeypadAndHasUsedTries={
                selectedMethod === LoginMethods.KEYPAD && remainingTries < appConstants.lockedScreen.keypad.MAX_TRIES
              }
              isUnlocked={sessionStatus === SessionStatuses.UNLOCKED}
              remainingTries={remainingTries}
              isCardReaderAndHasError={selectedMethod === LoginMethods.CARD_READER && rfidStatus === RfidStatuses.ERROR}
            />
          )}
          <img
            src={SecurityProfilePicture}
            alt="Security profile picture"
            style={{ padding: "0 5vw", maxWidth: "80%", maxHeight: "60%" }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "4vh" }}>
            <UserInfoDisplay />
            <div style={{ display: "grid", gap: "1.6vh" }}>
              <SessionStatusDisplay sessionStatus={sessionStatus} />
              <div style={{ display: "flex", gap: "1.4vw" }}>
                {loading ? (
                  <LoadingSpinner color="white" />
                ) : selectedMethod === LoginMethods.KEYPAD && sessionStatus === SessionStatuses.LOCKED ? (
                  <PinInputs pinShape="circle" pins={pins} />
                ) : selectedMethod === LoginMethods.CARD_READER && sessionStatus === SessionStatuses.LOCKED ? (
                  <RfidPrompt />
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </LockedScreenBox>

        {appConstants.DEBUG_MODE && selectedMethod === LoginMethods.CARD_READER && (
          <DebugRfidButtons handleRfidCode={handleRfidCode} />
        )}
      </LockedScreenContainer>
    </div>
  );
};
