import axios from "axios";

const url = "/api/usb-devices";

export interface UsbDevicesResponse {
  devices: string[];
}

export const getUsbDevices = async (): Promise<UsbDevicesResponse> => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching USB devices:", error);
    return { devices: [] };
  }
};
