import os
import glob
import subprocess
import re

def get_device_id(device_name: str) -> str:
    """
    For a device (e.g., 'sda'), return "${VENDOR}:${MODEL}" using udevadm.
    """
    cmd = ['udevadm', 'info', '--query=property', '--name=/dev/' + device_name]
    try:
        output = subprocess.check_output(cmd, text=True)
    except subprocess.CalledProcessError:
        return None

    vendor_id = None
    model_id = None
    for line in output.splitlines():
        if line.startswith('ID_VENDOR_ID='):
            vendor_id = line[len('ID_VENDOR_ID='):]
        elif line.startswith('ID_MODEL_ID='):
            model_id = line[len('ID_MODEL_ID='):]
    
    if vendor_id and model_id:
        return f"{vendor_id}:{model_id}"
    return None

def get_device_ids() -> list:
    """
    Return a list of "${VENDOR}:${MODEL}" for all sd* devices.
    """
    result = []
    for device in glob.glob('/dev/sd[a-z]'):
        device_name = os.path.basename(device)
        device_id = get_device_id(device_name)
        if device_id:
            result.append(device_id)
    return result
