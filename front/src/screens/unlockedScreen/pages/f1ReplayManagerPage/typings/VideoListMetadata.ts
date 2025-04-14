import { DateTime } from "luxon";
import { RoomCodes } from "./RoomCodes";

export interface VideoListInfos {
  filePath: string;
  originalFileName: string;
  thumbnailFilePath: string;
  dateTime: DateTime;
  duration: number;
  roomCode: RoomCodes;
}
