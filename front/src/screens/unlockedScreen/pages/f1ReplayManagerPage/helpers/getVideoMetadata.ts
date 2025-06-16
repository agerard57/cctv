import { DateTime } from "luxon";
import { Languages } from "@/providers";
import { Thumbnails } from "../assets";
import { RoomCodes, VideoListInfos } from "../typings";

type FormatDateAndTimeIntoDateTime = (date: string, time: string) => DateTime;

/**
 * Converts a date string and time string into a valid DateTime object.
 * This function assumes the format "yyyyMMdd HHmm" for date and time.
 *
 * @param date - The date string in "yyyyMMdd" format.
 * @param time - The time string in "HHmm" format (24-hour clock).
 * @returns A DateTime object representing the combined date and time.
 * @throws Error if the combined date and time format is invalid.
 */
const formatDateAndTimeIntoDateTime: FormatDateAndTimeIntoDateTime = (date, time) => {
  const dateTime = DateTime.fromFormat(`${date} ${time}`, "yyyyMMdd HHmm");

  if (!dateTime.isValid) {
    throw new Error(`Invalid date and time format: ${date} ${time}`);
  }

  return dateTime;
};

type GetVideoMetadata = (filePath: string, language: Languages) => Promise<VideoListInfos>;

/**
 * Retrieves metadata from a video file, including its file path, room code, date and time, and duration.
 * The metadata is extracted from the file name and video content.
 *
 * @param filePath - The path to the video file.
 * @param language - The language to use for formatting the date/time metadata.
 * @returns A promise that resolves to a VideoListInfos object containing the video metadata.
 * @throws Error if the filename format is invalid or if there is an issue loading the video.
 */
export const getVideoMetadata: GetVideoMetadata = async (filePath) => {
  const fileName = filePath.split("/").pop() ?? "";
  const baseName = fileName.split("-")[0];

  const match = baseName.match(/^([^/_]+)_(\d{8})_(\d{4})/);

  if (!match) {
    throw new Error(`Invalid filename format: ${filePath}`);
  }

  const [, unTypedRoomCode, date, time] = match;
  const originalFileName = `${unTypedRoomCode}_${date}_${time}`;


  if (!(unTypedRoomCode in RoomCodes)) {
    throw new Error(`Invalid room code: ${unTypedRoomCode}`);
  }

  const roomCode = unTypedRoomCode as RoomCodes;

  const formattedDateTime = formatDateAndTimeIntoDateTime(date, time);
  const thumbnailFilePath = Thumbnails[originalFileName as keyof typeof Thumbnails] ?? "";

  const videoElement = document.createElement("video");
  videoElement.src = filePath;

  return new Promise<VideoListInfos>((resolve, reject) => {
    const onLoadedMetadata = () => {
      resolve({
        filePath,
        originalFileName,
        thumbnailFilePath,
        dateTime: formattedDateTime,
        duration: isNaN(videoElement.duration) ? 0 : videoElement.duration,
        roomCode,
      });
      videoElement.removeEventListener("loadedmetadata", onLoadedMetadata);
    };

    const onError = () => {
      reject(new Error(`Error loading video: ${filePath}`));
      videoElement.removeEventListener("error", onError);
    };

    videoElement.addEventListener("loadedmetadata", onLoadedMetadata);
    videoElement.addEventListener("error", onError);
  });
};
