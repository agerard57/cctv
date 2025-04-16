"""
USB device detection module that returns the list of all mounted devices.
"""
import os
import platform
from typing import List

# Check if running on Linux
IS_LINUX = platform.system() == "Linux"

def get_mounted_usb_devices() -> List[str]:
    """
    Return a list of all mounted USB devices.
    This function doesn't validate devices, just returns their names.
    """
    if not IS_LINUX:
        print("Not on Linux: Simulating no devices")
        return []
        
    mount_path = "/media"  # Common mount location, adjust if needed
    
    # Check if mount path exists
    if not os.path.exists(mount_path):
        return []

    # Return list of all mounted devices
    try:
        return os.listdir(mount_path)
    except Exception as e:
        print(f"Error reading USB devices: {e}")
        return []
