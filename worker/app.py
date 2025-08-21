import os
import sys
import threading
import subprocess
from flask import Flask

app = Flask(__name__)

def run_task_background():
    try:
        subprocess.run([sys.executable, "main.py"], check=True)
    except Exception:
        pass  # no logs

@app.route("/health", methods=["GET", "HEAD"])
def health():
    return ("", 204)

@app.route("/run-task", methods=["POST"])
def run_task():
    threading.Thread(target=run_task_background, daemon=True).start()
    return ("", 204)

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    app.run(host="0.0.0.0", port=port)