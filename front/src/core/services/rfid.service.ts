import axios from "axios";

// TODO Rename to rfid
const URL = "/api/rfid-code";

export const getRfidStatus = async (overrideCode?: string): Promise<string> => {
  try {
    const params = overrideCode ? { override_code: overrideCode } : undefined;
    const response = await axios.get(URL, { params });

    return response.data.rfid_code;
  } catch (error) {
    console.error("Error fetching RFID code:", error);

    return "none";
  }
};
