"""
RFID reader module for the CCTV application.
"""
import os
import time
import platform
import threading
from typing import Optional, Callable

# Hardware detection
try:
    import RPi.GPIO as GPIO
    from mfrc522 import SimpleMFRC522
    RPI_AVAILABLE = platform.system() == "Linux" and os.path.exists("/dev/gpiomem")
except (ImportError, RuntimeError):
    RPI_AVAILABLE = False


class RFIDReader:
    """
    Handles RFID reader functionality with support for both
    hardware-based reading and override for testing.
    """
    def __init__(self):
        self.reader = None
        self.last_scanned_rfid = None
        self.current_override = None
        self._scanner_thread = None
        self._running = False
        
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
                        # Convert ID to string
                        self.last_scanned_rfid = str(id)
                        print(f"RFID card detected: {self.last_scanned_rfid}")
                        # Keep value for a short time before clearing
                        time.sleep(2)
                        self.last_scanned_rfid = None
                    
                    # Prevent CPU hogging
                    time.sleep(0.1)
                except Exception as e:
                    print(f"Error reading RFID: {e}")
                    time.sleep(1)  # Wait longer after error
        except Exception as e:
            print(f"RFID scanner thread error: {e}")
        finally:
            self.cleanup()
    
    def get_rfid_code(self, override_code: Optional[str] = None) -> Optional[str]:
        """
        Returns the RFID code with priority handling:
        1. New override code
        2. Previously set override code
        3. Hardware-detected RFID
        4. None if no card detected
        """
        # Priority 1: Use new override if provided
        if override_code:
            self.current_override = override_code
            return self.current_override

        # Priority 2: Use saved override if available
        if self.current_override:
            code = self.current_override
            self.current_override = None
            return code
            
        # Priority 3: Use hardware reading if available
        if RPI_AVAILABLE and self.last_scanned_rfid:
            return self.last_scanned_rfid
        
        # Priority 4: No RFID card detected
        return None
    
    def reset(self) -> None:
        """
        Reset all stored RFID values and state.
        This clears any overrides or cached card readings.
        """
        self.current_override = None
        self.last_scanned_rfid = None
        print("RFID reader state has been reset")
    
    def cleanup(self) -> None:
        """Cleanup GPIO resources."""
        self._running = False
        if RPI_AVAILABLE and GPIO:
            GPIO.cleanup()


# Singleton instance
reader = RFIDReader()
