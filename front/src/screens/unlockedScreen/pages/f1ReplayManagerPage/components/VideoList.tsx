import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import { FC, RefObject } from "react";
import { VideoListInfos } from "../typings";
import { formatDateTime, formatSecondsIntoMinutes } from "../helpers";
import { useSettings } from "@/providers";
import { useTranslation } from "react-i18next";
import { BlackContainerBase } from "@/core";

const VideoListContainer = styled(BlackContainerBase)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 15px;
  gap: 3vh;
  padding: 2vh 1vw;
  overflow-y: scroll;
`;

interface VideoListProps {
  videoList: VideoListInfos[];
  currentVideo: VideoListInfos | undefined;
  setCurrentVideo: (video: VideoListInfos) => void;
  videoRefs: RefObject<(HTMLDivElement | null)[]>;
}

export const VideoList: FC<VideoListProps> = ({ videoList, currentVideo, setCurrentVideo, videoRefs }) => {
  const { appSettings } = useSettings();
  const { t } = useTranslation("ReplayManagerPage");

  return (
    <VideoListContainer>
      {videoList.map((video, index) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            opacity: currentVideo?.originalFileName === video.originalFileName ? 1 : 0.5,
          }}
          onClick={() => setCurrentVideo(video)}
          ref={(el) => {
            if (videoRefs.current) videoRefs.current[index] = el;
          }}
          key={video.originalFileName}
        >
          <img
            src={video.thumbnailFilePath}
            alt={`Thumbnail of ${video.thumbnailFilePath}`}
            style={{ width: "8vw", borderRadius: "5px" }}
          />
          <div
            style={{
              textAlign: "right",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            <Typography>
              {t("fileName", {
                date: formatDateTime(video.dateTime, appSettings.language, "date"),
                time: formatDateTime(video.dateTime, appSettings.language, "time").replace(" ", "-"),
                roomCode: t(`room.${video.roomCode}.code`),
              })}
            </Typography>
            <Typography>{formatSecondsIntoMinutes(video.duration)}</Typography>
          </div>
        </div>
      ))}
    </VideoListContainer>
  );
};
