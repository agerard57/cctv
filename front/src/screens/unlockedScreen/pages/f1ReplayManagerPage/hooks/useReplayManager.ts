import { useState, useEffect, useRef } from "react";
import { VideoListInfos, VideoControls, UsbStatuses } from "../typings";
import { getVideoMetadata } from "../helpers";
import ReactPlayer from "react-player";
import { useSettings } from "../../../../../providers";
import { Videos } from "../assets/videos";

export const useReplayManager = () => {
  const [currentUsbStatus, setCurrentUsbStatus] = useState<UsbStatuses>(UsbStatuses.MISSING);

  const [videoList, setVideoList] = useState<VideoListInfos[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoListInfos | undefined>();
  const [videoControls, setVideoControls] = useState<VideoControls>({ isPlaying: false, progress: 0 });
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const playerRef = useRef<ReactPlayer>(null);
  const { appSettings } = useSettings();
  const currentTime = playerRef?.current?.getCurrentTime();
  const progressPercentage =
    (currentTime && currentVideo && Math.min(Math.max((currentTime / currentVideo.duration) * 100, 0), 100)) || 0;

  const handleProgress = () => {
    const currentTime = playerRef?.current?.getCurrentTime() || 0;
    const duration = currentVideo?.duration || 1;
    const progress = (currentTime / duration) * 100;

    if (currentTime >= duration) {
      setVideoControls((prev) => ({ ...prev, isPlaying: false, progress: 100 }));
    } else {
      setVideoControls((prev) => ({ ...prev, progress }));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleProgress();
    }, 500);

    return () => clearInterval(interval);
  }, [currentVideo, playerRef]);

  useEffect(() => {
    Promise.all(Videos.map((video: string) => getVideoMetadata(video, appSettings.language)))
      .then((metadataList) => {
        setVideoList(metadataList);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [appSettings.language]);

  useEffect(() => {
    if (currentVideo) {
      const selectedVideoIndex = videoList.findIndex(
        (video) => video.originalFileName === currentVideo.originalFileName,
      );
      videoRefs.current[selectedVideoIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentVideo, videoList]);

  useEffect(() => {
    setVideoControls({ isPlaying: false, progress: 0 });
  }, [currentVideo]);

  useEffect(() => {
    if (videoList.length > 0 && !currentVideo) {
      setCurrentVideo(videoList[0]);
    }
  }, [videoList, currentVideo, setCurrentVideo]);

  return {
    videoList,
    currentUsbStatus,
    setCurrentUsbStatus,
    currentVideo,
    setCurrentVideo,
    videoRefs,
    playerRef,
    videoControls,
    setVideoControls,
    progressPercentage,
    currentTime,
    handleProgress,
  };
};
