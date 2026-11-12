# JASHN'26 — Interactive Digital Invitation

React + Tailwind + Framer Motion frontend. No registration, no database, no email.
The guest enters a name and student ID, and the invitation is shown straight away in the browser.

## 1. Add your assets (required)
Place the original files in `frontend/public/assets/` (poster can be .png, .jpg or .webp):
- `frontend/public/assets/invitation.png` (or .jpg/.webp) — the original JASHN'26 poster (shown untouched, aspect ratio preserved)
- `frontend/public/assets/rit-logo.png` — RIT logo

## 2. Run locally
```bash
cd frontend && npm install && npm run dev   # http://localhost:5173
```

## 3. Deploy
Static hosting is enough:
```bash
cd frontend && npm install && npm run build   # creates frontend/dist
```
Upload `frontend/dist` to Netlify, Vercel, GitHub Pages or any static host.
The optional Flask server in `backend/` only serves `frontend/dist` and the QR image:
```bash
cd backend && pip install -r requirements.txt && cp .env.example .env   # set SITE_URL + ALLOWED_ORIGINS
gunicorn -w 2 -b 0.0.0.0:8000 app:app
```

## 4. QR code
With the Flask server running, open `https://YOUR-SITE/api/qr.png?download=1` to download a PNG that encodes only `SITE_URL`.

## Privacy notes
- The name and student ID stay in the browser tab's memory only. Nothing is sent to a server, saved to a database or stored in localStorage.
- Student ID must be a 2 to 4 digit number.