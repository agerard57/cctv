import styled from "@emotion/styled";
import ReactPlayer from "react-player";
import { FC, RefObject } from "react";
import { VideoControls, VideoListInfos } from "../typings";
import { useConstants } from "@/providers";
import { BlackContainerBase } from "../../../styles";

const PlayerContainer = styled(BlackContainerBase)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-right-radius: 15px;
`;

const Player = styled(ReactPlayer)`
  video {
    aspect-ratio: 16 / 9;
    border-top-right-radius: 15px;
  }
`;

export const PlayerWrapper: FC<{
  currentVideo: VideoListInfos;
  playerRef: RefObject<ReactPlayer | null>;
  videoControls: VideoControls;
  handleProgress: (state: { played: any; loaded: any }) => void;
}> = ({ currentVideo, playerRef, videoControls, handleProgress }) => {
  const appConstants = useConstants();

  return (
    <PlayerContainer>
      <Player
        key={currentVideo.originalFileName}
        url={currentVideo.filePath}
        ref={playerRef}
        width={"inherit"}
        height={"inherit"}
        onProgress={handleProgress}
        progressInterval={100}
        playing={videoControls.isPlaying}
        muted={appConstants.DEBUG_MODE}
      />
    </PlayerContainer>
  );
};
