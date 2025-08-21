import os
import sys
import threading
import subprocess
from flask import Flask, jsonify

app = Flask(__name__)


def run_task_background():
    """Run main.py in a background process and display logs."""
    try:
        subprocess.run(
            [sys.executable, "main.py"],
            check=True,
            stdout=sys.stdout,  # Redirect stdout to the terminal
            stderr=sys.stderr   # Redirect stderr to the terminal
        )
    except Exception as e:
        print(f"Error running main.py: {e}", file=sys.stderr)


@app.get("/health")
def health():
    return jsonify({"ok": True})


@app.post("/run-task")
def run_task():
    # Fire-and-forget run of the Python script, no logging, no auth
    threading.Thread(target=run_task_background, daemon=True).start()
    return jsonify({"queued": True})


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    app.run(host="0.0.0.0", port=port)
