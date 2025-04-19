"""
RFID reader module for the CCTV application.
"""
import os
import time
import platform
import threading
from typing import Optional, Callable, Tuple

# Better approach for importing from parent directory
import sys
# Use relative path from current file instead of hardcoded username
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

RPI_AVAILABLE = False
GPIO = None
SimpleMFRC522 = None

try:
    import RPi.GPIO as GPIO
    from mfrc522 import SimpleMFRC522
    RPI_AVAILABLE = platform.system() == "Linux" and os.path.exists("/dev/gpiomem")
    print(f"Hardware detection result: RPI_AVAILABLE={RPI_AVAILABLE}")
except (ImportError, RuntimeError) as e:
    print(f"Hardware imports failed: {e}")
    RPI_AVAILABLE = False


class RFIDReader:
    """
    Handles RFID reader functionality with support for hardware-based reading.
    """
    def __init__(self):
        self.reader = None
        self._scanner_thread = None
        self._running = False
        self.last_rfid_code: Optional[str] = None  # Cached RFID code
        self.clear_timer: Optional[threading.Timer] = None  # Timer to clear the RFID code
        
        # Initialize hardware if available
        if RPI_AVAILABLE:
            try:
                self.reader = SimpleMFRC522()
                print("RFID reader initialized successfully")
            except Exception as e:
                print(f"Failed to initialize RFID reader: {e}")
                self.reader = None
        else:
            print("Running in development mode: RFID hardware not available")
    
    def start_scanner(self) -> bool:
        """Start the background RFID scanner thread."""
        if not RPI_AVAILABLE or self.reader is None:
            print("Not starting RFID scanner - hardware not available")
            return False
            
        if self._scanner_thread is not None and self._scanner_thread.is_alive():
            return True
        
        self._running = True
        self._scanner_thread = threading.Thread(
            target=self._scanner_loop, 
            daemon=True
        )
        self._scanner_thread.start()
        print("RFID scanner thread started")
        return True
    
    def _scanner_loop(self) -> None:
        """Background thread function that continuously scans for RFID cards."""
        try:
            while self._running:
                try:
                    # Read the RFID card (non-blocking)
                    id, text = self.reader.read_no_block()
                    if id is not None:
                        print(f"[RFID Reader] Card detected: {id}")  # Log detected card
                        self._set_rfid_code(str(id))  # Cache the RFID code temporarily
                    else:
                        print("[RFID Reader] No card detected.")  # Log no card detected
                    
                    # Prevent CPU hogging
                    time.sleep(0.1)
                except Exception as e:
                    print(f"[RFID Reader] Error reading RFID: {e}")  # Log read error
                    time.sleep(1)  # Wait longer after error
        except Exception as e:
            print(f"[RFID Reader] Scanner thread error: {e}")  # Log thread error
        finally:
            print("[RFID Reader] Cleaning up resources.")  # Log cleanup
            self.cleanup()
    
    def _set_rfid_code(self, code: str) -> None:
        """
        Set the RFID code and start a timer to clear it after 5 seconds.
        """
        self.last_rfid_code = code
        print(f"[RFID Reader] RFID Code set: {code}")  # Log when the code is set
        if self.clear_timer:
            self.clear_timer.cancel()  # Cancel any existing timer
        self.clear_timer = threading.Timer(3.0, self._clear_rfid_code)  # Clear after 5 seconds
        self.clear_timer.start()

    def _clear_rfid_code(self) -> None:
        """
        Clear the cached RFID code.
        """
        print("[RFID Reader] Clearing cached RFID Code.")
        self.last_rfid_code = None

    def get_rfid_code(self) -> Optional[str]:
        """
        Returns the last cached RFID code if it exists.
        If the code is cleared, return None.
        """
        if self.last_rfid_code:
            print(f"[RFID Reader] Returning cached RFID Code: {self.last_rfid_code}")  # Log the returned code
        else:
            print("[RFID Reader] No RFID Code available.")  # Log when no code is available
        return self.last_rfid_code
    
    def cleanup(self) -> None:
        """Cleanup GPIO resources and stop the clear timer."""
        self._running = False
        if self.clear_timer:
            self.clear_timer.cancel()
        if RPI_AVAILABLE and GPIO:
            GPIO.cleanup()


# Singleton instance
reader = RFIDReader()
