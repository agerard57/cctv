import { useKeyDown, useProgress, useSettings } from "@/providers";
import { SupportedKeys, useKeyState } from "@/providers/keyState";
import { VideoListInfos, VideoControls } from "../typings";
import { BackspaceKeyIcon, CancelKeyIcon, PgDnKeyIcon, PgUpKeyIcon, SpaceAltKeyIcon, SpaceKeyIcon } from "../assets";
import { useEffect } from "react";
import { playSound } from "../../../../../core/helpers";
import { PgUpPgDnSFX } from "../../../../../core";
import { VideoPlayerSFX } from "../assets/sfx";

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
  const { appSettings } = useSettings();

  useEffect(() => {
    if (progress.isMediaProvided) {
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
      if (progress.isMediaProvided) {
        playSound(PgUpPgDnSFX, appSettings.volume);

        const currentIndex = videoList.findIndex((video) => video.originalFileName === currentVideo?.originalFileName);
        const newIndex = currentIndex === 0 ? videoList.length - 1 : currentIndex - 1;
        setCurrentVideo(videoList[newIndex]);
      }
    },
    PageDown: () => {
      if (progress.isMediaProvided) {
        playSound(PgUpPgDnSFX, appSettings.volume);

        const currentIndex = videoList.findIndex((video) => video.originalFileName === currentVideo?.originalFileName);
        const newIndex = currentIndex === videoList.length - 1 ? 0 : currentIndex + 1;
        setCurrentVideo(videoList[newIndex]);
      }
    },
    [SupportedKeys.SPACE]: () => {
      if (progress.isMediaProvided) {
        playSound(VideoPlayerSFX, appSettings.volume);
        const updatedControls: VideoControls = {
          ...videoControls,
          isPlaying: !videoControls.isPlaying,
          progress: videoControls.progress || 0,
        };
        setVideoControls(updatedControls);
      }
    },
    [SupportedKeys.BACKSPACE]: () => {
      if (progress.isMediaProvided) {
        playSound(VideoPlayerSFX, appSettings.volume);
        playerRef.current?.seekTo(Math.max(0, (currentTime || 0) - 5), "seconds");
      }
    },
    [SupportedKeys.PROD_DELETE]: () => {
      if (progress.isMediaProvided) {
        playSound(VideoPlayerSFX, appSettings.volume);
        setVideoControls({ isPlaying: false, progress: 0 });
        playerRef.current?.seekTo(0);
      }
    },
  });
};
