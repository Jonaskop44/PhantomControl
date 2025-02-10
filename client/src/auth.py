import json
import os
import requests
import keyring
import sys
from config import REST_API_URL, SERVICE_NAME, APPDATA_DIR, AUTH_FILE



# Erstelle den AppData-Ordner, falls er nicht existiert
os.makedirs(APPDATA_DIR, exist_ok=True)

def save_auth_data(email, token):
    with open(AUTH_FILE, "w") as f:
        json.dump({"email": email, "token": token}, f)

def load_auth_data():
    if os.path.exists(AUTH_FILE):
        with open(AUTH_FILE, "r") as f:
            return json.load(f)
    return None

def get_stored_password(email):
    return keyring.get_password(SERVICE_NAME, email)

def store_password(email, password):
    keyring.set_password(SERVICE_NAME, email, password)

def get_valid_token():
    auth_data = load_auth_data()

    if not auth_data:
        return login_and_save_token()

    token = auth_data.get("token")
    response = requests.post(f"{REST_API_URL}/auth/verify", json={"token": token})

    if response.status_code == 201:
        return token
    else:
        return login_and_save_token()

def login_and_save_token():
    auth_data = load_auth_data()

    if auth_data:
        email = auth_data["email"]
        password = get_stored_password(email)
        if not password:
            print("[❌] Kein gespeichertes Passwort gefunden.")
            return None
    else:
        email = input("Email: ")
        password = input("Passwort: ")

    response = requests.post(f"{REST_API_URL}/auth/login", json={"email": email, "password": password})

    if response.status_code == 201:
        token = response.json()["backendTokens"]["accessToken"]
        save_auth_data(email, token)
        store_password(email, password)  
        print("[✅] Erfolgreich eingeloggt!")
        return token
    else:
        print("[❌] Login fehlgeschlagen! Falsche Daten?")
        return None

def get_user_id():
    token = get_valid_token()

    if not token:
        print("[❌] Kein gültiges Token erhalten! Beende...")
        sys.exit(1)

    url = f"{REST_API_URL}/user/token/data/{token}"

    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data.get("id")
        else:
            print(f"[❌] Fehler bei der API-Abfrage: {response.text}")
            sys.exit(1)
    except requests.RequestException as e:
        print(f"[❌] Netzwerkfehler: {e}")
        sys.exit(1)
