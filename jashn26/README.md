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
