# Ocean Chat (React)

Modern, minimal chatbot frontend (Create React App) with an **Ocean Professional** theme.

## Features

- Header / transcript / composer layout
- User / assistant / system message variants
- Typing indicator, error UI, Stop + Retry controls
- Optional persistence via `localStorage`
- **Mock-first**: runs without any backend by default

## Environment variables (CRA)

These are read from your environment at build/start time:

- `REACT_APP_API_BASE`  
  When set, the app will attempt to POST to `POST {REACT_APP_API_BASE}/chat` with `{ message: string }`.
  If not set, the app runs in **mock mode** (local echo-style replies).

- `REACT_APP_WS_URL`  
  Reserved for future real-time updates; the code includes a safe WebSocket client stub.

- `REACT_APP_NODE_ENV`  
  Optional override; otherwise CRA’s `NODE_ENV` is used.

### Example

```bash
# Point to a backend (if/when available)
export REACT_APP_API_BASE="https://your-backend.example.com"
export REACT_APP_WS_URL="wss://your-backend.example.com/ws"
npm start
```

## Development

```bash
npm start
```

## Notes

This project intentionally does **not** require any backend services to run.
If your backend uses different endpoints/payloads, update `src/hooks/useChatController.js`.
