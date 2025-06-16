import { useKeyDown, useProgress, useSettings } from "@/providers";
import { SupportedKeys, useKeyState } from "@/providers/keyState";
import { VideoListInfos, VideoControls } from "../typings";
import { BackspaceKeyIcon, CancelKeyIcon, PgDnKeyIcon, PgUpKeyIcon, SpaceAltKeyIcon, SpaceKeyIcon } from "../assets";
import { useEffect, useRef } from "react";
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
  const debounceRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const debounceAction = (key: string, action: () => void, delay: number = 10) => {
    if (debounceRef.current[key]) {
      clearTimeout(debounceRef.current[key]);
    }
    debounceRef.current[key] = setTimeout(action, delay);
  };

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
      Object.values(debounceRef.current).forEach(clearTimeout);
    };
  }, [updateKeyState, resetKeyStates, videoControls, progress.isMediaProvided]);

  useKeyDown({
    PageUp: () => {
      debounceAction("PageUp", () => {
        if (progress.isMediaProvided) {
          playSound(PgUpPgDnSFX, appSettings.volume);

          const currentIndex = videoList.findIndex((video) => video.originalFileName === currentVideo?.originalFileName);
          const newIndex = currentIndex === 0 ? videoList.length - 1 : currentIndex - 1;
          setCurrentVideo(videoList[newIndex]);
        }
      });
    },
    PageDown: () => {
      debounceAction("PageDown", () => {
        if (progress.isMediaProvided) {
          playSound(PgUpPgDnSFX, appSettings.volume);

          const currentIndex = videoList.findIndex((video) => video.originalFileName === currentVideo?.originalFileName);
          const newIndex = currentIndex === videoList.length - 1 ? 0 : currentIndex + 1;
          setCurrentVideo(videoList[newIndex]);
        }
      });
    },
    [SupportedKeys.SPACE]: () => {
      debounceAction("Space", () => {
        if (progress.isMediaProvided) {
          playSound(VideoPlayerSFX, appSettings.volume);
          const updatedControls: VideoControls = {
            ...videoControls,
            isPlaying: !videoControls.isPlaying,
            progress: videoControls.progress || 0,
          };
          setVideoControls(updatedControls);
        }
      });
    },
    [SupportedKeys.BACKSPACE]: () => {
      debounceAction("Backspace", () => {
        if (progress.isMediaProvided) {
          playSound(VideoPlayerSFX, appSettings.volume);
          playerRef.current?.seekTo(Math.max(0, (currentTime || 0) - 5), "seconds");
        }
      });
    },
    [SupportedKeys.PROD_DELETE]: () => {
      debounceAction("ProdDelete", () => {
        if (progress.isMediaProvided) {
          playSound(VideoPlayerSFX, appSettings.volume);
          setVideoControls({ isPlaying: false, progress: 0 });
          playerRef.current?.seekTo(0);
        }
      });
    },
  });
};
