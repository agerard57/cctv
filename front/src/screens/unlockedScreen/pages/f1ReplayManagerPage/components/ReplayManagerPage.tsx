import { FC, useState, useEffect } from "react";
import { InsertMedia } from "./InsertMedia";
import { VideoList } from "./VideoList";
import { VideoPlayer } from "./VideoPlayer";
import { useKeyBindings } from "../hooks/useKeyBindings";
import { useReplayManager } from "../hooks/useReplayManager";
import { useProgress } from "../../../../../providers";
import { Loading } from "../../../../../core";

// TODO when the video is over, first pause should put back the video to zero, instead, only the second pause restarts it directly

// TODO Make core generic
// TODO Remove other instances of this component on other files

// TODO WHEN CHANGING VIDEOS, WE CAN SEE THE DIV CHANGING SIZE FOR A WHILE

// TODO Reduce assets size and normalize to webp

export const ReplayManagerPage: FC = () => {
  const { progress } = useProgress();
  const [isLoading, setIsLoading] = useState(true);

  const {
    currentUsbStatus,
    setCurrentUsbStatus,
    videoList,
    currentVideo,
    setCurrentVideo,
    videoRefs,
    playerRef,
    videoControls,
    setVideoControls,
    progressPercentage,
    currentTime,
    handleProgress,
  } = useReplayManager();

  useKeyBindings({
    videoList,
    currentVideo,
    setCurrentVideo,
    playerRef,
    videoControls,
    setVideoControls,
    currentTime,
  });

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [progress.isMediaProvided]);

  const mediaContent = (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "45%",
          gap: "3vh",
        }}
      >
        <VideoList
          videoList={videoList}
          currentVideo={currentVideo}
          setCurrentVideo={setCurrentVideo}
          videoRefs={videoRefs}
        />
      </div>
      {currentVideo && (
        <div style={{ display: "flex", flexDirection: "column", width: "55vw" }}>
          <VideoPlayer
            currentVideo={currentVideo}
            playerRef={playerRef}
            videoControls={videoControls}
            setVideoControls={setVideoControls}
            progressPercentage={progressPercentage}
            currentTime={currentTime}
            handleProgress={handleProgress}
          />
        </div>
      )}
    </>
  );

  if (!progress.isMediaProvided) {
    return (
      <>
        <InsertMedia currentUsbStatus={currentUsbStatus} setCurrentUsbStatus={setCurrentUsbStatus} />
        <div style={{ display: "none" }}>{mediaContent}</div>
      </>
    );
  }

  return (
    <>
      {isLoading ? (
        <>
          <Loading />
          <div style={{ display: "none" }}>{mediaContent}</div>
        </>
      ) : (
        mediaContent
      )}
    </>
  );
};
