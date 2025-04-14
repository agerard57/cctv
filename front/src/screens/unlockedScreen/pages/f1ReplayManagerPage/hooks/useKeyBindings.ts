import { useKeyDown, useProgress } from "@/providers";
import { SupportedKeys, useKeyState } from "@/providers/keyState";
import { VideoListInfos, VideoControls } from "../typings";
import {
  BackspaceKeyIcon,
  CancelKeyIcon,
  EnterKeyIcon,
  PgDnKeyIcon,
  PgUpKeyIcon,
  SpaceAltKeyIcon,
  SpaceKeyIcon,
} from "../assets";
import { useEffect } from "react";

export const useKeyBindings = ({
  videoList,
  currentVideo,
  setCurrentVideo,
  playerRef,
  videoControls,
  setVideoControls,
  currentTime,
}: {
  videoList: VideoListInfos[];
  currentVideo: VideoListInfos | undefined;
  setCurrentVideo: (video: VideoListInfos) => void;
  playerRef: React.RefObject<any>;
  videoControls: VideoControls;
  setVideoControls: (controls: VideoControls) => void;
  currentTime: number | undefined;
}) => {
  const { updateKeyState, resetKeyStates } = useKeyState();
  const { progress } = useProgress();

  useEffect(() => {
    if (!progress.isMediaProvided) {
      updateKeyState({
        Enter: EnterKeyIcon,
      });
    } else {
      updateKeyState({
        " ": !videoControls.isPlaying ? SpaceKeyIcon : SpaceAltKeyIcon,
        Backspace: BackspaceKeyIcon,
        PageUp: PgUpKeyIcon,
        PageDown: PgDnKeyIcon,
        Cancel: CancelKeyIcon,
      });
    }

    return () => {
      resetKeyStates();
    };
  }, [updateKeyState, resetKeyStates, videoControls, progress.isMediaProvided]);

  useKeyDown({
    PageUp: () => {
      if (!currentVideo) {
        setCurrentVideo(videoList[videoList.length - 1]);
      } else {
        const currentIndex = videoList.findIndex((video) => video.originalFileName === currentVideo.originalFileName);
        const newIndex = currentIndex === 0 ? videoList.length - 1 : currentIndex - 1;
        setCurrentVideo(videoList[newIndex]);
      }
    },
    PageDown: () => {
      if (!currentVideo) {
        setCurrentVideo(videoList[0]);
      } else {
        const currentIndex = videoList.findIndex((video) => video.originalFileName === currentVideo.originalFileName);
        const newIndex = currentIndex === videoList.length - 1 ? 0 : currentIndex + 1;
        setCurrentVideo(videoList[newIndex]);
      }
    },
    [SupportedKeys.SPACE]: () => {
      if (currentVideo) {
        const updatedControls: VideoControls = {
          ...videoControls,
          isPlaying: !videoControls.isPlaying,
          progress: videoControls.progress || 0,
        };
        setVideoControls(updatedControls);
      }
    },
    [SupportedKeys.BACKSPACE]: () => {
      if (currentVideo && playerRef.current) {
        playerRef.current.seekTo(Math.max(0, (currentTime || 0) - 5), "seconds");
      }
    },
    [SupportedKeys.TODO_DELETE]: () => {
      if (currentVideo && playerRef.current) {
        setVideoControls({ isPlaying: false, progress: 0 });
        playerRef.current.seekTo(0);
      }
    },
  });
};
