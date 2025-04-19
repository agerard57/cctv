import axios from "axios";

const URL = "/api/usb-devices";

export interface UsbDevicesResponse {
  devices: string[];
}

// TODO Add override
export const getUsbDevices = async (): Promise<UsbDevicesResponse> => {
  try {
    const response = await axios.get(URL);

    return response.data;
  } catch (error) {
    console.error("Error fetching USB devices:", error);

    return { devices: [] };
  }
};
