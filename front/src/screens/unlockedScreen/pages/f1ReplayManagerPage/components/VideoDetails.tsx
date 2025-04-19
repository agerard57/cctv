import { FC } from "react";
import { Typography } from "@mui/material";

import { VideoListInfos } from "../typings";
import { formatDateTime, formatSecondsIntoMinutes } from "../helpers";
import { useSettings } from "@/providers";
import { useTranslation } from "react-i18next";
import { BlackContainerBase } from "../../../styles";
import styled from "@emotion/styled";

const VideoDetailsContainer = styled(BlackContainerBase)`
  flex-grow: 1;
  margin-top: 1vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 3vw;
  border-radius: 0 0 15px 0;

  > div {
    display: flex;
    flex-direction: column;
  }
`;

export const VideoDetails: FC<{ currentVideo: VideoListInfos }> = ({ currentVideo }) => {
  const { t } = useTranslation("ReplayManagerPage");
  const { appSettings } = useSettings();

  return (
    <VideoDetailsContainer>
      <div>
        <Typography variant="metadata">Duration: {formatSecondsIntoMinutes(currentVideo.duration)}</Typography>
        <Typography variant="metadata">Room: {t(`room.${currentVideo.roomCode}.full`)}</Typography>
      </div>
      <div style={{ textAlign: "right" }}>
        <Typography variant="metadata">
          {formatDateTime(currentVideo.dateTime, appSettings.language, "humanDate")}
        </Typography>
        <Typography variant="metadata">
          {formatDateTime(currentVideo.dateTime, appSettings.language, "time")}
        </Typography>
      </div>
    </VideoDetailsContainer>
  );
};
