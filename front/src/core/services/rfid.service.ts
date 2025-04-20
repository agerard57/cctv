import axios from "axios";

const URL = "/api/rfid";

type GetRfidStatus = (overrideCode?: string) => Promise<string>;

/**
 * Fetches the RFID status from the server.
 *
 * @param overrideCode - An optional override code to include in the request.
 * If provided, it will be sent as a query parameter `override_code`.
 *
 * @returns A promise that resolves to the RFID code as a string.
 */
export const getRfidStatus: GetRfidStatus = async (overrideCode) => {
  try {
    const params = overrideCode ? { override_code: overrideCode } : undefined;
    const response = await axios.get(URL, { params });

    return response.data.rfid_code;
  } catch (error) {
    console.error("Error fetching RFID code:", error);

    return "none";
  }
};
