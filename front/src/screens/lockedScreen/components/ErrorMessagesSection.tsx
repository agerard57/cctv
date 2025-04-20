import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";

interface Props {
  isSessionBlocked: boolean;
  blockedTimer: number;
  isKeypadAndHasUsedTries: boolean;
  isUnlocked: boolean;
  remainingTries: number;
  isCardReaderAndHasError: boolean;
}

export const ErrorMessagesSection: FC<Props> = ({
  isSessionBlocked,
  blockedTimer,
  isKeypadAndHasUsedTries,
  isUnlocked,
  remainingTries,
  isCardReaderAndHasError,
}) => {
  const { t } = useTranslation("LockedScreen");

  return (
    <div
      style={{
        position: "absolute",
        bottom: "2vh",
        right: "2vw",
        textAlign: "right",
        whiteSpace: "pre-wrap",
      }}
    >
      {isSessionBlocked ? (
        <Typography style={{ color: "#FFABAB" }}>
          {t("sessionStatus.blocked.timer", { count: blockedTimer })}
        </Typography>
      ) : isKeypadAndHasUsedTries && !isUnlocked ? (
        <>
          <Typography style={{ color: "#FFABAB" }} variant="description">
            {t("methods.f1.error.title")}
          </Typography>
          <Typography style={{ color: "#FFABAB" }}>
            <b>{t("methods.f1.error.remaining", { count: remainingTries })}</b>
          </Typography>
          <br />
          <Typography style={{ color: "#FFABAB" }}>{t("methods.f1.error.description")}</Typography>
        </>
      ) : isCardReaderAndHasError ? (
        <>
          <Typography style={{ color: "#FFABAB" }}>
            <b>{t("methods.f2.error.title")}</b>
          </Typography>
          <br />
          <Typography style={{ color: "#FFABAB" }}>{t("methods.f2.error.description")}</Typography>
        </>
      ) : null}
    </div>
  );
};
