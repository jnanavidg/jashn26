import io, os, re
from dotenv import load_dotenv
load_dotenv()
from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS
import database

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DIST = os.path.join(ROOT, "frontend", "dist")
ASSETS = os.path.join(ROOT, "assets")
SITE_URL = os.environ.get("SITE_URL", "http://localhost:5000")

app = Flask(__name__, static_folder=None)
app.config["MAX_CONTENT_LENGTH"] = 8 * 1024
origins = [o.strip() for o in os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173").split(",") if o.strip()]
CORS(app, resources={r"/api/*": {"origins": origins}}, methods=["POST", "GET"])
database.init_db()

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$")
ID_RE = re.compile(r"^\d{2,4}$")

@app.post("/api/register")
def register():
    data = request.get_json(silent=True) or {}
    name = " ".join(str(data.get("fullName", "")).split())
    email = str(data.get("email", "")).strip().lower()
    sid = str(data.get("studentId", "")).strip()
    if len(name) < 2 or len(name) > 80:
        return jsonify(error="Please enter your full name."), 400
    if not EMAIL_RE.match(email) or len(email) > 120:
        return jsonify(error="That email doesn't look right."), 400
    if not ID_RE.match(sid):
        return jsonify(error="Student ID should be a 2 to 4 digit number."), 400
    status = database.register(name, email, sid)
    return jsonify(status=status), 201 if status == "created" else 200

@app.get("/api/qr.png")
def qr():
    import qrcode  # encodes ONLY the site URL
    img = qrcode.make(SITE_URL, box_size=14, border=3)
    buf = io.BytesIO(); img.save(buf, format="PNG"); buf.seek(0)
    return send_file(buf, mimetype="image/png", download_name="jashn26-qr.png", as_attachment=request.args.get("download") == "1")

@app.get("/assets/<path:name>")
def assets(name):
    return send_from_directory(ASSETS, name, max_age=86400)

@app.get("/", defaults={"path": ""})
@app.get("/<path:path>")
def spa(path):
    if path.startswith("api/"):
        return jsonify(error="Not found"), 404
    if path and os.path.isfile(os.path.join(DIST, path)):
        return send_from_directory(DIST, path)
    return send_from_directory(DIST, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=os.environ.get("FLASK_DEBUG") == "1")
