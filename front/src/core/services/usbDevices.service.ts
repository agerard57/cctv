import axios from "axios";

const URL = "/api/usb-devices";

export type GetUsbDevices = (overrideDevice?: string) => Promise<{
  devices: string[];
}>;

// TODO Add debug skips to other enigmas
/**
 * Fetches a list of USB devices from the server.
 *
 * @param overrideDevice - An optional parameter to specify a device to override.
 *                         If provided, it will be sent as a query parameter (`override_device`).
 * @returns A promise that resolves to an object containing the list of USB devices.
 */
export const getUsbDevices: GetUsbDevices = async (overrideDevice) => {
  try {
    const params = overrideDevice ? { override_device: overrideDevice } : undefined;
    const response = await axios.get(URL, { params });

    return response.data;
  } catch (error) {
    console.error("Error fetching USB devices:", error);

    return { devices: [] };
  }
};
