import ReactPlayer from "react-player";
import { FC, RefObject } from "react";
import { VideoControls, VideoListInfos } from "../typings";
import { PlayerWrapper } from "./PlayerWrapper";
import { VideoProgressBar } from "./VideoProgressBar";
import { VideoDetails } from "./VideoDetails";

interface VideoPlayerProps {
  currentVideo: VideoListInfos;
  playerRef: RefObject<ReactPlayer | null>;
  videoControls: VideoControls;
  setVideoControls: (controls: VideoControls) => void;
  progressPercentage: number;
  currentTime: number | undefined;
  handleProgress: (state: { played: any; loaded: any }) => void;
}

export const VideoPlayer: FC<VideoPlayerProps> = ({
  currentVideo,
  playerRef,
  videoControls,
  progressPercentage,
  currentTime,
  handleProgress,
}) => (
  <>
    <PlayerWrapper
      currentVideo={currentVideo}
      playerRef={playerRef}
      videoControls={videoControls}
      handleProgress={handleProgress}
    />
    <VideoProgressBar progressPercentage={progressPercentage} currentTime={currentTime} />
    <VideoDetails currentVideo={currentVideo} />
  </>
);
