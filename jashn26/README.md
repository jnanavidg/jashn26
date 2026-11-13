# JASHN'26 — Interactive Digital Invitation

React + Tailwind + Framer Motion. Fully static: no backend, no registration, no database, no email.
The guest enters a name and student ID, and the invitation is shown straight away in the browser.

## 1. Add your assets (required)
Place the original files in `frontend/public/assets/` (poster can be .png, .jpg or .webp):
- `frontend/public/assets/invitation.png` (or .jpg/.webp) — the original JASHN'26 poster (shown untouched, aspect ratio preserved)
- `frontend/public/assets/rit-logo.png` — RIT logo

- `frontend/public/assets/asking.mp4`, `welcome.mp4`, `angry.mp4` — the three reaction videos (already included)

## 2. Run locally
```bash
cd frontend && npm install && npm run dev   # http://localhost:5173
```

## 3. Deploy on GitHub Pages
1. Push the project to GitHub (branch `main`).
2. Repo Settings, Pages, Source: **GitHub Actions**.
3. Every push to `main` builds `frontend/` and publishes it at `https://USERNAME.github.io/REPO-NAME/`.

## 4. QR code
Create a QR code for your published site link with any QR generator and print it on posters.

## Flow
Landing, name, student ID, then the asking video with "Are you coming?". Yes plays the welcome video with a greeting and then shows the invitation. No plays the angry video and nothing else.

## Privacy notes
- The name and student ID stay in the browser tab's memory only. Nothing is sent to a server, saved to a database or stored in localStorage.
- Student ID must be a 2 to 4 digit number.