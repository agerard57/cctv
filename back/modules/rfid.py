import MFRC522
import time
import threading
import sys

DEBUG_MODE = "--debug" in sys.argv

class RFIDReader:
    def __init__(self):
        if not DEBUG_MODE:
            self.reader = MFRC522.MFRC522()
        self.rfid_code = None
        self.lock = threading.Lock()
        self.timer_event = threading.Event()
        self.running = True
        self._start_reader_thread()

    def _uid_to_string(self, uid):
        """Converts UID to a string."""
        return ''.join([format(i, '02X') for i in uid])

    def _read_rfid(self):
        """Reads RFID from the reader."""
        if DEBUG_MODE:
            return None  # Skip hardware interaction in debug mode
        (status, tag_type) = self.reader.MFRC522_Request(self.reader.PICC_REQIDL)
        if status == self.reader.MI_OK:
            # Card found, now fetch the UID
            (status, uid) = self.reader.MFRC522_SelectTagSN()
            if status == self.reader.MI_OK:
                return self._uid_to_string(uid)
        return None

    def _set_rfid_code(self, code):
        """Sets the RFID code and resets the 5-second timer if new code is detected."""
        with self.lock:
            self.rfid_code = code
            self.timer_event.set()  # Reset the timer
            self.timer_event.clear()  # Wait for 5 seconds before clearing the code
            threading.Timer(5, self._clear_rfid_code).start()

    def _clear_rfid_code(self):
        """Clears the RFID code after 5 seconds."""
        with self.lock:
            self.rfid_code = None

    def start_reading(self):
        """Starts the RFID reader to continuously look for badges."""
        if DEBUG_MODE:
            return  # Skip reader thread in debug mode
        while self.running:
            code = self._read_rfid()
            if code and (self.rfid_code != code):
                self._set_rfid_code(code)
            time.sleep(0.1)  # Sleep a bit to avoid hogging the CPU

    def _start_reader_thread(self):
        """Starts the RFID reading in a background thread."""
        if DEBUG_MODE:
            return  # Skip thread creation in debug mode
        reader_thread = threading.Thread(target=self.start_reading)
        reader_thread.daemon = True
        reader_thread.start()

    def get_rfid_code(self):
        """Returns the current RFID code if any."""
        with self.lock:
            return self.rfid_code

    def cleanup(self):
        """Stops the reader."""
        self.running = False

# Create a global RFID reader object
rfid_reader = RFIDReader()
