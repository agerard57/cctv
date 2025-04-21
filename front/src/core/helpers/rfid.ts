import { getRfidStatus } from "../services/rfid.service";
import { RfidStatuses } from "../typings";

/**
 * Function to get the RFID status based on the received and valid codes.
 * @param receivedCode - The RFID code received from the reader.
 * @param validCode - The valid RFID code to compare against.
 * @returns The status of the RFID code, either VALID or INVALID or NONE.
 * */
const evaluateRfidStatus = (receivedCode: string | null, validCode: string): RfidStatuses => {
  if (!receivedCode) {
    return RfidStatuses.NONE;
  }

  if (receivedCode === validCode) {
    return RfidStatuses.VALID;
  }

  return RfidStatuses.INVALID;
};

/**
 * Fetches the RFID status and invokes the provided callback with the result.
 * @param rightCode - The valid RFID code to compare against.
 * @param codeOverride - An optional override code for testing purposes.
 * @param onHandleRfid - Callback to handle the fetched RFID status.
 */

export const fetchRfidStatus = async (
  validRfidCode: string,
  codeOverride: string | undefined,
  onHandleRfid: (code: RfidStatuses) => void,
) => {
  try {
    const fetchedRfidCode = await getRfidStatus(codeOverride);
    const rfidStatus = evaluateRfidStatus(fetchedRfidCode, validRfidCode);
    onHandleRfid(rfidStatus);
  } catch (error) {
    console.error("Failed to fetch RFID code:", error);
  }
};
