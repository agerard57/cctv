import axios from "axios";

const URL = "/api/rfid";

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
