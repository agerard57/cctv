"""
Health check module for the backend.
"""

def get_health_status() -> dict:
    """
    Returns the health status of the backend.

    Returns:
        A dictionary containing the health status.
    """
    return {"status": "ok", "message": "Backend is operational"}
