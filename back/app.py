"""
Main FastAPI application for the CCTV system.
"""
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from typing import Dict, Optional, Any, List

import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from modules.rfid import rfid_reader
from modules.usb_devices import get_device_ids
from modules.health import get_health_status

app = FastAPI(title="CCTV App API")

@app.get("/api/rfid")
def rfid(override_code: Optional[str] = None) -> Dict[str, Optional[str]]:
    """
    Returns the RFID code from hardware or a test code if provided.
    
    Args:
        override_code: Optional test code for simulation.
        
    Returns:
        Dictionary with RFID code or None if no card detected.
    """
    if override_code:
        rfid_reader._set_rfid_code(override_code)
        return {"rfid_code": override_code}
    
    code = rfid_reader.get_rfid_code()
    return {"rfid_code": code}

@app.get("/api/usb-devices")
def usb_devices(override_device: Optional[str] = None) -> Dict[str, List[str]]:
    """Return a list of all mounted USB devices without validation

    Args:
        override_device: Optional test device for simulation.
        
    Returns:
        Dictionary containing the list of all USB devices
    """
    if override_device:
        return {"devices": [override_device]}
    
    devices = get_device_ids()
    return {"devices": devices if devices else []}

@app.get("/api/health")
def health() -> Dict[str, str]:
    """
    Health check endpoint to verify backend status.

    Returns:
        Dictionary with health status and message.
    """
    return get_health_status()

app.mount("/static", StaticFiles(directory="dist", html=True), name="static")

# Add cleanup for FastAPI shutdown
@app.on_event("shutdown")
def cleanup():
    """Clean up resources on application shutdown."""
    rfid_reader.cleanup()