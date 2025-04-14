"""
USB detection module for the CCTV application.
"""
import os
from typing import Literal

from ..config import RIGHT_USB

# USB status type
USBStatus = Literal["missing", "valid", "invalid"]


def get_usb_status() -> USBStatus:
    """
    Check the USB status:
    - missing: No USB devices found
    - valid: Expected USB device found
    - invalid: USB device found but not the expected one
    """
    mount_path = "/media"  # Adjust if needed (e.g., /mnt)
    
    # Check if mount path exists
    if not os.path.exists(mount_path):
        return "missing"

    # Check for mounted devices
    devices = os.listdir(mount_path)
    if not devices:
        return "missing"

    # Check if the right USB is mounted
    for device in devices:
        if device == RIGHT_USB:
            return "valid"

    # USB found but not the right one
    return "invalid"
