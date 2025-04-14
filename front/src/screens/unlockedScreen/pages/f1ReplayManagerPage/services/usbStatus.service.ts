import axios from "axios";

const url = "/api/usb-status";

export const getUsbStatus = async (query: string = "") => {
  try {
    const response = await axios.get(`${url}${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching USB status:", error);
    throw error;
  }
};
