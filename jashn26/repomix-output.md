This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
````
assets/
  WhatsApp Image 2026-11-11 at 21.17.04.jpeg
backend/
  .env.example
  app.py
  database.py
  requirements.txt
frontend/
  src/
    components/
      GoldBackground.jsx
    pages/
      Landing.jsx
      Register.jsx
      Reveal.jsx
    App.jsx
    index.css
    main.jsx
  index.html
  package.json
  postcss.config.js
  tailwind.config.js
  vite.config.js
.gitignore
README.md
````

# Files

## File: backend/.env.example
````
SITE_URL=https://your-deployed-site.example.com
ALLOWED_ORIGINS=https://your-deployed-site.example.com
DATABASE_PATH=registrations.db
````

## File: backend/app.py
````python
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
````

## File: backend/database.py
````python
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
````

## File: backend/requirements.txt
````
Flask==3.0.3
flask-cors==5.0.0
qrcode[pil]==7.4.2
python-dotenv==1.0.1
gunicorn==23.0.0
````

## File: frontend/src/components/GoldBackground.jsx
````javascript
import { useEffect, useRef } from "react";

// Flowing golden waves + drifting particles + soft orbs on one canvas.
export default function GoldBackground({ intensity = 1 }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w, h, raf, t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => { w = innerWidth; h = innerHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); addEventListener("resize", resize);
    const n = w < 640 ? 45 : 90;
    const parts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + 0.4, v: Math.random() * 0.25 + 0.05, a: Math.random() * 0.6 + 0.2, p: Math.random() * 6 }));
    const orbs = [{ x: .2, y: .3, r: 220 }, { x: .8, y: .65, r: 280 }, { x: .5, y: .95, r: 200 }];
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      orbs.forEach((o, i) => {
        const cx = o.x * w + Math.sin(t * .0004 + i) * 40, cy = o.y * h + Math.cos(t * .0005 + i) * 30;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, o.r);
        g.addColorStop(0, `rgba(212,168,75,${.13 * intensity})`); g.addColorStop(1, "rgba(212,168,75,0)");
        ctx.fillStyle = g; ctx.fillRect(cx - o.r, cy - o.r, o.r * 2, o.r * 2);
      });
      for (let k = 0; k < 5; k++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 12) {
          const y = h * (.55 + k * .035) + Math.sin(x * .004 + t * .0007 + k * .7) * (50 + k * 12) + Math.sin(x * .011 - t * .0005) * 18;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.strokeStyle = `rgba(${230 - k * 10},${185 - k * 8},${90},${(.38 - k * .06) * intensity})`;
        ctx.lineWidth = 1.2; ctx.shadowColor = "rgba(243,215,138,.6)"; ctx.shadowBlur = 12; ctx.stroke();
      }
      ctx.shadowBlur = 0;
      parts.forEach((p) => {
        p.y -= p.v; p.x += Math.sin(t * .001 + p.p) * .15;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        ctx.fillStyle = `rgba(243,215,138,${p.a * (.6 + .4 * Math.sin(t * .003 + p.p)) * intensity})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      });
      t += 16;
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); };
  }, [intensity]);
  return <canvas ref={ref} className="fixed inset-0 w-full h-full z-0 pointer-events-none" aria-hidden="true" />;
}
````

## File: frontend/src/pages/Landing.jsx
````javascript
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const rise = (d) => ({ initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] } });

export default function Landing({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col px-5 sm:px-10">
      <header className="flex items-center justify-between py-5">
        <img src="/assets/rit-logo.png" alt="Rajeev Institute of Technology" className="h-10 sm:h-12 w-auto" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
        <span className="text-[10px] sm:text-xs tracking-[0.3em] text-gold-light/80">FRESHERS' PARTY 2026</span>
      </header>
      <section className="flex-1 flex flex-col items-center justify-center text-center pb-16">
        <motion.p {...rise(0.2)} className="text-[11px] sm:text-sm tracking-[0.35em] text-white/90">RAJEEV INSTITUTE OF TECHNOLOGY</motion.p>
        <motion.p {...rise(0.35)} className="mt-3 text-[10px] sm:text-xs tracking-[0.3em] text-gold/80 max-w-xs sm:max-w-none">DEPARTMENT OF ARTIFICIAL INTELLIGENCE AND DATA SCIENCE</motion.p>
        <motion.h1 initial={{ opacity: 0, scale: 0.92, filter: "blur(14px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: 1.4, delay: 0.5 }}
          className="font-display font-bold gold-text leading-none mt-8 text-[clamp(4rem,19vw,10rem)]">JASHN'26</motion.h1>
        <motion.div {...rise(1)} className="mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <motion.p {...rise(1.1)} className="mt-6 text-xs sm:text-base tracking-[0.25em] text-white">A NEW BEGINNING, A BIGGER FAMILY.</motion.p>
        <motion.p {...rise(1.25)} className="mt-4 text-sm sm:text-lg text-white/60 font-light max-w-md">Your invitation to an unforgettable celebration awaits.</motion.p>
        <motion.div {...rise(1.5)} className="mt-10">
          <button onClick={onStart} className="gold-btn group">GET YOUR INVITATION <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></button>
        </motion.div>
        <motion.p {...rise(1.7)} className="mt-8 text-[11px] sm:text-xs tracking-[0.2em] text-white/40">SAT, 14 NOV 2026 · 11:15 AM – 5:00 PM · MAIN BLOCK SEMINAR HALL</motion.p>
      </section>
    </div>
  );
}
````

## File: frontend/src/pages/Register.jsx
````javascript
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const STEPS = [
  { key: "fullName", title: "Hey Junior! 👋", sub: "What should we call you?", label: "Full Name", type: "text", ph: "Your full name", auto: "name", cta: "CONTINUE" },
  { key: "email", title: "Let's stay connected! ✨", sub: "", label: "Email Address", type: "email", ph: "you@example.com", auto: "email", cta: "CONTINUE" },
  { key: "studentId", title: "One last thing! 🎓", sub: "What's your Student ID?", label: "Student ID", type: "text", ph: "e.g. 42", auto: "off", cta: "UNLOCK MY INVITATION" },
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(key, v) {
  v = v.trim();
  if (!v) return "Oops, this one can't be empty!";
  if (key === "fullName" && v.length < 2) return "Please enter your full name.";
  if (key === "email" && !EMAIL_RE.test(v)) return "Hmm, that email doesn't look right.";
  if (key === "studentId" && !/^\d{2,4}$/.test(v)) return "Student ID should be a 2 to 4 digit number.";
  return "";
}

export default function Register({ onDone }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [vals, setVals] = useState({ fullName: "", email: "", studentId: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef(null);
  const s = STEPS[i];
  useEffect(() => { const t = setTimeout(() => input.current?.focus(), 450); return () => clearTimeout(t); }, [i]);

  const go = async (e) => {
    e.preventDefault();
    const m = validate(s.key, vals[s.key]);
    if (m) return setErr(m);
    setErr("");
    if (i < 2) { setDir(1); return setI(i + 1); }
    setBusy(true);
    try {
      const r = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(vals) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(d.error || "Something went wrong. Please try again."); setBusy(false); return; }
      onDone(d.status === "existing");
    } catch { setErr("Couldn't reach the server. Check your connection and retry."); setBusy(false); }
  };
  const back = () => { setErr(""); setDir(-1); setI(i - 1); };

  return (
    <div className="min-h-screen flex flex-col px-6 sm:px-10 py-6">
      <div className="flex items-center justify-between h-10">
        {i > 0 ? <button onClick={back} className="flex items-center gap-2 text-gold-light/80 text-xs tracking-[0.2em] min-h-[44px]"><ArrowLeft size={16} /> BACK</button> : <span />}
        <span className="text-sm tracking-[0.3em] text-gold-light/80">0{i + 1}<span className="text-white/30"> / 03</span></span>
      </div>
      <div className="h-px bg-white/10 mt-3"><motion.div className="h-px bg-gold" animate={{ width: `${((i + 1) / 3) * 100}%` }} transition={{ duration: 0.6 }} /></div>
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.form key={i} custom={dir} onSubmit={go} noValidate className="w-full max-w-lg"
            variants={{ enter: (d) => ({ opacity: 0, x: 60 * d }), center: { opacity: 1, x: 0 }, exit: (d) => ({ opacity: 0, x: -60 * d }) }}
            initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold gold-text">{s.title}</h2>
            {s.sub && <p className="mt-2 text-xl sm:text-2xl text-white/90 font-light">{s.sub}</p>}
            <label htmlFor="f" className="block mt-10 text-[11px] tracking-[0.3em] text-gold/80">{s.label.toUpperCase()}</label>
            <input id="f" ref={input} className="gold-input" type={s.type} placeholder={s.ph} autoComplete={s.auto}
              inputMode={s.type === "email" ? "email" : s.key === "studentId" ? "numeric" : "text"} autoCapitalize={s.key === "email" ? "none" : "words"} maxLength={s.key === "email" ? 120 : s.key === "studentId" ? 4 : 80}
              value={vals[s.key]} onChange={(e) => { const v = s.key === "studentId" ? e.target.value.replace(/\D/g, "") : e.target.value; setVals({ ...vals, [s.key]: v }); setErr(""); }} aria-invalid={!!err} />
            <p className="h-6 mt-2 text-sm text-amber-300/90" role="alert">{err}</p>
            <button type="submit" disabled={busy} className="gold-btn mt-6 w-full sm:w-auto group">
              {busy ? "UNLOCKING…" : s.cta} {!busy && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
}
````

## File: frontend/src/pages/Reveal.jsx
````javascript
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Download, Share2 } from "lucide-react";

// Uses whichever poster file exists in /assets (png, jpg, jpeg, webp).
const FILES = ["invitation.png", "invitation.jpg", "invitation.jpeg", "invitation.webp"];

export default function Reveal({ returning }) {
  const reduce = useReducedMotion();
  const [toast, setToast] = useState("");
  const [fi, setFi] = useState(0);
  const file = FILES[fi];
  const note = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const share = async () => {
    const data = { title: "JASHN'26 — Freshers' Party", text: "I just unlocked my invitation to JASHN'26! 🎉 Get yours:", url: window.location.origin };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); note("Link copied! Share it with your friends ✨"); }
    } catch (e) { if (e.name !== "AbortError") note(data.url); }
  };

  return (
    <div className="h-[100svh] flex flex-col items-center justify-between px-4 py-4 overflow-hidden">
      {!reduce && <motion.div aria-hidden className="pointer-events-none fixed inset-y-0 -left-1/3 w-1/3 z-20"
        style={{ background: "linear-gradient(100deg,transparent,rgba(243,215,138,.35),transparent)" }}
        initial={{ x: "0%" }} animate={{ x: "420%" }} transition={{ duration: 1.8, delay: 0.8, ease: "easeInOut" }} />}
      {returning && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center text-gold-light text-xs sm:text-sm shrink-0">Looks like you've already unlocked your invitation! 🎉</motion.p>}

      {/* Poster is fitted to the screen: fully visible, never cropped or stretched */}
      <motion.div className="relative flex-1 min-h-0 w-full flex items-center justify-center py-2"
        initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, delay: reduce ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] }}>
        <div className="relative max-h-full max-w-full flex">
          <motion.div className="absolute -inset-px pointer-events-none" style={{ boxShadow: "0 0 0 1px rgba(212,168,75,.7), 0 0 50px rgba(212,168,75,.3)" }}
            animate={reduce ? {} : { opacity: [0.6, 1, 0.6] }} transition={{ duration: 3.5, repeat: Infinity }} />
          <img src={`/assets/${file}`} alt="JASHN'26 Freshers' Party invitation" decoding="async"
            onError={() => setFi((n) => Math.min(n + 1, FILES.length - 1))}
            className="block max-h-full max-w-full w-auto h-auto object-contain" />
        </div>
      </motion.div>

      <motion.div className="shrink-0 w-full flex flex-col items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : 3.4, duration: 0.8 }}>
        <div className="flex gap-3 w-full max-w-md justify-center">
          <a href={`/assets/${file}`} download={`JASHN26-Invitation.${file.split(".")[1]}`} className="gold-btn !px-3 sm:!px-8 flex-1 sm:flex-none !text-[11px] sm:!text-sm"><Download size={16} /> DOWNLOAD</a>
          <button onClick={share} className="gold-btn !px-3 sm:!px-8 flex-1 sm:flex-none !text-[11px] sm:!text-sm"><Share2 size={16} /> SHARE</button>
        </div>
        <p className="mt-3 text-center text-white/60 text-xs sm:text-sm font-light">Get ready for a day full of music, memories and new beginnings.</p>
        <p className="mt-1 font-display text-xl gold-text">See you at JASHN'26! ✨</p>
      </motion.div>
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 border border-gold/50 bg-ink/95 px-5 py-3 text-sm text-gold-light">{toast}</div>}
    </div>
  );
}
````

## File: frontend/src/App.jsx
````javascript
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GoldBackground from "./components/GoldBackground.jsx";
import Landing from "./pages/Landing.jsx";
import Register from "./pages/Register.jsx";
import Reveal from "./pages/Reveal.jsx";

export default function App() {
  const [stage, setStage] = useState("landing"); // landing | register | reveal
  const [returning, setReturning] = useState(false);
  const pages = {
    landing: <Landing onStart={() => setStage("register")} />,
    register: <Register onDone={(existing) => { setReturning(existing); setStage("reveal"); }} />,
    reveal: <Reveal returning={returning} />,
  };
  return (
    <div className="relative min-h-full bg-ink">
      <GoldBackground />
      <AnimatePresence mode="wait">
        <motion.main key={stage} className="relative z-10 min-h-screen"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
          {pages[stage]}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
````

## File: frontend/src/index.css
````css
@tailwind base; @tailwind components; @tailwind utilities;
html, body, #root { height: 100%; }
body { background: #070605; color: #fff; overflow-x: hidden; -webkit-tap-highlight-color: transparent; }
.gold-text { background: linear-gradient(100deg,#a87c2a,#f3d78a 45%,#d4a84b 70%,#f3d78a); -webkit-background-clip: text; background-clip: text; color: transparent; }
.gold-btn { @apply inline-flex items-center justify-center gap-2 min-h-[52px] px-8 border border-gold/60 text-gold-light tracking-[0.2em] text-xs sm:text-sm font-medium transition-all duration-300 hover:bg-gold/10 hover:border-gold hover:shadow-[0_0_30px_rgba(212,168,75,.25)] active:scale-[.97] disabled:opacity-50; }
.gold-input { @apply w-full bg-transparent border-0 border-b border-gold/40 py-3 text-xl sm:text-2xl text-white placeholder-white/25 outline-none transition-all duration-300 focus:border-gold-light focus:shadow-[0_1px_0_0_#f3d78a,0_14px_24px_-14px_rgba(212,168,75,.55)]; }
@media (prefers-reduced-motion: reduce) { * { animation-duration: .01ms !important; transition-duration: .01ms !important; } }
````

## File: frontend/src/main.jsx
````javascript
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
createRoot(document.getElementById("root")).render(<App />);
````

## File: frontend/index.html
````html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#070605" />
  <title>JASHN'26 — You're Invited</title>
  <meta name="description" content="Freshers' Party 2026 · Dept. of AI & Data Science, Rajeev Institute of Technology" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
</head>
<body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body>
</html>
````

## File: frontend/package.json
````json
{
  "name": "jashn26", "private": true, "version": "1.0.0", "type": "module",
  "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" },
  "dependencies": {
    "framer-motion": "^11.11.17", "lucide-react": "^0.451.0",
    "react": "^18.3.1", "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.3", "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47", "tailwindcss": "^3.4.14", "vite": "^5.4.10"
  }
}
````

## File: frontend/postcss.config.js
````javascript
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
````

## File: frontend/tailwind.config.js
````javascript
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {
    colors: { gold: { DEFAULT: "#d4a84b", light: "#f3d78a", deep: "#a87c2a" }, ink: "#070605" },
    fontFamily: { display: ["'Cormorant Garamond'", "serif"], sans: ["Inter", "system-ui", "sans-serif"] },
  } },
  plugins: [],
};
````

## File: frontend/vite.config.js
````javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": "http://localhost:5000", "/assets": "http://localhost:5000" } },
});
````

## File: .gitignore
````
node_modules/
frontend/dist/
backend/*.db
backend/.env
__pycache__/
````

## File: README.md
````markdown
# JASHN'26 — Interactive Digital Invitation

React + Tailwind + Framer Motion frontend, Flask + SQLite backend.

## 1. Add your assets (required)
Place the original files in `assets/` (poster can be .png, .jpg or .webp):
- `assets/invitation.png` (or .jpg/.webp) — the original JASHN'26 poster (shown untouched, aspect ratio preserved)
- `assets/rit-logo.png` — RIT logo

## 2. Run locally
```bash
# backend
cd backend && python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python app.py                 # http://localhost:5000

# frontend (new terminal)
cd frontend && npm install && npm run dev   # http://localhost:5173 (proxies /api and /assets)
```

## 3. Deploy (single server)
```bash
cd frontend && npm install && npm run build      # creates frontend/dist
cd ../backend && cp .env.example .env            # set SITE_URL + ALLOWED_ORIGINS
gunicorn -w 2 -b 0.0.0.0:8000 app:app
```
Flask serves the built site, `/assets`, and `/api`. Put it behind HTTPS (nginx/Caddy/Render/Railway).

## 4. QR code
Open `https://YOUR-SITE/api/qr.png?download=1` to download a PNG that encodes only `SITE_URL`.

## Privacy notes
- Registrations live only in `backend/registrations.db`; no list/read endpoint exists. Nothing is stored in localStorage.
- Student ID is unique; re-entering it shows "Looks like you've already unlocked your invitation! 🎉" and re-opens the invite without a duplicate row.
- Read data directly: `sqlite3 backend/registrations.db "select * from registrations"`.
````
