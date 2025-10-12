# Garibadli Portal

A minimal Vue 3 single-page app that talks to the `garibaldi_login` service. It presents a centered login form on a grey background with a top-left header saying "Garibadli Systems". After a successful login, it shows a landing view with your token details.

## Prereqs

- Node.js 18+ and npm
- `garibaldi_login` running locally (defaults to `http://localhost:3000`)

## Configure

Optionally set the auth base URL (defaults to `http://localhost:3000`):

- `.env` (create in this folder):
  
  ```ini
  VITE_AUTH_BASE_URL=http://localhost:3000
  ```

## Run

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Notes

- Login endpoint used: `POST /api/auth/login` with `{ username, password }`.
- On success, a JWT is returned; the app stores it in `localStorage` and decodes the payload (no secret required to view claims) to show available info: `sub` (userId), `username`, `reqId`, and `exp`.
- Click "Log out" to clear the token and return to the login screen.

