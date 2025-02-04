import platform
import subprocess
import requests

def get_hwid():
    try:
        hwid = subprocess.check_output('wmic csproduct get uuid', shell=True).decode().split('\n')[1].strip()
        return hwid
    except Exception as error:
        return f"Error: {str(error)}"

def get_os():
    return platform.system()

def get_ip():
    try:
        response = requests.get('https://api64.ipify.org?format=text', timeout=5)
        return response.text.strip()
    except Exception as error:
        return f"Error: {str(error)}"
    

if __name__ == "__main__":
    print(f"HWID: {get_hwid()}")
    print(f"Public IP: {get_ip()}")
    print(f"OS: {get_os()}")