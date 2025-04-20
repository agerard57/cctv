"""
Main FastAPI application for the CCTV system.
"""
import os
from fastapi import FastAPI
from typing import Dict, Optional, Any, List

import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from modules.rfid import reader as rfid_reader, RPI_AVAILABLE
from modules.usb_devices import get_mounted_usb_devices
from modules.health import get_health_status

app = FastAPI(title="CCTV App API")

@app.on_event("startup")
def startup_event():
    """Initialize services on application startup."""
    print(f"Starting application with RPI hardware: {RPI_AVAILABLE}")
    rfid_reader.start_scanner()

@app.get("/rfid")
def rfid(override_code: Optional[str] = None) -> Dict[str, Optional[str]]:
    """
    Returns the RFID code from hardware or a test code if provided.
    
    Args:
        override_code: Optional test code for simulation.
        
    Returns:
        Dictionary with RFID code or None if no card detected.
    """
    if override_code:
        print(f"[API] Override RFID Code provided: {override_code}")
        rfid_reader._set_rfid_code(override_code)
        return {"rfid_code": override_code}
    
    code = rfid_reader.get_rfid_code()
    print(f"[API] RFID Code fetched: {code}")
    return {"rfid_code": code}

@app.get("/usb-devices")
def usb_devices(override_device: Optional[str] = None) -> Dict[str, List[str]]:
    """Return a list of all mounted USB devices without validation

    Args:
        override_device: Optional test device for simulation.
        
    Returns:
        Dictionary containing the list of all USB devices
    """
    if override_device:
        print(f"[API] Override USB device provided: {override_device}")
        return {"devices": [override_device]}
    
    devices = get_mounted_usb_devices()
    return {"devices": devices if devices else []}

@app.get("/health")
def health() -> Dict[str, str]:
    """
    Health check endpoint to verify backend status.

    Returns:
        Dictionary with health status and message.
    """
    return get_health_status()

# Add cleanup for FastAPI shutdown
@app.on_event("shutdown")
def cleanup():
    """Clean up resources on application shutdown."""
    rfid_reader.cleanup()