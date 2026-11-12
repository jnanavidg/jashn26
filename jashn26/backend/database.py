import os, sqlite3
from datetime import datetime, timezone

DB_PATH = os.environ.get("DATABASE_PATH", os.path.join(os.path.dirname(__file__), "registrations.db"))

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_conn() as c:
        c.execute("""CREATE TABLE IF NOT EXISTS registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL,
            student_id TEXT NOT NULL UNIQUE,
            registered_at TEXT NOT NULL)""")

def register(full_name, email, student_id):
    """Returns 'created' or 'existing'. Parameterized queries only."""
    with get_conn() as c:
        row = c.execute("SELECT id FROM registrations WHERE student_id = ?", (student_id,)).fetchone()
        if row:
            return "existing"
        try:
            c.execute(
                "INSERT INTO registrations (full_name, email, student_id, registered_at) VALUES (?, ?, ?, ?)",
                (full_name, email, student_id, datetime.now(timezone.utc).isoformat()),
            )
        except sqlite3.IntegrityError:  # race condition on UNIQUE
            return "existing"
    return "created"
