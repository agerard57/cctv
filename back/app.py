"""
Main FastAPI application for the CCTV system.
"""
from fastapi import FastAPI, Query
from typing import Dict, Optional, Any

# Import modules
from modules.rfid import reader as rfid_reader
from modules.usb import get_usb_status

# Create FastAPI app
app = FastAPI(title="CCTV Control API")

# Start RFID scanner on startup
@app.on_event("startup")
def startup_event():
    """Initialize services on application startup."""
    rfid_reader.start_scanner()

@app.get("/usb-status")
def usb_status(override_status: Optional[str] = Query(None)) -> Dict[str, str]:
    """
    Returns the USB status. If `override_status` is provided, it overrides the actual status.
    
    Args:
        override_status: Optional status to override actual hardware status
        
    Returns:
        Dictionary with USB status (missing, valid, or invalid)
    """
    if override_status in {"missing", "valid", "invalid"}:
        return {"status": override_status}

    status = get_usb_status()
    return {"status": status}

@app.get("/rfid-code")
def rfid_code(override_code: Optional[str] = Query(None)) -> Dict[str, Optional[str]]:
    """
    Returns the RFID code from hardware or override.
    
    Args:
        override_code: Optional code to override actual hardware reading
        
    Returns:
        Dictionary with RFID code or None if no card detected
    """
    code = rfid_reader.get_rfid_code(override_code)
    return {"rfid_code": code}

@app.post("/reset")
def reset_system() -> Dict[str, str]:
    """
    Reset the system state by clearing all cached values and overrides.
    
    Returns:
        Dictionary with status message
    """
    # Reset RFID reader state
    rfid_reader.reset()
    
    # Add any other module resets here if needed in the future
    
    return {"status": "success", "message": "System state has been reset"}

# Add cleanup for FastAPI shutdown
@app.on_event("shutdown")
def cleanup():
    """Clean up resources on application shutdown."""
    rfid_reader.cleanup()