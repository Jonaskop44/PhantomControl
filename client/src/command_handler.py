import subprocess
import os

def run_command(command):
    try:
        desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
        result = subprocess.run(command, shell=True, capture_output=True, text=True, cwd=desktop_path)
        response = result.stdout if result.stdout else result.stderr
        print(f"[Command output]: \n{response}")
        return response
    except Exception as error:
        print(f"[-] Error executing command: {str(error)}")