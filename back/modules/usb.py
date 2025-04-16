"""
USB detection module for the CCTV application.
"""
import os
import platform
from typing import Literal

# Use absolute imports instead of relative imports
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import RIGHT_USB

# USB status type
USBStatus = Literal["missing", "valid", "invalid"]

# Check if running on Linux (assuming USB detection only works on Linux/RPi)
IS_LINUX = platform.system() == "Linux"


def get_usb_status() -> USBStatus:
    """
    Check the USB status:
    - missing: No USB devices found
    - valid: Expected USB device found
    - invalid: USB device found but not the expected one
    """
    # Skip hardware checks if not on Linux
    if not IS_LINUX:
        print("Not on Linux: Simulating missing USB")
        return "missing"
        
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
