import subprocess

def run_command(command):
    try:
        #test
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        response = result.stdout if result.stdout else result.stderr
        print(f"[Command output]: \n{response}")
        return response
    except Exception as error:
        print(f"[-] Error executing command: {str(error)}")