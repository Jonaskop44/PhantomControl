import os

WEBSOCKET_URL = "ws://localhost:3001"
REST_API_URL = "http://localhost:3001/api/v1"

SERVICE_NAME = "PhantomControl"

APPDATA_DIR = os.path.join(os.getenv("LOCALAPPDATA"), "PhantomControl")
AUTH_FILE = os.path.join(APPDATA_DIR, "auth.json")